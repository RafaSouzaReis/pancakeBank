const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Decimal = require("decimal.js");
const { isGuildExist, UserExist, isInGuild } = require("../../services/export");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Ver saldo"),

  async execute(interaction) {
    const isInGuild = await isInGuild(interaction);
    if (!isInGuild) {
      return;
    }
    const server = await isGuildExist(interaction);
    if (!server) {
      return;
    }
    const user = await UserExist(interaction);
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
