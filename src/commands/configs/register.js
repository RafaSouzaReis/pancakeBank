const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const Guild = require("../../database/models/guildschema");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Register server")
    .addStringOption((Option) =>
      Option.setName("coin").setDescription("Nome da moeda").setRequired(true)
    )
    .addStringOption((Option) =>
      Option.setName("emoji").setDescription("Id do emoji").setRequired(true)
    )
    .addBooleanOption((Option) =>
      Option.setName("emprestimo")
        .setDescription("mecanica de emprestimoo")
        .setRequired(true)
    )
    .addNumberOption((Option) =>
      Option.setName("juros_emprestimo").setDescription(
        "Jurus cobrado no emprestimo"
      )
    )
    .addNumberOption((Option) =>
      Option.setName("taxa_cambial").setDescription(
        "Taxa Cambial a ser cobrado"
      )
    ),

  async execute(interaction) {
    const server = await Guild.findOne({ guildId: interaction.guild.id });
    const emoji = interaction.options.getString("emoji");
    const emojiMatch = emoji.match(/.*?:.*?:(\d+)/);
    const regexGif = /^<a?:[a-zA-Z0-9_]+:\d+>$/;

    if (!emojiMatch) {
      await interaction.reply({
        content: `Emoji Inválido, Por favor utilize um emoji personalizado do servidor!`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (!interaction.member.permissions.has("Administrator")) {
      await interaction.reply({
        content: "❌ Apenas administradores podem usar este comando.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (!interaction.inGuild()) {
      await interaction.reply({
        content: "❌ O comando so poder ser executado em um servidor.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const emojiId = emojiMatch[1];
    const emojiURL = `https://cdn.discordapp.com/emojis/${emojiId}.${
      regexGif.test(emoji) ? "gif" : "png"
    }`;

    if (server) {
      await interaction.reply({
        content: `Servidor Já Registrado!`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const guild = new Guild({
      guildId: interaction.guild.id,
      coinName: interaction.options.getString("coin"),
      emojiId: emojiId,
      emojiURL: emojiURL,
      emojiRaw: emoji,
      ownerId: interaction.user.id,
      permitLoan: interaction.options.getBoolean("emprestimo"),
      extraExchangeRate:
        interaction.options.getNumber("taxa_cambial") ?? undefined,
    });
    await guild.save();
    await interaction.reply({
      content: `Registro feito com sucesso!`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
