const Guild = require("../database/models/guildschema");
const User = require("../database/models/userschema");
const { MessageFlags } = require("discord.js");

async function ServerVerification(interaction) {
  const server = await Guild.findOne({ guildId: interaction.guild.id });

  if (!server) {
    await interaction.reply({
      content:
        "Servidor não registrado peça ao administrador que utilize o comando `/register!` para registrar o servidor",
      flags: MessageFlags.ephemeral,
    });
    return null;
  }
  return server;
}

async function UserVerification(interaction) {
  const user = await User.findOne({ userId: interaction.user.id });

  if (!user) {
    await interaction.reply({
      content:
        "Você não esta registrado, utilize `/register-user` para se registrar!",
      flags: MessageFlags.ephemeral,
    });
    return null;
  }
  return user;
}

async function InGuild(interaction) {
  if (!interaction.inGuild()) {
    await interaction.reply({
      content: "❌ O comando so poder ser executado em um servidor.",
      flags: MessageFlags.Ephemeral,
    });
    return false;
  }
  return true;
}

module.exports = { ServerVerification, UserVerification, InGuild };
