const { SlashCommandBuilder } = require("discord.js");

const Guild = require("@database/models/guildschema");
const User = require("@database/models/userschema");

const {
  isInNotGuild,
  isGuildNotExist,
} = require("@helpers/guards/guild-verification");
const {
  isUserNotExist,
  isTargetSelf,
} = require("@helpers/guards/user-verification");
const {
  isValueNotValid,
  balanceCheck,
} = require("@helpers/guards/balance-verification");

const createTransferEmbed = require("@bicep/embeds/transfer-embed");
const CalculeBalanceLogic = require("@services/calc-balance-logic");
const wrapInteraction = require("@helpers/middleware/wrappers/wrap-interaction");
const translate = require("@i18n/translate");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("transfer")
    .setDescription("Marque algum amigo")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("usuario que vai receber a quantia")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("valor")
        .setDescription("valor a ser enviado")
        .setRequired(true)
    ),
  async execute(interaction) {
    const target = interaction.options.getUser("target");
    const value = interaction.options.getNumber("valor");

    if (
      await isInNotGuild(interaction, translate("pt", "guild.guildInNotGuild"))
    ) {
      return;
    }

    const server = await Guild.findOne({ guildId: interaction.guild.id });
    if (
      await isGuildNotExist(
        interaction,
        server,
        translate("pt", "guild.guildNotExist")
      )
    ) {
      return;
    }

    const user = await User.findOne({
      userId: interaction.user.id,
    });
    if (
      await isUserNotExist(
        interaction,
        user,
        translate("pt", "user.userNotExist")
      )
    ) {
      return;
    }

    const targetUser = await User.findOne({
      userId: target.id,
    });
    if (
      await isUserNotExist(
        interaction,
        targetUser,
        translate("pt", "user.userTargetNotExist")
      )
    ) {
      return;
    }

    if (
      await isTargetSelf(
        interaction,
        user,
        targetUser,
        translate("pt", "user.userTargetSelf")
      )
    ) {
      return;
    }

    if (
      await isValueNotValid(
        interaction,
        value,
        translate("pt", "balance.balanceValueValid")
      )
    ) {
      return;
    }

    if (
      await balanceCheck(
        interaction,
        user,
        value,
        translate("pt", "balance.balanceCheck")
      )
    ) {
      return;
    }

    const { currentBalance, balanceFormatted, money } = CalculeBalanceLogic(
      user,
      value,
      true
    );

    const {
      currentBalance: currentBalanceTarget,
      balanceFormatted: balanceFormattedTarget,
    } = CalculeBalanceLogic(targetUser, value);

    user.balance = balanceFormatted;
    targetUser.balance = balanceFormattedTarget;

    await user.save();
    await targetUser.save();

    const embed = createTransferEmbed(
      interaction,
      server,
      money,
      currentBalance,
      balanceFormatted,
      target,
      currentBalanceTarget,
      balanceFormattedTarget
    );

    await wrapInteraction(interaction, (i) =>
      i.editReply({
        embeds: [embed],
      })
    );
  },
};
