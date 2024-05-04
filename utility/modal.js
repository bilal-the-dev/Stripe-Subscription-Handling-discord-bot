const {
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} = require("discord.js");

const generateEmailSubmitModal = function () {
	const modal = new ModalBuilder()
		.setCustomId("emailSubmissionModal")
		.setTitle("Email Input");

	const email = new TextInputBuilder()
		.setCustomId("email")
		.setLabel("Stripe Email")
		.setPlaceholder("Enter your stripe email")

		.setStyle(TextInputStyle.Short);

	const firstActionRow = new ActionRowBuilder().addComponents(email);

	modal.addComponents(firstActionRow);

	return modal;
};

module.exports = { generateEmailSubmitModal };
