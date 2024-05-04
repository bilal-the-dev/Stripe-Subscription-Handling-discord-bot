const { generateDMEmbed } = require("../../utility/embed");
const { generateDMButton } = require("../../utility/button");

module.exports = async (message) => {
	// me the developer
	if (
		message.author.id !== "620547628857425920" ||
		message.content !== "!startDM"
	)
		return;
	const embed = generateDMEmbed(message.guild);
	const button = generateDMButton();

	const members = await message.guild.members.fetch();
	await message.reply("sending the DMs");

	for (const member of [...members.values()])
		await member
			.send({ embeds: [embed], components: [button] })
			.catch(() => null);
};
