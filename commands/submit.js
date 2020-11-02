//var CurationSubmissions = require('../index.js');

/*let submitModule = {
	name: 'submit',
  cooldown: 15,
  usage: `<film>`,
	description: 'Submit a film for Curation Club.',
	args: true,
	execute: execute
};*/

async function execute(message, args, table) { // no fuckin clue why i have to pass this as a var
	//const splitArgs = args.split(' ');
	const submissionTitle = args[0];


	try {
		 //Check if there is a submission

		 const CurationSubmissions = table;

		const userCheck = await CurationSubmissions.findOne({ where: { username: message.author.username } });

		// CHECK IF SUBMISSION IS PROPER FORMAT
		if (!submissionTitle.includes(`boxd`)) {
			return message.channel.send('Your submission must be a Letterboxd link.');
		}


		// Check if someone has submitted this
		if(userCheck) {
			message.channel.send('Replacing your prior submission.');
			await CurationSubmissions.destroy({ where: { username: message.author.username } });
		}

		// add their film
		const tag = await CurationSubmissions.create({
			name: submissionTitle,
			username: message.author.username,
		});
		return message.reply(`your submission has been accepted`); //${tag.name}.`);
	} catch (e) {
		if (e.name === 'SequelizeUniqueConstraintError') {
			return message.channel.send('Someone else has already submitted that.');
		}
		return message.reply(`Something went wrong with your submission: ${e.name}`);
	}
}

module.exports = {
	name: 'submit',
	aliases: ['s', 'submits'],
  cooldown: 15,
  usage: `<film>`,
	description: 'Submit a film for Curation Club.',
	args: true
};

module.exports.execute = execute;
