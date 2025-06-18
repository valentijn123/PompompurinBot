const { Events } = require('discord.js');

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
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		} else if (interaction.isStringSelectMenu()) {
			if (interaction.customId === 'role_select') {
				const selectedRoleId = interaction.values[0];
				const member = interaction.member;

				// VERVANG DEZE PLACEHOLDERS DOOR DE ECHTE ROL ID'S
				const sanrioRoleIds = [
					'pompompurin_role_id',
					'pochacco_role_id',
					'tippy_role_id'
				];

				const role = interaction.guild.roles.cache.get(selectedRoleId);
				if (!role) {
					await interaction.reply({ content: 'Die rol kon niet worden gevonden.', ephemeral: true });
					return;
				}

				try {
					// Verwijder eerst alle andere Sanrio-rollen
					const rolesToRemove = member.roles.cache.filter(r => sanrioRoleIds.includes(r.id));
					await member.roles.remove(rolesToRemove);

					// Voeg de nieuwe rol toe, tenzij de gebruiker op dezelfde rol heeft geklikt (dan wordt deze alleen verwijderd)
					if (!rolesToRemove.has(role.id)) {
						await member.roles.add(role);
						await interaction.reply({ content: `Je hebt nu de rol **${role.name}**!`, ephemeral: true });
					} else {
						await interaction.reply({ content: `De rol **${role.name}** is van je verwijderd.`, ephemeral: true });
					}
				} catch (error) {
					console.error('Fout bij het aanpassen van de Sanrio-rol:', error);
					await interaction.reply({ content: 'Er is een fout opgetreden bij het aanpassen van je rollen.', ephemeral: true });
				}
			}
		}
	},
};
