const { EmbedBuilder } = require("discord.js");
const translate = require("../../i18n/translate");

module.exports = function createMineEmbed(
  interaction,
  server,
  currentBalance,
  balanceFormatted,
  money
) {
  return new EmbedBuilder()
    .setColor("Gold")
    .setTitle(translate("pt", "mineEmbed.title"))
    .setDescription(
      translate("pt", "mineEmbed.description", {
        coinName: server.coinName,
        emoji: server.emojiRaw,
        amount: money,
      })
    )
    .addFields(
      {
        name: translate("pt", "mineEmbed.previousBalance"),
        value: `${server.emojiRaw}$${currentBalance}`,
        inline: true,
      },
      {
        name: "\u200B",
        value: "->",
        inline: true,
      },
      {
        name: translate("pt", "mineEmbed.currentBalance"),
        value: `${server.emojiRaw}$${balanceFormatted}`,
        inline: true,
      }
    )
    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
    .setFooter({
      text: translate("pt", "mineEmbed.footer", {
        guildName: interaction.guild.name,
      }),
    })
    .setTimestamp();
};
