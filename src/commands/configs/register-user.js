const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const User = require("../../database/models/userschema");
const Guild = require("../../database/models/guildschema");
const {
  isInGuild,
  isGuildExist,
} = require("../../helpers/guards/guild-verification");
const { isUserCheck } = require("../../helpers/guards/user-verification");
const messages = require("../../i18n/messages");
const wrapInteraction = require("../../helpers/wrappers/wrap-interaction");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("register-user")
    .setDescription("Register User"),
  async execute(interaction) {
    if (!(await isInGuild(interaction))) {
      return;
    }

    const server = await Guild.findOne({ guildId: interaction.guild.id });
    if (!isGuildExist(interaction, server)) {
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
        content: messages.pt.success.registerUserSuccess,
        flags: MessageFlags.Ephemeral,
      })
    );
  },
};
