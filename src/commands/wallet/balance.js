const { SlashCommandBuilder, MessageFlags } = require("discord.js");

const Guild = require("../../database/models/guildschema");

const { isInNotGuild } = require("../../helpers/guards/guild-verification");

const wrapInteraction = require("../../helpers/middleware/wrappers/wrap-interaction");

const translate = require("../../i18n/translate");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Ver saldo"),

  async execute(interaction) {
    if (
      await isInNotGuild(interaction, translate("pt", "guild.guildInNotGuild"))
    ) {
      return;
    }

    const server = await Guild.findOne({ guildId: interaction.guild.id });
    if (
      !(await isGuildExist(
        interaction,
        server,
        translate("pt", "guild.guildNotExist")
      ))
    ) {
      return;
    }

    const user = await User.findOne({
      userId: interaction.user.id,
    });
    if (
      !(await isUserExist(
        interaction,
        user,
        translate("pt", "user.userNotExist")
      ))
    ) {
      return;
    }

    const balanceDecimal = new Decimal(user.balance.toString());
    const balanceFormatted = balanceDecimal.toFixed(2);

    const embed = createBalanceEmbed(interaction, server, balanceFormatted);
    await wrapInteraction(interaction, (i) =>
      i.reply({
        embeds: [embed],
      })
    );
  },
};
