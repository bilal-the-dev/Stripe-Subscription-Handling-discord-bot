const { EmbedBuilder, channelMention } = require("discord.js");
const { TICKET_CHANNEL_ID } = process.env;
const generateGeneralEmbed = function ({
	title,
	url,
	description,
	fields,
	thumbnail,
	footer,
}) {
	const embed = new EmbedBuilder().setColor("Aqua");

	title && embed.setTitle(title);
	url && embed.setURL(url);
	description && embed.setDescription(description);
	thumbnail && embed.setThumbnail(thumbnail);
	fields && embed.addFields(...fields);
	footer && embed.setFooter(footer);
	return embed;
};

const generateDMEmbed = function (guild) {
	return generateGeneralEmbed({
		title: ":bangbang: Member Verification :bangbang:",
		description: `Welcome to my domain >:) Type in the email you used in Stripe to gain full access to the server. If you run into a problem, create a ticket below or message <@473520735357370378>`,
		thumbnail: guild.iconURL(),
		footer: {
			text: guild.name,
			iconURL: guild.iconURL(),
		},
	});
};

const generateSubsRegisterEmbed = function (member) {
	return generateGeneralEmbed({
		title: ":bangbang: Welcome :bangbang:",
		description: `Your climbing journey officially begins now <33 Your support doesn't go unnoticed and we're excited to help you learn more, grow from each other, and have some fun - Dobby\n\nYou can manage your subscription [here](https://portal.dobbysnest.com/p/login/14kbK556m8QbaGs144)`,
		thumbnail: member.displayAvatarURL(),
	});
};
const generateSubsCancelEmbed = function (member) {
	return generateGeneralEmbed({
		title: ":bangbang: Subscription Update :bangbang:",
		description: `Nooooo I'm sad to see you go :( If you want us to get better from your experience, click [here](https://forms.gle/tGqsYAYXoTAKZ6u27) to fill out a survey. Once you're done, DM our Admin, @ffm11 that you filled it out and we'll give you a lil gift <3\n\nIf this is a mistake, check out what went wrong in your customer portal [here](https://portal.dobbysnest.com/p/login/14kbK556m8QbaGs144). If you can't figure it out, create a ticket in ${channelMention(
			TICKET_CHANNEL_ID,
		)} and we'll get you sorted out ASAP `,
		thumbnail: member.displayAvatarURL(),
	});
};
const generateSubsReActiveEmbed = function (member) {
	return generateGeneralEmbed({
		title: ":bangbang: Subscription Update :bangbang:",
		description: `Welcome back to the Nest B)`,
		thumbnail: member.displayAvatarURL(),
	});
};

const sendNotifyEmbed = async function ({
	added = false,
	member,
	roleId,
	guild,
	error, 
	message
}) {
	const fields = [
		{ name: "User", value: `${member}` },
		{ name: "Role", value: `<@&${roleId}>` },
	];

	const options = {
		title: added ? "Subscription added 🐰" : "Subscription removed 🐰",
		thumbnail: member.displayAvatarURL(),
		fields,
	};


	if(error){
		options.title = 'Error occured!'
		options.description = message
	}
	const embed = generateGeneralEmbed(options);

	const logsChannel = await guild.channels.fetch(process.env.LOGS_CHANNEL_ID);

	await logsChannel.send({ embeds: [embed] });
};

const sendUserEmbed = async (member, type, status) => {
	let embed;

	if (type === "cancel") embed = generateSubsCancelEmbed(member);
	if (type === "initialActive") embed = generateSubsRegisterEmbed(member);
	if (type === "reactivate") embed = generateSubsReActiveEmbed(member);
	await member
		.send({
			content:
				type !== "initialActive"
					? `# Subscription Status : ${status ?? "Deactivated"}`
					: "",
			embeds: [embed],
		})
		.catch(() => null);
};
module.exports = {
	generateDMEmbed,
	sendUserEmbed,
	generateSubsRegisterEmbed,
	generateSubsCancelEmbed,
	sendNotifyEmbed,
};
