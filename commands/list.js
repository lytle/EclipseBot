const Discord = require('discord.js');

async function execute(message, args, CurationSubmissions) { // no fuckin clue why i have to pass this as a var
	//const splitArgs = args.split(' ');

try {

		const usernameList = await CurationSubmissions.findAll({ attributes: ['username'] });
		const usernames = usernameList.map(t => t.username) || 'No CurationSubmissions set.';

		const submissionsList = await CurationSubmissions.findAll({ attributes: ['name'] });
		const submissions = submissionsList.map(t => t.name) || 'No CurationSubmissions set.';

		const returnEmbed = new Discord.MessageEmbed()
		.setTitle('Curation Club - 10/12/2020')
  	.setColor('#ffffff')
  	.setURL('https://letterboxd.com/sisyphusspacek/list/criterion-discord-curation-clubs-film-of/')
  	.setTimestamp()
  	.setFooter('Theme: Robot Week', 'https://thedigitalbits.com/media/k2/items/cache/fd6c1bb5b0a1bed64c5dda3726185da3_XL.jpg');

		if(submissions.length === 0) {
			returnEmbed.addField(`No submissions`, `\u200b`, false);
		}
		else {
			// List out submissions
			var i = 0;
			for (const submission in submissions) { // why tf does this work but not a for
				returnEmbed.addFields(
		  		{ usernames[i], submissions[i++] },
		  		{ name: '\u200B', value: '\u200B' }
				);
			}
		}

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
	name: 'list',
  cooldown: 15,
  usage: ``,
	aliases: ['l', 'submissions'],
	description: 'List all submissions for Curation Club.',
	args: false
};

module.exports.execute = execute;
