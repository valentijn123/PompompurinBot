const { Events } = require('discord.js');
const birthdayChecker = require('../features/birthdayChecker');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		birthdayChecker(client);
	},
};
