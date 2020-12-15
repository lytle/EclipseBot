module.exports = {
	name: 'ozu',
  cooldown: 15,
	description: 'Request our ozu guide.',
	args: false,
	execute(message, args) {
		message.channel.send(`https://cdn.discordapp.com/attachments/702861139683311622/785620468420968518/ozuflowcharttm.png`);
	},
};
