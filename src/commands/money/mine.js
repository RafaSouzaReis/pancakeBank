const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const User = require("../../database/models/userschema");
const Guild = require("../../database/models/guildschema");

const {
  isInGuild,
  isGuildExist,
} = require("../../helpers/guards/guild-verification");
const { isUserCheck } = require("../../helpers/guards/user-verification");
const { isReceivedZero } = require("../../helpers/guards/balance-verification");

const createMineEmbed = require("../../bicep/embeds/mine-embed");

const CalculeBalanceLogic = require("../../services/calc-balance-logic");
const LootLogic = require("../../services/loot-logic");

const wrapInteraction = require("../../helpers/middleware/wrappers/wrap-interaction");

module.exports = {
  cooldown: 30,
  data: new SlashCommandBuilder().setName("mine").setDescription("Miner coin"),
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
        { chance: 50, reward: 100000 },
        { chance: 1000, reward: () => Math.random() * (200 - 0) + 0 },
        true,
      ])
    );

    if (await isReceivedZero(interaction, money)) {
      return;
    }
    const coin = server.coinName;
    const emoji = server.emojiRaw;
    await user.save();

    const embed = createMineEmbed(
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
