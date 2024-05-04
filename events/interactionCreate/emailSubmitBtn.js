const { handleInteractionError } = require("../../utility/interaction");
const { generateEmailSubmitModal } = require("../../utility/modal");

module.exports = async (interaction) => {
	try {
		if (!interaction.isButton()) return;
		if (interaction.customId !== "emailSubmissionButton") return;

		const modal = generateEmailSubmitModal();

		await interaction.showModal(modal);
	} catch (error) {
		await handleInteractionError(error, interaction);
	}
};
