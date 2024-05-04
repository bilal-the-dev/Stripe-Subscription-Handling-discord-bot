const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const generateDMButton = function () {
	const submit = new ButtonBuilder()
		.setCustomId("emailSubmissionButton")
		.setLabel("Email Submission")
		.setStyle(ButtonStyle.Danger);

	return new ActionRowBuilder().addComponents(submit);
};

module.exports = { generateDMButton };
