const { producer } = require('../config.json');


async function execute(message, args, CurationSubmissions) { // no fuckin clue why i have to pass this as a var
	//const splitArgs = args.split(' ');

	if(!message.member.roles.cache.has(producer)) return message.reply(`only approved members may use this command.`);
	else {
		// equivalent to: DELETE from CurationSubmissions WHERE name = ?;
		const count = await CurationSubmissions.destroy({ truncate: true });
		return message.reply(`${count} submission(s) cleared.`);
	}

}

module.exports = {
	name: 'clear',
  cooldown: 15,
  usage: `Mod Command`,
	description: 'Used by mods to reset the week',
	args: false
};

module.exports.execute = execute;
