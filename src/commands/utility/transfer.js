const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Decimal = require("decimal.js");
const {
  isInGuild,
  isGuildExist,
} = require("../../helpers/guards/guild-verification");
const {
  isUserCheck,
  isTargetNotSelf,
  isValueValid,
} = require("../../helpers/guards/user-verification");
const createTransferEmbed = require("../../bicep/embeds/transfer-embed");
const CalculeBalanceLogic = require("../../services/calc-balance-logic");

const wrapInteraction = require("../../helpers/middleware/wrappers/wrap-interaction");

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

    const targetUser = await User.findOne({
      userId: target.id,
    });
    if (isUserCheck(interaction, targetUser)) {
      return;
    }

    if (isTargetNotSelf(interaction, user, targetUser)) {
      return;
    }

    if (await isValueValid(interaction, value)) {
      return;
    }

    const coin = await server.coinName;
    const emoji = await server.emojiRaw;
    const emojiURL = await server.emojiURL;

    const { currentBalance, balanceFormatted, money } = CalculeBalanceLogic(
      user,
      value,
      true
    );

    const {
      currentBalance: currentBalanceTarget,
      balanceFormatted: balanceFormattedTarget,
      money: moneyTarget,
    } = CalculeBalanceLogic(user, value);

    await user.save();
    await targetUser.save();

    const embed = createTransferEmbed(
      interaction,
      server,
      money,
      currentBalance,
      balanceFormatted,
      targetUser,
      currentBalanceTarget,
      balanceFormattedTarget
    );

    await wrapInteraction(interaction, (i) =>
      i.reply({
        embeds: [embed],
      })
    );
  },
};
