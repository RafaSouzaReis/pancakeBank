const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Decimal = require("decimal.js");
const {
  GuildCheck,
  UserCheck,
  InGuild,
} = require("../../services/verifications");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Ver saldo"),

  async execute(interaction) {
    const inGuild = await InGuild(interaction);
    if (!inGuild) {
      return;
    }
    const server = await GuildCheck(interaction);
    if (!server) {
      return;
    }
    const user = await UserCheck(interaction);
    if (!user) {
      return;
    }

    const emoji = server.emojiRaw;
    const coin = server.coinName;

    const balanceDecimal = new Decimal(user.balance.toString());
    const balanceFormatted = balanceDecimal.toFixed(2);

    const embed = new EmbedBuilder()
      .setColor("Gold")
      .setTitle(`:coin:  Saldo de ${interaction.user.username}! :coin: `)
      .setDescription(`Veja abaixo o saldo atual em ${coin}`)
      .addFields({
        name: "Saldo",
        value: `${emoji}$${balanceFormatted}`,
        inline: true,
      })
      .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `Banco do Servidor • ${interaction.guild.name}` })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
    });
  },
};
