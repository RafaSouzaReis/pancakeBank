const { EmbedBuilder } = require("discord.js");
const translate = require("../../i18n/translate");

module.exports = function createBalanceEmbed(
  interaction,
  server,
  balanceFormatted
) {
  return new EmbedBuilder()
    .setColor("Gold")
    .setTitle(
      translate("pt", "balanceEmbed.title", {
        userName: interaction.user.username,
      })
    )
    .setDescription(
      translate("pt", "balanceEmbed.description", { coin: server.coinName })
    )
    .addFields({
      name: translate("pt", "balanceEmbed.fieldName"),
      value: `${server.emojiRaw}$${balanceFormatted}`,
      inline: true,
    })
    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
    .setFooter({
      text: translate("pt", "balanceEmbed.footer", {
        guildName: interaction.guild.name,
      }),
    })
    .setTimestamp();
};
