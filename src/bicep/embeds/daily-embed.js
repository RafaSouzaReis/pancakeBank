const { EmbedBuilder } = require("discord.js");

export default function createDailyEmbed(
  interaction,
  server,
  user,
  money,
  currentBalance,
  balanceFormatted
) {
  const embed = new EmbedBuilder()
    .setColor("Gold")
    .setTitle(":fortune_cookie:Daily:fortune_cookie:")
    .setDescription(
      `Voce recebeu em ${server.coinName} o valor:\n${
        server.emojiRaw
      }$${money.toFixed(2)}`
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

  return embed;
}
