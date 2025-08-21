const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const User = require("../../database/models/userschema");
const Guild = require("../../database/models/guildschema");
const {
  InGuild,
  GuildExist,
} = require("../../services/verifications/guild-check");
const { UserExist } = require("../../services/verifications/user-check");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("register-user")
    .setDescription("Register User"),
  async execute(interaction) {
    if (!(await InGuild(interaction))) {
      return;
    }

    const server = await Guild.findOne({ guildId: interaction.guild.id });
    if (!GuildExist(interaction, server)) {
      return;
    }

    const user = await User.findOne({
      userId: interaction.user.id,
      guildId: interaction.guild.id,
    });
    if (UserExist(interaction, user)) {
      return;
    }

    const newUser = new User({
      userId: interaction.user.id,
      guildId: interaction.guild.id,
    });

    await newUser.save();

    await interaction.reply({
      content: `Registro feito com sucesso!`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
