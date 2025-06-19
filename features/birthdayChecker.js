const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    const checkBirthdays = async () => {
        console.log('Checking for birthdays...');
        const birthdaysPath = path.join(__dirname, '..', 'birthdays.json');
        if (!fs.existsSync(birthdaysPath)) return;

        const birthdays = JSON.parse(fs.readFileSync(birthdaysPath, 'utf-8'));
        const today = new Date();
        const currentDay = today.getDate();
        const currentMonth = today.getMonth() + 1; // Maanden zijn 0-geïndexeerd

        const birthdayUsers = Object.keys(birthdays).filter(userId => {
            const birthday = birthdays[userId];
            return birthday.day === currentDay && birthday.month === currentMonth;
        });

        if (birthdayUsers.length > 0) {
            const channelId = '1384514104080990268'; // Het opgegeven kanaal-ID
            const channel = await client.channels.fetch(channelId);

            if (channel) {
                const userMentions = birthdayUsers.map(id => `<@${id}>`).join(', ');
                const message = `@everyone Vandaag vieren we de verjaardag van ${userMentions}! 🎉 Gefeliciteerd!`;
                await channel.send(message);
            } else {
                console.error(`Error: Channel with ID ${channelId} not found.`);
            }
        }
    };

    // Voer de check direct uit bij het opstarten, en daarna elke 24 uur.
    checkBirthdays();
    setInterval(checkBirthdays, 24 * 60 * 60 * 1000); // 24 uur in milliseconden
};
