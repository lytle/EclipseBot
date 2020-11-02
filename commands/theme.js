const Discord = require('discord.js');
const { producer } = require('../config.json');

var theme = "Robot Week"; // to-do: move this to main index

async function execute(message, args, CurationSubmissions) { // no fuckin clue why i have to pass this as a var

	try {

		if(message.member.roles.cache.has(producer) && args.length > 0) {
			theme = args.join(` `);
		}

		const returnEmbed = new Discord.MessageEmbed()
  	.setFooter(`Theme: ${theme}`, 'https://thedigitalbits.com/media/k2/items/cache/fd6c1bb5b0a1bed64c5dda3726185da3_XL.jpg');
		//return message.channel.send(`Curation Submissions:\n${CurationSubmissionstring}`);
		return message.channel.send(returnEmbed);

	} catch (e) {
		if (e.name === 'SequelizeUniqueConstraintError') {
			return message.channel.send('Something is very wrong with your list.');
		}
		return message.reply(`Something went wrong with your list: ${e.name}`);
	}

}

module.exports = {
	name: 'theme',
  cooldown: 15,
  usage: `t`,
	aliases: ['t'],
	description: 'Check the theme for Curation Club.',
	args: false
};

module.exports.execute = execute;
