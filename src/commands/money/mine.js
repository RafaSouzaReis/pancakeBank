const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../database/models/userschema");
const Guild = require("../../database/models/guildschema");
const {
  InGuild,
  GuildExist,
} = require("../../services/verifications/guild-check");
const { UserExist } = require("../../services/verifications/user-check");
const ReceivedZero = require("../../services/verifications/minecheck");
const CalculeBalanceLogic = require("../../logic/calc-balance-logic");
const LootLogic = require("../../logic/loot-logic");

module.exports = {
  cooldown: 30,
  data: new SlashCommandBuilder().setName("mine").setDescription("Miner coin"),
  async execute(interaction) {
    if (!(await InGuild(interaction))) {
      return;
    }

    const server = await Guild.findOne({ guildId: interaction.guild.id });
    if (!GuildExist(interaction, server)) {
      return;
    }

    const user = await User.findOne({
      userId: interaction.user.id,
    });
    if (UserExist(interaction, user)) {
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

    if (await ReceivedZero(interaction, money)) {
      return;
    }
    const coin = server.coinName;
    const emoji = server.emojiRaw;
    await user.save();

    const embed = new EmbedBuilder()
      .setColor("Gold")
      .setTitle(":moneybag:Miner:moneybag: ")
      .setDescription(
        `Voce mineirou em ${coin} o valor:\n${emoji}$${received.toFixed(2)}`
      )
      .addFields(
        {
          name: "Saldo Anterior:",
          value: `${emoji}$${currentBalance.toFixed(2)}`,
          inline: true,
        },
        {
          name: "\u200B",
          value: "->",
          inline: true,
        },
        {
          name: "Saldo Atual:",
          value: `${emoji}$${newBalanceFormatted}`,
          inline: true,
        }
      )
      .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `Banco do Servidor • ${interaction.guild.name}` })
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
