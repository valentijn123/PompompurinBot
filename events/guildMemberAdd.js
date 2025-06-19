const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const roleId = '1384615430169300992';
        const role = member.guild.roles.cache.get(roleId);

        if (!role) {
            console.error(`Error: Auto-role with ID ${roleId} not found.`);
            return;
        }

        try {
            await member.roles.add(role);
            console.log(`Assigned role ${role.name} to ${member.user.tag}.`);
        } catch (error) {
            console.error(`Failed to assign auto-role to ${member.user.tag}:`, error);
        }
    },
};
