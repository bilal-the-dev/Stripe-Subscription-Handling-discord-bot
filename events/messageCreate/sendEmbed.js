const { generateDMEmbed } = require("../../utility/embed");
const { generateDMButton } = require("../../utility/button");

module.exports = async (message) => {
	// me the developer
	if (message.author.id !== "125798125636943872" || message.content !== "!send")
		return;
	const embed = generateDMEmbed(message.guild);
	const button = generateDMButton();

	await message.channel.send({ embeds: [embed], components: [button] });
};
