const { PermissionFlagsBits } = require("discord.js");

const Email = require("../../models/Email");
const {
	fetchSubscription,
	fetchCustomer,
	addRolesToMember,
} = require("../../utility/Stripe");
const { replyOrEditInteraction } = require("../../utility/interaction");
const { handleInteractionError } = require("../../utility/interaction");
const config = require("../../config.json");
const {
	sendNotifyEmbed,
	generateSubsRegisterEmbed,
} = require("../../utility/embed");

const { GUILD_ID, ROLE_TO_GIVE_ON_EVERY_SUB } = process.env;

module.exports = async (interaction) => {
	try {
		if (!interaction.isModalSubmit()) return;

		const {
			customId,
			fields,
			user: { id: userId },
			client,
		} = interaction;

		if (customId !== "emailSubmissionModal") return;

		await interaction.deferReply({ ephemeral: true });

		const email = fields.getTextInputValue("email");
		const guild = client.guilds.cache.get(GUILD_ID);

		const member = await guild.members
			.fetch(userId)
			.catch((e) => console.log(e));

		if (!member) throw new Error(`You are no longer a member of ${guild.name}`);

		const isEmailRegistered = await Email.findOne({ email });

		if (isEmailRegistered) throw new Error("The email is already registered");

		const { data } = await fetchCustomer(email);

		if (data.length === 0)
			throw new Error("Could not find any customer on stripe with that email");

		const { data: subscrptionData } = await fetchSubscription(data[0].id);

		if (
			subscrptionData.length === 0 ||
			(subscrptionData[0]?.status !== "active" &&
				subscrptionData[0]?.status !== "trialing")
		)
			throw new Error(
				"Your subscription is not active, please try again after activating it",
			);

		console.log(subscrptionData);
		const package = config[subscrptionData[0].plan?.product];

		if (!package) throw new Error("Something went wrong");

		const { roleId, isSession, shouldNotGiveCoachingRole } = package;

		await addRolesToMember(
			member,
			isSession || shouldNotGiveCoachingRole
				? [roleId]
				: [roleId, ROLE_TO_GIVE_ON_EVERY_SUB],
		);

		const doc = await Email.findOne({ userId });

		if (!doc && !isSession)
			await Email.create({
				userId,
				email,
				customerId: data[0].id,
				planId: subscrptionData[0].plan?.product,
			});

		if (doc && !isSession)
			await doc.updateOne({
				email,
				customerId: data[0].id,
				planId: subscrptionData[0].plan?.product,
			});

		await replyOrEditInteraction(interaction, {
			embeds: [generateSubsRegisterEmbed(member)],
		});

		await sendNotifyEmbed({ guild, added: true, roleId, member });
	} catch (error) {
		await handleInteractionError(error, interaction);
	}
};
