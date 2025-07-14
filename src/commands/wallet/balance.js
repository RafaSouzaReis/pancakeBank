const {
  SlashCommandBuilder,
  MessageFlags,
  EmbedBuilder,
} = require("discord.js");
const User = require("../../database/models/userschema");
const Guild = require("../../database/models/guildschema");
const Decimal = require("decimal.js");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Ver saldo"),
  async execute(interaction) {
    const user = await User.findOne({ userId: interaction.user.id });
    const server = await Guild.findOne({ guildId: interaction.guild.id });
    const emoji = server.emojiRaw;
    const coin = server.coinName;

    if (!user) {
      await interaction.reply({
        content:
          "Você não esta registrado, utilize `/register-user` para se registrar!",
        flags: MessageFlags.ephemeral,
      });
      return;
    }

    const balanceDecimal = new Decimal(user.balance.toString());
    const balanceFormatted = balanceDecimal.toFixed(2);

    if (!server) {
      await interaction.reply({
        content:
          "Servidor não registrado peça ao administrador que utilize o comando `/register!` para registrar o servidor",
        flags: MessageFlags.ephemeral,
      });
    }

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
