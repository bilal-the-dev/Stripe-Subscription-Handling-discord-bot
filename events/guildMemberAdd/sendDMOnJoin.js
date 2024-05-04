const { generateDMButton } = require("../../utility/button");
const { generateDMEmbed } = require("../../utility/embed");

module.exports = async (member) => {
	try {
		const embed = generateDMEmbed(member.guild);
		const button = generateDMButton();

		await member.send({ embeds: [embed], components: [button] });
	} catch (error) {
		console.log(error);
	}
};
