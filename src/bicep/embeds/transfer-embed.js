const { EmbedBuilder } = require("discord.js");
const translate = require("../../i18n/translate");

module.exports = function createTransferEmbed(
  interaction,
  server,
  money,
  currentBalance,
  balanceFormatted,
  targetUser,
  currentBalanceTarget,
  balanceFormattedTarget
) {
  return new EmbedBuilder()
    .setColor("Gold")
    .setTitle(translate("pt", "transfer.title"))
    .setDescription(
      translate("pt", "transfer.description", {
        emoji: server.emojiRaw,
        amount: money,
        coinName: server.coinName,
        target: targetUser.username,
      })
    )
    .addFields(
      {
        name: translate("pt", "transfer.previousBalance"),
        value: `${server.emojiRaw}$${currentBalance}`,
        inline: true,
      },
      {
        name: "\u200B",
        value: "→",
        inline: true,
      },
      {
        name: translate("pt", "transfer.currentBalance"),
        value: `${server.emojiRaw}$${balanceFormatted}`,
        inline: true,
      },
      { name: "\u200B", value: "\u200B", inline: false },
      {
        name: translate("pt", "transfer.previousBalanceTarget", {
          target: targetUser.username,
        }),
        value: `${server.emojiRaw}$${currentBalanceTarget}`,
        inline: true,
      },
      {
        name: "\u200B",
        value: "→",
        inline: true,
      },
      {
        name: translate("pt", "transfer.currentBalanceTarget", {
          target: targetUser.username,
        }),
        value: `${server.emojiRaw}$${balanceFormattedTarget}`,
        inline: true,
      }
    )
    .setThumbnail(server.emojiURL)
    .setFooter({
      text: translate("pt", "daily.footer", {
        guildName: interaction.guild.name,
      }),
    })
    .setTimestamp();
};
