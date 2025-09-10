const { EmbedBuilder } = require("discord.js");
const translate = require("../../i18n/translate");

module.exports = function createDailyEmbed(
  interaction,
  server,
  currentBalance,
  balanceFormatted,
  money
) {
  return new EmbedBuilder()
    .setColor("Gold")
    .setTitle(translate("pt", "dailyEmbed.title"))
    .setDescription(
      translate("pt", "dailyEmbed.description", {
        coiName: server.coinName,
        emoji: server.emojiRaw,
        amount: balanceFormatted,
      })
    )
    .addFields(
      {
        name: translate("pt", "dailyEmbed.previousBalance", {
          coinName: server.coinName,
          emoji: server.emojiRaw,
          amount: money,
        }),
        value: `${server.emojiRaw}$${currentBalance}`,
        inline: true,
      },
      {
        name: "\u200B",
        value: "->",
        inline: true,
      },
      {
        name: translate("pt", "dailyEmbed.currentBalance"),
        value: `${server.emojiRaw}$${balanceFormatted}`,
        inline: true,
      }
    )
    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
    .setFooter({
      text: translate("pt", "dailyEmbed.footer", {
        guildName: interaction.guild.name,
      }),
    })
    .setTimestamp();
};
