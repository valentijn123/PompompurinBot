const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const gamesConfig = require('../games-config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('games')
        .setDescription('Kies je games!')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const options = gamesConfig.map(game => ({
            label: game.label,
            value: game.roleId,
        }));

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('games_select')
            .setPlaceholder('Selecteer de games die je speelt')
            .setMinValues(0)
            .setMaxValues(options.length)
            .addOptions(options);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        const embed = new EmbedBuilder()
            .setColor('#74E291') // Een levendige, groene kleur
            .setTitle('Kies je Game Rollen!')
            .setDescription('Selecteer de games die je speelt om de bijbehorende rol te krijgen. Zo kun je makkelijk zien wie wat speelt en pings ontvangen voor game-avonden!')
            .setImage('https://i.imgur.com/Hmp7TIJ.gif') // Een passende gaming gif
            .setFooter({ text: 'Je kunt meerdere rollen tegelijk selecteren.', iconURL: interaction.client.user.displayAvatarURL() });

        await interaction.reply({
            embeds: [embed],
            components: [row]
        });
    },
};
