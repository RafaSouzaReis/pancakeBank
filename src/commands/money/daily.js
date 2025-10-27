const { SlashCommandBuilder } = require("discord.js");

const User = require("@database/models/userschema");
const Guild = require("@database/models/guildschema");

const {
  isInNotGuild,
  isGuildNotExist,
} = require("@helpers/guards/guild-verification");
const { isUserNotExist } = require("@helpers/guards/user-verification");
const { isDailyAlreadyClaimed } = require("@helpers/guards/daily-verification");

const CalculeBalanceLogic = require("@services/calc-balance-logic");
const LootLogic = require("@services/loot-logic");
const createDailyEmbed = require("@bicep/embeds/daily-embed");
const wrapInteraction = require("@helpers/middleware/wrappers/wrap-interaction");
const translate = require("@i18n/translate");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Receba o premio diario"),
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
      LootLogic([
        { chance: 1, reward: 1000 },
        { chance: 100, reward: () => Math.random() * (500 - 0) + 0 },
      ])
    );
    const now = new Date();

    if (
      await isDailyAlreadyClaimed(
        interaction,
        now,
        user,
        translate("pt", "daily.dailyAlreadyClaimed")
      )
    ) {
      return;
    }

    user.balance = balanceFormatted;
    user.lastDaily = now;
    await user.save();

    const embed = createDailyEmbed(
      interaction,
      server,
      currentBalance,
      balanceFormatted,
      money
    );

    await wrapInteraction(interaction, (i) =>
      i.editReply({
        embeds: [embed],
      })
    );
  },
};
