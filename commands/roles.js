const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const rolesConfig = require('../roles-config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sanrio')
        .setDescription('Kies je favoriete Sanrio karakter rol!')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const options = rolesConfig.map(role => ({
            label: role.label,
            value: role.roleId,
        }));

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('role_select')
            .setPlaceholder('Kies je Sanrio!')
            .addOptions(options);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        const embed = new EmbedBuilder()
            .setColor('#FFDDC1') // Een zachte, pastelkleur
            .setTitle('Kies je Sanrio!')
            .setDescription('Laat iedereen zien wie je favoriete Sanrio karakter is door een rol te kiezen.')
            .setImage('https://i.pinimg.com/originals/45/87/8a/45878a8aa08699b9b8bd13f60903d98e.gif') // Een leuke gif
            .setFooter({ text: 'Selecteer je rol in het menu hieronder.', iconURL: interaction.client.user.displayAvatarURL() });

        await interaction.reply({
            embeds: [embed],
            components: [row]
        });
    },
};
