// advance.js

const { SlashCommandBuilder } = require('@discordjs/builders');
const { dungeonStarted, dungeonbossFound } = require('../../dungeonning'); // Import dungeonbossFound

// This set will hold the IDs of users who have recently used the command.
const cooldown = new Set();

// This object will hold the IDs of users who have finished the dungeon.
const dungeonFinish = {};

// This object will hold the IDs of users and the count of how many times they have used the /advance command.
const lengthOfDungeon = {};

const outcomes = [
    { message: "You arrive at a safe space, nothing really is here besides sight seeing.", weight: 9000 },
    { message: "You have fallen in an encounter case! You must fight a wolf!", weight: 3000 },
    { message: "You have fallen in an encounter case! You must fight a Goblin!", weight: 1700 },
    { message: "You have fallen in an encounter case! You must fight a Giant Spider!", weight: 1600 },
    { message: "You have fallen in an encounter case! You must fight a Juvenile Dragon!", weight: 110 },
    { message: "You have fallen in a material case!\nYou have found a potion!", weight: 1100 },
    { message: "You have fallen in a material case!\nYou have found a book(bring it to a historian)!", weight: 1000 },
    { message: "You have found the boss room! Get ready for the real battle!", weight: 800 }
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('advance')
        .setDescription('Advance in the dungeon adventure!')
        .addStringOption(option => 
            option.setName('direction')
            .setDescription('Direction to advance')
            .setRequired(true)),
    async execute(interaction) {
        const userId = interaction.user.id;

        // Initialize the count for this user if it doesn't exist yet.
        if (!lengthOfDungeon[userId]) {
            lengthOfDungeon[userId] = 0;
        }

        // If the user is not in a dungeon, reply with an error message and return early.
        if (!dungeonStarted[userId]) {
            return interaction.reply('You must start a dungeon in order to advance!');
        }

        // If the user has recently used the command, reply with an error message and return early.
        if (cooldown.has(userId)) {
            return interaction.reply('Cooldown!');
        }

        // Increment the count for this user.
        lengthOfDungeon[userId]++;

        // If the user has finished the dungeon, reply with an error message and return early.
        if (dungeonFinish[userId]) {
            return interaction.reply('You have finished the dungeon! Use the /boss command to continue.');
        }

        const direction = interaction.options.getString('direction');
        if (!['L', 'R', 'M'].includes(direction.toUpperCase())) {
            return interaction.reply('Invalid direction! Please enter L, R, or M.');
        }

        // If the user has used the /advance command 20 times, guarantee the boss room event.
        if (lengthOfDungeon[userId] >= 20) {
            await interaction.reply("You have found the boss room! Get ready for the real battle!");
            dungeonbossFound[userId] = 1; // Set dungeonbossFound to 1
            dungeonFinish[userId] = 1; // Set dungeonFinish to 1
            lengthOfDungeon[userId] = 0; // Reset the count for this user
            return;
        }

        const totalWeight = outcomes.reduce((total, outcome) => total + outcome.weight, 0);
        let random = Math.random() * totalWeight;

        for (const outcome of outcomes) {
            if (random < outcome.weight) {
                if (outcome.message === "You have found the boss room! Get ready for the real battle!") {
                    dungeonbossFound[userId] = 1; // Set dungeonbossFound to 1
                    dungeonFinish[userId] = 1; // Set dungeonFinish to 1
                    lengthOfDungeon[userId] = 0; // Reset the count for this user
                }
                await interaction.reply(outcome.message);
                break;
            }
            random -= outcome.weight;
        }

        // Add the user's ID to the cooldown set.
        cooldown.add(userId);

        // Remove the user's ID from the cooldown set after 5 seconds.
        setTimeout(() => {
            cooldown.delete(userId);
        }, 5000);
    },
};

module.exports.dungeonFinish = dungeonFinish;