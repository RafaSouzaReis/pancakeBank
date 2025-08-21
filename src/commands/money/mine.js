const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {
  InGuild,
  ReceivedZero,
  UserExist,
  GuildExist,
} = require("../../services/export");
const CalculeBalanceLogic = require("../../logic/calc-balance-logic");
const LootLogic = require("../../logic/loot-logic");

const Decimal = require("decimal.js");

module.exports = {
  cooldown: 30,
  data: new SlashCommandBuilder().setName("mine").setDescription("Miner coin"),
  async execute(interaction) {
    const inGuild = await InGuild(interaction);
    if (!inGuild) {
      return;
    }

    const server = await GuildExist(interaction);
    if (!server) {
      return;
    }

    const user = await UserExist(interaction);
    if (!user) {
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
