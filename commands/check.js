//var CurationSubmissions = require('../index.js');

/*let submitModule = {
	name: 'submit',
  cooldown: 15,
  usage: `<film>`,
	description: 'Submit a film for Curation Club.',
	args: true,
	execute: execute
};*/

async function execute(message, args, CurationSubmissions) { // no fuckin clue why i have to pass this as a var
	//const splitArgs = args.split(' ');
	const submissionTitle = args[0];


	try {
		const submitter = message.author.username;

		// equivalent to: SELECT * FROM CurationSubmissions WHERE name = 'submissionTitle' LIMIT 1;
		const tag = await CurationSubmissions.findOne({ where: { username: submitter } });
		if (tag) {
			// equivalent to: UPDATE CurationSubmissions SET usage_count = usage_count + 1 WHERE name = 'submissionTitle';
			return message.channel.send(`${tag.get('name')} is your submission.`);
		}
		return message.reply(`You haven't submitted anything this week.`);

	} catch (e) {
		if (e.name === 'SequelizeUniqueConstraintError') {
			return message.channel.send('Something is very wrong with your username.');
		}
		return message.reply(`Something went wrong with your submission: ${e.name}`);
	}
}

module.exports = {
	name: 'check',
	aliases: ['c', 'info'],
  cooldown: 15,
  usage: ``,
	description: 'Check your submission for Curation Club.',
	args: false
};

module.exports.execute = execute;
