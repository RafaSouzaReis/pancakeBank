const {
  SlashCommandBuilder,
  MessageFlags,
  EmbedBuilder,
} = require("discord.js");
const User = require("../../database/models/userschema");
const Guild = require("../../database/models/guildschema");
const Decimal = require("decimal.js");
const {
  ServerVerification,
  UserVerification,
  InGuild,
} = require("../../services/verifications");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Receba o premio diario"),
  async execute(interaction) {
    const server = await ServerVerification(interaction);
    if (!server) {
      return;
    }

    const user = await UserVerification(interaction);
    if (!user) {
      return;
    }

    const inGuild = await InGuild(interaction);
    if (!inGuild) {
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
    const alreadyClaimed =
      user.lastDaily &&
      user.lastDaily.getDate() === now.getDate() &&
      user.lastDaily.getMonth() === now.getMonth() &&
      user.lastDaily.getFullYear() === now.getFullYear();

    if (alreadyClaimed) {
      await interaction.reply({
        content: "Você ja coletou sua recompensa, tente amanha!",
        flags: MessageFlags.ephemeral,
      });
      return;
    }

    user.balance = newBalanceFormatted.toString();
    user.lastDaily = now;
    await user.save();

    const embed = new EmbedBuilder()
      .setColor("Gold")
      .setTitle(":moneybag:Daily:moneybag: ")
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
