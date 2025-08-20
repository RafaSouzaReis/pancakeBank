const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {
  InGuild,
  AlreadyClaimed,
  UserExist,
  GuildExist,
} = require("../../services/export");
const CalculeBalanceLogic = require("../../logic/calc-balance-logic");
const LootLogic = require("../../logic/loot-logic");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Receba o premio diario"),
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
    const { currentBalance, balanceFormatted, value } = CalculeBalanceLogic(
      user,
      LootLogic([
        { chance: 1, reward: 1000 },
        { chance: 100, reward: () => Math.random() * (500 - 0) + 0 },
      ])
    );
    const now = new Date();

    if (!(await AlreadyClaimed(interaction, now))) {
      return;
    }

    user.balance = balanceFormatted.toString();
    user.lastDaily = now;
    await user.save();

    const embed = new EmbedBuilder()
      .setColor("Gold")
      .setTitle(":fortune_cookie:Daily:fortune_cookie:")
      .setDescription(
        `Voce recebeu em ${server.coinName} o valor:\n${
          server.emojiRaw
        }$${value.toFixed(2)}`
      )
      .addFields(
        {
          name: "Saldo Anterior:",
          value: `${server.emojiRaw}$${currentBalance.toFixed(2)}`,
          inline: true,
        },
        {
          name: "\u200B",
          value: "->",
          inline: true,
        },
        {
          name: "Saldo Atual:",
          value: `${server.emojiRaw}$${balanceFormatted}`,
          inline: true,
        }
      )
      .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `Banco do Servidor • ${interaction.guild.name}` })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
    });
  },
};
