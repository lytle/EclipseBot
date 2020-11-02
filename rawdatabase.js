const Discord = require('discord.js');
const Sequelize = require('sequelize');
const { prefix, token, producer } = require('./config.json');


const client = new Discord.Client();

var theme = "";


/*
 * Make sure you are on at least version 5 of Sequelize! Version 4 as used in this guide will pose a security threat.
 * You can read more about this issue On the [Sequelize issue tracker](https://github.com/sequelize/sequelize/issues/7310).
 */

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

const CurationSubmissions = sequelize.define('CurationSubmissions', {
	name: {
		type: Sequelize.STRING,
		unique: true,
	},
	username: {
		type: Sequelize.STRING,
		unique: true,
	},
});

client.once('ready', () => {
	/*
	 * equivalent to: CREATE TABLE CurationSubmissions(
	 * name VARCHAR(255),
	 * description TEXT,
	 * username VARCHAR(255),
	 * usage INT
	 * );
	 */
	CurationSubmissions.sync();
	console.log('EclipseBot started!');
});

client.on('message', async message => {
	if (message.content.startsWith(prefix)) {
		const input = message.content.slice(prefix.length).trim().split(' ');
		const command = input.shift();
		const commandArgs = input.join(' ');

		if (command === 'submit') {
			const splitArgs = commandArgs.split(' ');
			const submissionTitle = splitArgs.shift();

			try {
				// Check if there is a submission
				const userCheck = await CurationSubmissions.findOne({ where: { username: message.author.username } });
				if(userCheck) {
					message.channel.send('Replacing your prior submission.');
					await CurationSubmissions.destroy({ where: { username: message.author.username } });
				}

				// add their film
				const tag = await CurationSubmissions.create({
					name: submissionTitle,
					username: message.author.username,
				});
				return message.reply(`you submitted ${tag.name}.`);
			} catch (e) {
				if (e.name === 'SequelizeUniqueConstraintError') {
					return message.channel.send('Someone else has already submitted that.');
				}
				return message.reply('Something went wrong with your submission.');
			}
		}

		else if (command === 'check') {
			const submitter = message.author.username;

			// equivalent to: SELECT * FROM CurationSubmissions WHERE name = 'submissionTitle' LIMIT 1;
			const tag = await CurationSubmissions.findOne({ where: { username: submitter } });
			if (tag) {
				// equivalent to: UPDATE CurationSubmissions SET usage_count = usage_count + 1 WHERE name = 'submissionTitle';
				return message.channel.send(`${tag.get('name')} is your submission.`);
			}
			return message.reply(`You haven't submitted anything this week.`);
		}

		else if (command === 'list') {
			// equivalent to: SELECT name FROM CurationSubmissions;
			const tagList = await CurationSubmissions.findAll({ attributes: ['name'] });
			const CurationSubmissionstring = tagList.map(t => t.name).join(', ') || 'No CurationSubmissions set.';
			return message.channel.send(`Curation Submissions:\n${CurationSubmissionstring}`);
		}


		else if (command === 'clear') {
			if(!message.member.roles.cache.has(producer)) return message.reply(`only approved members may use this command.`);
			else {
				// equivalent to: DELETE from CurationSubmissions WHERE name = ?;
				const count = await CurationSubmissions.destroy({ truncate: true });
				return message.reply(`${count} submission(s) cleared.`);
			}
		}

		else if (command === 'theme') {
				const splitArgs = commandArgs.split(' ');
				const newTheme = splitArgs.shift();

				// if an arg is passed, it must be by a producer
				if (newTheme === "clear") {
					theme = "";
					return message.channel.send(`Theme cleared`);
				}
				else if (newTheme) {
					if(!message.member.roles.cache.has(producer)) return message.reply(`only approved members may use this command.`);
					else {
						theme = newTheme; // then set it
						return message.channel.send(`New theme set.`);
					}
				}
				else if (theme) return message.channel.send(`Theme: ${theme}`);
				else return message.channel.send(`The theme is not yet set.`);
		}

		else if (command === 'settheme') {
			if(!message.member.roles.cache.has(producer)) return message.reply(`only approved members may use this command.`);
			else {
				// equivalent to: DELETE from CurationSubmissions WHERE name = ?;
				theme = "meow";
			}
		}


	}
});

client.login(token);
