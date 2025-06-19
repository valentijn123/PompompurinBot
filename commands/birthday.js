const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verjaardag')
        .setDescription('Toont de verjaardagskalender of voeg je eigen verjaardag toe.'),
    async execute(interaction) {
        const birthdaysPath = path.join(__dirname, '..', 'birthdays.json');
        const birthdays = JSON.parse(fs.readFileSync(birthdaysPath, 'utf-8'));

        const sortedBirthdays = Object.entries(birthdays)
            .map(([userId, { day, month }]) => ({ userId, day, month }))
            .sort((a, b) => {
                if (a.month !== b.month) return a.month - b.month;
                return a.day - b.day;
            });

        const monthNames = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
        let description = "Er zijn nog geen verjaardagen bekend.\nKlik op de knop hieronder om de eerste toe te voegen!";
        if (sortedBirthdays.length > 0) {
            description = sortedBirthdays
                .map(b => `<@${b.userId}> - ${b.day} ${monthNames[b.month - 1]}`)
                .join('\n');
        }

        const embed = new EmbedBuilder()
            .setColor('#FFC0CB') // Roze kleur
            .setTitle('Verjaardagskalender 🎂')
            .setDescription(description)
            .setImage('https://i.imgur.com/sRHafiV.gif') // Feestelijke GIF
            .setFooter({ text: 'Voeg jouw verjaardag toe of werk hem bij!' });

        const addButton = new ButtonBuilder()
            .setCustomId('add_birthday_button')
            .setLabel('Voeg je verjaardag toe')
            .setStyle(ButtonStyle.Success)
            .setEmoji('🎉');

        const row = new ActionRowBuilder().addComponents(addButton);

        await interaction.reply({
            embeds: [embed],
            components: [row],
        });
    },
};
