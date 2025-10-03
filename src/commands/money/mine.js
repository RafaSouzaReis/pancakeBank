const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const User = require("../../database/models/userschema");
const Guild = require("../../database/models/guildschema");

const {
  isInNotGuild,
  isGuildNotExist,
} = require("../../helpers/guards/guild-verification");
const { isUserNotExist } = require("../../helpers/guards/user-verification");
const { isReceivedZero } = require("../../helpers/guards/balance-verification");

const createMineEmbed = require("../../bicep/embeds/mine-embed");

const CalculeBalanceLogic = require("../../services/calc-balance-logic");
const LootLogic = require("../../services/loot-logic");

const wrapInteraction = require("../../helpers/middleware/wrappers/wrap-interaction");
const translate = require("../../i18n/translate");

module.exports = {
  cooldown: 30,
  data: new SlashCommandBuilder().setName("mine").setDescription("Miner coin"),
  async execute(interaction) {
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

    const { currentBalance, balanceFormatted, money } = CalculeBalanceLogic(
      user,
      LootLogic(
        [
          { chance: 50, reward: 100000 },
          { chance: 1000, reward: () => Math.random() * (200 - 0) + 0 },
        ],
        true
      )
    );

    if (
      await isReceivedZero(
        interaction,
        money,
        translate("pt", "balance.balanceReceivedZero")
      )
    ) {
      return;
    }

    user.balance = balanceFormatted;
    await user.save();

    const embed = createMineEmbed(
      interaction,
      server,
      currentBalance,
      balanceFormatted,
      money
    );

    //O money não tem valor a partir daqui
    await wrapInteraction(interaction, (i) =>
      i.reply({
        embeds: [embed],
      })
    );
  },
};
