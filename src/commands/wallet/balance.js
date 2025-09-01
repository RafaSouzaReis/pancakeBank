const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Decimal = require("decimal.js");
const {
  isInGuild,
  isGuildExist,
} = require("../../helpers/guards/guild-verification");
const isUserCheck = require("../../helpers/guards/user-verification");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Ver saldo"),

  async execute(interaction) {
    if (!(await isInGuild(interaction))) {
      return;
    }

    const server = await Guild.findOne({ guildId: interaction.guild.id });
    if (!isGuildExist(interaction, server)) {
      return;
    }

    const user = await User.findOne({
      userId: interaction.user.id,
    });
    if (isUserCheck(interaction, user)) {
      return;
    }

    const balanceDecimal = new Decimal(user.balance.toString());
    const balanceFormatted = balanceDecimal.toFixed(2);

    const embed = createBalanceEmbed(interaction, server, balanceFormatted);
    await interaction.reply({
      embeds: [embed],
    });
  },
};
