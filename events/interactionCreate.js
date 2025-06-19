const { Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const fs = require('fs');
const path = require('path');
const rolesConfig = require('../roles-config.json');
const gamesConfig = require('../games-config.json');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error while executing this command!', flags: [MessageFlags.Ephemeral] });
			}
		} else if (interaction.isStringSelectMenu()) {
			if (interaction.customId === 'role_select') {
				const selectedRoleId = interaction.values[0];
				const member = interaction.member;
				const sanrioRoleIds = rolesConfig.map(r => r.roleId);

				const role = interaction.guild.roles.cache.get(selectedRoleId);
				if (!role) {
					await interaction.reply({ content: 'Die rol kon niet worden gevonden.', flags: [MessageFlags.Ephemeral] });
					return;
				}

				try {
					// Verwijder eerst alle andere Sanrio-rollen
					const rolesToRemove = member.roles.cache.filter(r => sanrioRoleIds.includes(r.id));
					await member.roles.remove(rolesToRemove);

					// Voeg de nieuwe rol toe, tenzij de gebruiker op dezelfde rol heeft geklikt (dan wordt deze alleen verwijderd)
					if (!rolesToRemove.has(role.id)) {
						await member.roles.add(role);
						await interaction.reply({ content: `Je hebt nu de rol **${role.name}**!`, flags: [MessageFlags.Ephemeral] });
					} else {
						await interaction.reply({ content: `De rol **${role.name}** is van je verwijderd.`, flags: [MessageFlags.Ephemeral] });
					}
				} catch (error) {
					console.error('Fout bij het aanpassen van de Sanrio-rol:', error);
					await interaction.reply({ content: 'Er is een fout opgetreden bij het aanpassen van je rollen.', flags: [MessageFlags.Ephemeral] });
				}
			} else if (interaction.customId === 'games_select') {
				const member = interaction.member;
				const selectedRoleIds = interaction.values;
				const allGameRoleIds = gamesConfig.map(g => g.roleId);

				try {
					// Filter de huidige rollen van de gebruiker om alleen de niet-game rollen te behouden
					const nonGameRoles = member.roles.cache.filter(role => !allGameRoleIds.includes(role.id));

					// Creëer de nieuwe, volledige lijst van rollen
					const newRoles = [...nonGameRoles.keys(), ...selectedRoleIds];

					// Stel de rollen in één atomaire actie in
					await member.roles.set(newRoles);

					await interaction.reply({ content: 'Je game-rollen zijn succesvol bijgewerkt!', flags: [MessageFlags.Ephemeral] });
				} catch (error) {
					console.error('Fout bij het aanpassen van de game-rollen:', error);
					await interaction.reply({ content: 'Er is een fout opgetreden bij het aanpassen van je rollen.', flags: [MessageFlags.Ephemeral] });
				}
			}
		} else if (interaction.isButton()) {
			if (interaction.customId === 'add_birthday_button') {
				const modal = new ModalBuilder()
					.setCustomId('birthday_modal')
					.setTitle('Voeg je verjaardag toe');

				const dayInput = new TextInputBuilder()
					.setCustomId('birthday_day')
					.setLabel("Geboortedag (DD)")
					.setStyle(TextInputStyle.Short)
					.setMinLength(1)
					.setMaxLength(2)
					.setPlaceholder('Bijv. 05')
					.setRequired(true);

				const monthInput = new TextInputBuilder()
					.setCustomId('birthday_month')
					.setLabel("Geboortemaand (MM)")
					.setStyle(TextInputStyle.Short)
					.setMinLength(1)
					.setMaxLength(2)
					.setPlaceholder('Bijv. 11')
					.setRequired(true);

				const firstActionRow = new ActionRowBuilder().addComponents(dayInput);
				const secondActionRow = new ActionRowBuilder().addComponents(monthInput);

				modal.addComponents(firstActionRow, secondActionRow);
				await interaction.showModal(modal);
			}
		} else if (interaction.isModalSubmit()) {
			if (interaction.customId === 'birthday_modal') {
				const day = parseInt(interaction.fields.getTextInputValue('birthday_day'), 10);
				const month = parseInt(interaction.fields.getTextInputValue('birthday_month'), 10);

				if (isNaN(day) || isNaN(month) || day < 1 || day > 31 || month < 1 || month > 12) {
					await interaction.reply({ content: 'Ongeldige datum. Geef een geldige dag (1-31) en maand (1-12).', flags: [MessageFlags.Ephemeral] });
					return;
				}

				const birthdaysPath = path.join(__dirname, '..', 'birthdays.json');
				let birthdays = JSON.parse(fs.readFileSync(birthdaysPath, 'utf-8'));

				birthdays[interaction.user.id] = { day, month };
				fs.writeFileSync(birthdaysPath, JSON.stringify(birthdays, null, 4));

				// Stuur een privé bevestiging
				await interaction.reply({ content: `Je verjaardag op ${day}/${month} is opgeslagen!`, flags: [MessageFlags.Ephemeral] });

				// Update de originele embed
				const monthNames = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
				const sortedBirthdays = Object.entries(birthdays)
					.map(([userId, { day, month }]) => ({ userId, day, month }))
					.sort((a, b) => {
						if (a.month !== b.month) return a.month - b.month;
						return a.day - b.day;
					});

				const description = sortedBirthdays
					.map(b => `<@${b.userId}> - ${b.day} ${monthNames[b.month - 1]}`)
					.join('\n');

				const updatedEmbed = new EmbedBuilder()
					.setColor('#FFC0CB')
					.setTitle('Verjaardagskalender 🎂')
					.setDescription(description)
					.setImage('https://i.imgur.com/sRHafiV.gif') // Feestelijke GIF
					.setFooter({ text: 'Voeg jouw verjaardag toe of werk hem bij!' });

				// Bewerk het originele bericht waar de knop op zat
				await interaction.message.edit({ embeds: [updatedEmbed] });
			}
		}
	},
};
