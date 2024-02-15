// roll.js

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll a dice')
        .addIntegerOption(option => 
            option.setName('number_of_dices')
            .setDescription('Number of dices to roll (1-10)')
            .setRequired(true))
        .addIntegerOption(option => 
            option.setName('dice_type')
            .setDescription('Number of sides on the dice (4, 6, 8, 10, 12, or 20)')
            .setRequired(true)),
    async execute(interaction) {
        const numberOfDices = interaction.options.getInteger('number_of_dices');
        const diceType = interaction.options.getInteger('dice_type');

        if (numberOfDices < 1 || numberOfDices > 10) {
            await interaction.reply('Number of dices must be between 1 and 10.');
            return;
        }

        if (![4, 6, 8, 10, 12, 20].includes(diceType)) {
            await interaction.reply('Dice type must be either 4, 6, 8, 10, 12, or 20.');
            return;
        }

        let result = '';
        for (let i = 0; i < numberOfDices; i++) {
            result += Math.floor(Math.random() * diceType) + 1;
            if (i < numberOfDices - 1) {
                result += ', ';
            }
        }

        await interaction.reply(`You rolled: ${result} 🎲`);
    },
};