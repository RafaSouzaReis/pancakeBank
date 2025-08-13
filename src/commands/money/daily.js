const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Decimal = require("decimal.js");
const {
  InGuild,
  AlreadyClaimed,
  UserExist,
  GuildExist,
} = require("../../services/export");

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

    const randomNumber = Math.random() * (100 - 1) + 1;
    const daily = new Decimal(
      randomNumber === 100 ? 1000 : Math.random() * (500 - 0) + 0
    );
    const currentBalance = new Decimal(user.balance.toString());
    const newBalance = currentBalance.plus(daily);
    const newBalanceFormatted = newBalance.toFixed(2);
    const emoji = server.emojiRaw;
    const coin = server.coinName;
    const now = new Date();

    if (!(await AlreadyClaimed(interaction, now))) {
      return;
    }

    user.balance = newBalanceFormatted.toString();
    user.lastDaily = now;
    await user.save();

    const embed = new EmbedBuilder()
      .setColor("Gold")
      .setTitle(":fortune_cookie:Daily:fortune_cookie:")
      .setDescription(
        `Voce recebeu em ${coin} o valor:\n${emoji}$${daily.toFixed(2)}`
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

    await interaction.reply({
      embeds: [embed],
    });
  },
};
