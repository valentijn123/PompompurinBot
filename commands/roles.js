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
            .setPlaceholder('Kies je vriendje!')
            .addOptions(options);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        const embed = new EmbedBuilder()
            .setColor('#FFDDC1') // Een zachte, pastelkleur
            .setTitle('Kies je Sanrio!')
            .setDescription('Laat iedereen zien wie je favoriete Sanrio karakter is door een rol te kiezen. Je kunt maar één Sanrio rol tegelijk hebben.')
            .setImage('https://c.tenor.com/k-2g8i4l_9AAAAAC/pompompurin.gif') // Een leuke gif
            .setFooter({ text: 'Selecteer je rol in het menu hieronder.', iconURL: interaction.client.user.displayAvatarURL() });

        await interaction.reply({
            embeds: [embed],
            components: [row]
        });
    },
};
