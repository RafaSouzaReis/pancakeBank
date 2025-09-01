const { EmbedBuilder } = require("discord.js");
const translate = require("../../i18n/translate");

export default function createBalanceEmbed(
  interaction,
  server,
  balanceFormatted
) {
  return new EmbedBuilder()
    .setColor("Gold")
    .setTitle(
      translate("pt", "balance.title", { userName: interaction.user.username })
    )
    .setDescription(
      translate("pt", "balance.description", { coin: server.coinName })
    )
    .addFields({
      name: translate("pt", "balance.fieldName"),
      value: `${server.emojiRaw}$${balanceFormatted}`,
      inline: true,
    })
    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
    .setFooter({
      text: translate("pt", "balance.footer", {
        guildName: interaction.guild.name,
      }),
    })
    .setTimestamp();
}
