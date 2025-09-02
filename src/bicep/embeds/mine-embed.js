const { EmbedBuilder } = require("discord.js");
const translate = require("../../i18n/translate");

module.exports = function createMineEmbed(
  interaction,
  server,
  currentBalance,
  balanceFormatted
) {
  return new EmbedBuilder()
    .setColor("Gold")
    .setTitle(translate("pt", "mine.title"))
    .setDescription(
      translate("pt", "mine.description", {
        coinName: server.coinName,
        emoji: server.emojiRaw,
        amount: money,
      })
    )
    .addFields(
      {
        name: translate("pt", "mine.previousBalance"),
        value: `${server.emojiRaw}$${currentBalance}`,
        inline: true,
      },
      {
        name: "\u200B",
        value: "->",
        inline: true,
      },
      {
        name: translate("pt", "mine.currentBalance"),
        value: `${server.emojiRaw}$${balanceFormatted}`,
        inline: true,
      }
    )
    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
    .setFooter({
      text: translate("pt", "daily.footer", {
        guildName: interaction.guild.name,
      }),
    })
    .setTimestamp();
};
