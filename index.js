const { Client, IntentsBitField, Partials } = require("discord.js");
const WOK = require("wokcommands");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const cron = require("node-cron");

dotenv.config({ path: ".env" });

const Email = require("./models/Email");
const { fetchSubscription } = require("./utility/Stripe");
const { sendNotifyEmbed, sendUserEmbed } = require("./utility/embed");
const config = require("./config.json");

const { TOKEN, MONGO_URI, GUILD_ID } = process.env;

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.DirectMessages,
		IntentsBitField.Flags.MessageContent,
		IntentsBitField.Flags.GuildInvites,
	],
	partials: [Partials.Channel],
});

client.on("ready", (readyClient) => {
	console.log(`${readyClient.user.username} is running 🥗`);

	mongoose
		.connect(MONGO_URI)
		.then(() => console.log("Connected to db 🧨"))
		.catch((e) => console.log("Error connecting to database" + e));

	cron.schedule("*/10 * * * *", checkForSubscriptions);
	const { DefaultCommands } = WOK;
	new WOK({
		client,
		commandsDir: path.join(__dirname, "./commands"),
		events: {
			dir: path.join(__dirname, "events"),
		},
		disabledDefaultCommands: [
			DefaultCommands.ChannelCommand,
			DefaultCommands.CustomCommand,
			DefaultCommands.Prefix,
			DefaultCommands.RequiredPermissions,
			DefaultCommands.RequiredRoles,
			DefaultCommands.ToggleCommand,
		],
		cooldownConfig: {
			errorMessage: "Please wait {TIME} before doing that again.",
			botOwnersBypass: false,
			dbRequired: 300,
		},
	});
});

client.login(TOKEN);

async function checkForSubscriptions() {
	const docs = await Email.find().catch((e) => console.log(e));
	console.log("running every minute");

	for (const doc of docs) {
		let member, guild, roleId
		try {
			const { customerId, planId, roleId: roleIdForOldDocuments, userId } = doc;

			const configForPlan = config[planId];
			 roleId = configForPlan?.roleId ?? roleIdForOldDocuments;

			if (!roleId)
				return console.log(
					`No config or role found for the plan ${planId} / role (${roleId}) (User: ${userId})`,
				);

			 guild = client.guilds.cache.get(GUILD_ID);
			 member = await guild.members.fetch(userId).catch(() => null);

			if (!member) continue;

			const response = await fetchSubscription(customerId).catch((e) => e);

			if (response?.raw?.statusCode === 400) {
				if (!member.roles.cache.has(roleId)) continue;
				await member.roles.remove(roleId);
				await sendNotifyEmbed({ guild, member, roleId });
				await sendUserEmbed(member, "cancel");
				continue;
			}

			const { data: subscrptionData } = response;
			const isActive =
				subscrptionData[0]?.status === "active" ||
				subscrptionData[0]?.status === "trialing";

			if (subscrptionData.length === 0 || !isActive) {
				if (!member.roles.cache.has(roleId)) continue;

				await member.roles.remove(roleId);

				await sendNotifyEmbed({ guild, member, roleId });
				await sendUserEmbed(member, "cancel", subscrptionData[0]?.status);
			}

			if (isActive) {
				if (member.roles.cache.has(roleId)) continue;
				await member.roles.add(roleId);
				await sendNotifyEmbed({ guild, member, added: true, roleId });
				await sendUserEmbed(member, "reactivate", subscrptionData[0]?.status);
			}
		} catch (error) {
			await sendNotifyEmbed({ guild, member, error:true, message:error?.message , roleId }).catch(console.error)
			console.log(error);
		}
	}
}
