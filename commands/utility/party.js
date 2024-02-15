// party.js

const { SlashCommandBuilder } = require('@discordjs/builders');
const { partyInfo } = require('../../playervariables');

// This map will hold the IDs of users who have recently used the command and the time they used it.
const cooldown = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('party')
        .setDescription('Form a party with another user!')
        .addUserOption(option => 
            option.setName('user')
            .setDescription('The user to form a party with')
            .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        if (user.id === interaction.user.id) {
            return interaction.reply('You cannot form a party with yourself!');
        }

        const userId = interaction.user.id;

        // If the user has recently used the command, reply with an error message and return early.
        const lastUsed = cooldown.get(userId);
        const now = Date.now();
        const cooldownTime = 70 * 1000; // 1 minute and 10 seconds in milliseconds

        if (lastUsed && (now - lastUsed) < cooldownTime) {
            return interaction.reply('Cooldown!');
        }

        partyInfo[userId] = 1;

        await interaction.reply(`Party formed between ${interaction.user.username} and ${user.username}!`);

        // Add the user's ID and the current time to the cooldown map.
        cooldown.set(userId, now);
    },
};