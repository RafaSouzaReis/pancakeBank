const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const User = require("../../database/models/userschema");
const Guild = require("../../database/models/guildschema");

const {
  isInGuild,
  isGuildExist,
} = require("../../helpers/guards/guild-verification");
const { isUserCheck } = require("../../helpers/guards/user-verification");
const isDailyAlreadyClaimed = require("../../helpers/guards/daily-verification");

const wrapInteraction = require("../../helpers/middleware/wrappers/wrap-interaction");

const CalculeBalanceLogic = require("../../services/calc-balance-logic");
const LootLogic = require("../../services/loot-logic");

const createDailyEmbed = require("../../bicep/embeds/daily-embed");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Receba o premio diario"),
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

    const { currentBalance, balanceFormatted, money } = CalculeBalanceLogic(
      user,
      LootLogic([
        { chance: 1, reward: 1000 },
        { chance: 100, reward: () => Math.random() * (500 - 0) + 0 },
      ])
    );
    const now = new Date();

    if (!(await isDailyAlreadyClaimed(interaction, now))) {
      return;
    }

    user.balance = balanceFormatted.toString();
    user.lastDaily = now;
    await user.save();

    createDailyEmbed();

    const embed = createDailyEmbed(
      interaction,
      server,
      currentBalance,
      balanceFormatted,
      money
    );

    await wrapInteraction(interaction, (i) =>
      i.reply({
        embeds: [embed],
      })
    );
  },
};
