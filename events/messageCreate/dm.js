const { ChannelType } = require("discord.js");

module.exports = async (message) => {
	if (message.author.bot || message.channel.type !== ChannelType.DM) return;
	await message
		.reply("Sorry I can only read messages from the red button")
		.catch(() => null);
};
