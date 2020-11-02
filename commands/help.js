const { prefix } = require('../config.json');

module.exports = {
	name: 'help',
  cooldown: 15,
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	execute(message, args) {
    const data = [];
    const { commands } = message.client;

    if (!args.length) {
      data.push('Here\'s a list of all my commands:');
      data.push(commands.map(command => command.name).join(', '));
      data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

      return message.reply(data, { split: true });

     }
	},
};
