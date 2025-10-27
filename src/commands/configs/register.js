const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const Guild = require("@database/models/guildschema");
const {
  isInNotGuild,
  isEmojiNotValid,
  isNotAdmin,
  isGuildExist,
} = require("@helpers/guards/guild-verification");
const translate = require("@i18n/translate");
const wrapInteraction = require("@helpers/middleware/wrappers/wrap-interaction");

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
    if (
      await isInNotGuild(interaction, translate("pt", "guild.guildInNotGuild"))
    ) {
      return;
    }

    if (await isNotAdmin(interaction, translate("pt", "guild.guildAdmin"))) {
      return;
    }

    const emoji = interaction.options.getString("emoji");
    const emojiMatch = emoji.match(/.*?:.*?:(\d+)/);
    const regexGif = /^<a?:[a-zA-Z0-9_]+:\d+>$/;

    if (
      await isEmojiNotValid(
        interaction,
        emojiMatch,
        translate("pt", "guild.guildEmojiNotValid")
      )
    ) {
      return;
    }

    const emojiId = emojiMatch[1];
    const emojiURL = `https://cdn.discordapp.com/emojis/${emojiId}.${
      regexGif.test(emoji) ? "gif" : "png"
    }`;

    const server = await Guild.findOne({ guildId: interaction.guild.id });
    if (
      await isGuildExist(
        interaction,
        server,
        translate("pt", "guild.guildExist")
      )
    ) {
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

    await wrapInteraction(interaction, (i) =>
      i.reply({
        content: translate("pt", "guild.guildRegisterSuccess"),
        flags: MessageFlags.Ephemeral,
      })
    );
  },
};
