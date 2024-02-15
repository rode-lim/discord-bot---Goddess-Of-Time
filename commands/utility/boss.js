// At the start of boss.js
const { dungeonFinish } = require('./advance');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { dungeonbossFound, dungeonStarted } = require('../../dungeonning'); // Import dungeonbossFound

module.exports = {
    data: new SlashCommandBuilder()
        .setName('boss')
        .setDescription('Encounter a boss in the dungeon adventure!'),
    async execute(interaction) {
        const userId = interaction.user.id;

        // If the user hasn't found the boss yet, reply with an error message and return early.
        if (!dungeonbossFound[userId]) {
            return interaction.reply('You must find the boss room before you can encounter the boss!');
        }

        const outcomes = [
            { 
                message: "The room is clear, nothing dirty, its just and empty saloon, what could have happened you wonder. You walk down the saloon until you reach the middle, there suddenly you hear steps coming behind you super quick.\n\nAND SO THE DANCER APROACHES!", 
                weight: 50 
            },
            { 
                message: "The room is dark but has some gems to light the walls and you can see the middle. You look around marvelous from the wonders ahead, you think to yourself, wheres the boss, suddenly from above u hear a rock fall.\n\nYou look up to find youself fighting THE SPIDER QUEEN!", 
                weight: 50 
            },
            { 
                message: "You reach a arena, it feels like u are in an abandoned roman arena, you find it intriguing and at a bit scary or creppy, you wander around a lil, then you hear the other side gate slide open, a moment after comes from it a black knight with fire where his head would be hes, giant compared to you. Like 5m higher than you!\n\nYou know you are battleing THE FLAME OF FORGOTNESS KNIGHT!", 
                weight: 10 
            }
        ];

        const totalWeight = outcomes.reduce((total, outcome) => total + outcome.weight, 0);
        let random = Math.random() * totalWeight;

        for (const outcome of outcomes) {
            if (random < outcome.weight) {
                await interaction.reply(outcome.message);
                dungeonbossFound[userId] = 0; // Reset the boss found status for the user
                dungeonStarted[userId] = 0; // Set dungeonStarted back to 0
                dungeonFinish[userId] = 0; // Set dungeonFinish back to 0
                break;
            }
            random -= outcome.weight;
        }
    },
};
