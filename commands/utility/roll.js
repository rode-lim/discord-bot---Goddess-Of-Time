// roll.js

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll a dice')
        .addStringOption(option => 
            option.setName('notation')
            .setDescription('Dice notation (e.g., 1d20+1)')
            .setRequired(true)),
    async execute(interaction) {
        const notation = interaction.options.getString('notation');
        const match = notation.match(/^(\d+)d(\d+)([+\-*/])?(\d+)?$/);

        if (!match) {
            await interaction.reply('Invalid notation. It must be in the format NdM[+/-/*//X], where N is the number of dice, M is the type of dice, and X is an optional modifier.');
            return;
        }

        const numberOfDices = parseInt(match[1]);
        const diceType = parseInt(match[2]);
        const operator = match[3];
        const modifier = match[4] ? parseInt(match[4]) : 0;

        if (numberOfDices < 1 || numberOfDices > 10) {
            await interaction.reply('Number of dices must be between 1 and 10.');
            return;
        }

        if (![4, 6, 8, 10, 12, 20].includes(diceType)) {
            await interaction.reply('Dice type must be either 4, 6, 8, 10, 12, or 20.');
            return;
        }

        let result = '';
        let total = 0;
        for (let i = 0; i < numberOfDices; i++) {
            let roll = Math.floor(Math.random() * diceType) + 1;
            let modifiedRoll = roll;
            switch (operator) {
                case '+':
                    modifiedRoll += modifier;
                    break;
                case '-':
                    modifiedRoll -= modifier;
                    break;
                case '*':
                    modifiedRoll *= modifier;
                    break;
                case '/':
                    modifiedRoll = Math.floor(roll / modifier);
                    break;
            }
            total += modifiedRoll;
            result += `${roll}`;
            if (i < numberOfDices - 1) {
                result += ', ';
            }
        }

        await interaction.reply(`You rolled: ${result} 🎲 [Total: ${total}]`);
    },
};