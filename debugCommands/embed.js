const Discord = require('discord.js');

module.exports = {
	name: 'embed',
  cooldown: 0,
	description: 'Embed test.',
	aliases: ['e'],
	execute(message, args) {
    const data = [];
    const { commands } = message.client;

    const exampleEmbed = new Discord.MessageEmbed().setTitle('Some title')
  	.setColor('#ffffff')
  	.setTitle('Some title')
  	.setURL('https://discord.js.org/')
  	.setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
  	.setDescription('Some description here')
  	.setThumbnail('https://i.imgur.com/wSTFkRM.png')
  	.addFields(
  		{ name: 'Regular field title', value: 'Some value here' },
  		{ name: '\u200B', value: '\u200B' },
  		{ name: 'Inline field title', value: 'Some value here', inline: true },
  		{ name: 'Inline field title', value: 'Some value here', inline: true },
  	)
  	.addField('Inline field title', 'Some value here', true)
  	.setTimestamp()
  	.setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

    return message.reply(exampleEmbed);
	},
};
