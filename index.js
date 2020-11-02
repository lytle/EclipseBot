// Refs ------------------------------------------------------------------------
const fs = require('fs');
const Discord = require('discord.js');
const Sequelize = require('sequelize');
const { prefix, token } = require('./config.json');

// Discord connection ----------------------------------------------------------
const client = new Discord.Client();

// Database connection ---------------------------------------------------------
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

const CurationSubmissions = sequelize.define('submissions', {
	name: {
		type: Sequelize.STRING,
		unique: true,
	},
	username: Sequelize.STRING,
	usage_count: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});

// Command management-----------------------------------------------------------
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	console.log(`Added ${command.name}`);
	client.commands.set(command.name, command);
}

// Cooldown management ---------------------------------------------------------
const cooldowns = new Discord.Collection();


// INIT ------------------------------------------------------------------------
client.once('ready', () => {
	console.log('EclipseBot started!'); // yay
	CurationSubmissions.sync(); // setup curation submissions
});

// Parse -----------------------------------------------------------------------
client.on('message', message => {
	// Prefix stuff
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	// Check in commands or aliases
	const command = client.commands.get(commandName)
									|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	// Check if this command requires args
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	// Check for cooldowns
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			//return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}
	else
	{
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}

	// Execute the command based on files in commands folder
	try {
		command.execute(message, args, CurationSubmissions); // no clue why this works
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
	// other commands...
});

// Error logging ---------------------------------------------------------------
client.on('shardError', error => {
	 console.error('A websocket connection encountered an error:', error);
});

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

// GO --------------------------------------------------------------------------
client.login(process.env.BOT_TOKEN);

