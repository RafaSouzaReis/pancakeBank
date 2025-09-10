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
    .setTitle(translate("pt", "transferEmbed.title"))
    .setDescription(
      translate("pt", "transferEmbed.description", {
        emoji: server.emojiRaw,
        amount: money,
        coinName: server.coinName,
        target: targetUser.username,
      })
    )
    .addFields(
      {
        name: translate("pt", "transferEmbed.previousBalance"),
        value: `${server.emojiRaw}$${currentBalance}`,
        inline: true,
      },
      {
        name: "\u200B",
        value: "→",
        inline: true,
      },
      {
        name: translate("pt", "transferEmbed.currentBalance"),
        value: `${server.emojiRaw}$${balanceFormatted}`,
        inline: true,
      },
      { name: "\u200B", value: "\u200B", inline: false },
      {
        name: translate("pt", "transferEmbed.previousBalanceTarget", {
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
        name: translate("pt", "transferEmbed.currentBalanceTarget", {
          target: targetUser.username,
        }),
        value: `${server.emojiRaw}$${balanceFormattedTarget}`,
        inline: true,
      }
    )
    .setThumbnail(server.emojiURL)
    .setFooter({
      text: translate("pt", "transferEmbed.footer", {
        guildName: interaction.guild.name,
      }),
    })
    .setTimestamp();
};
