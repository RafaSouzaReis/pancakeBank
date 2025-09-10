const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const User = require("../../database/models/userschema");
const Guild = require("../../database/models/guildschema");
const {
  isInGuild,
  isGuildExist,
} = require("../../helpers/guards/guild-verification");
const { isUserCheck } = require("../../helpers/guards/user-verification");
const translate = require("../../i18n/translate");
const wrapInteraction = require("../../helpers/middleware/wrappers/wrap-interaction");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("register-user")
    .setDescription("Register User"),
  async execute(interaction) {
    if (
      !(await isInGuild(interaction, translate("pt", "guild.guildInGuild")))
    ) {
      return;
    }

    const server = await Guild.findOne({ guildId: interaction.guild.id });
    if (
      !isGuildExist(interaction, server, translate("pt", "guild.guildNotCheck"))
    ) {
      return;
    }

    const user = await User.findOne({
      userId: interaction.user.id,
    });
    if (isUserCheck(interaction, user)) {
      return;
    }

    const newUser = new User({
      userId: interaction.user.id,
      guildId: interaction.guild.id,
    });

    await newUser.save();

    await wrapInteraction(interaction, (i) =>
      i.reply({
        content: translate("pt", "user.userRegisterSuccess"),
        flags: MessageFlags.Ephemeral,
      })
    );
  },
};
