// disband.js

const { SlashCommandBuilder } = require('@discordjs/builders');
const { partyInfo } = require('../../playervariables');

// This set will hold the IDs of users who have recently used the command.
const cooldown = new Set();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disbandparty')
        .setDescription('Disband your party!'),
    async execute(interaction) {
        const userId = interaction.user.id;

        // If the user has recently used the command, reply with an error message and return early.
        if (cooldown.has(userId)) {
            return interaction.reply('Cooldown!');
        }

        // If the user is not in a party, reply with an error message and return early.
        if (partyInfo[userId] !== 1) {
            return interaction.reply('Not currently in a party!');
        }

        partyInfo[userId] = 0;

        await interaction.reply('Party has been disbanded!');

        // Add the user's ID to the cooldown set.
        cooldown.add(userId);

        // Remove the user's ID from the cooldown set after 5 seconds.
        setTimeout(() => {
            cooldown.delete(userId);
        }, 5000);
    },
};