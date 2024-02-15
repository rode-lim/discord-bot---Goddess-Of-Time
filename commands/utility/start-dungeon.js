// start-dungeon.js

const { SlashCommandBuilder } = require('discord.js');
const { dungeonStarted } = require('../../dungeonning');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start-dungeon-f-rank')
        .setDescription('Starts a dungeon adventure!'),
    async execute(interaction) {
        const userId = interaction.user.id;

        // Initialize dungeonStarted for the user as 0 if it's not already set
        if (dungeonStarted[userId] === undefined) {
            dungeonStarted[userId] = 0;
        }

        // If the user is already in a dungeon, reply with an error message and return early.
        if (dungeonStarted[userId] !== 0) {
            return interaction.reply('Ur currently doing a dungeon, finish it before starting a new one!');
        }

        dungeonStarted[userId] = 1;

        const messages = [
            "You can't see but you can feel a humid temperature, after ur eyes adjust u notice you are in a cave.",
            "You look happy, you can see clear as the day, u seem to be in a \"City\" of some sorts!"
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        await interaction.reply(randomMessage);
    },
};