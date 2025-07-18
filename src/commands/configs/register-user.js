const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const User = require("../../database/models/userschema");
const {
  GuildCheck,
  InGuild,
  UserExist,
} = require("../../services/verifications");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("register-user")
    .setDescription("Register User"),
  async execute(interaction) {
    const inGuild = await InGuild(interaction);
    if (!inGuild) {
      return;
    }

    const server = await GuildCheck(interaction);
    if (!server) {
      return;
    }

    const userAlreadyExists = await UserExist(interaction);
    if (userAlreadyExists) {
      return;
    }

    const user = new User({
      userId: interaction.user.id,
      guildId: interaction.guild.id,
    });

    await user.save();

    await interaction.reply({
      content: `Registro feito com sucesso!`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
