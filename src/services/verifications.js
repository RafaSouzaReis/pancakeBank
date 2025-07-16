const Guild = require("../database/models/guildschema");
const User = require("../database/models/userschema");
const { MessageFlags } = require("discord.js");

async function ServerVerification(interaction) {
  const server = await Guild.findOne({ guildId: interaction.guild.id });

  if (!server) {
    await interaction.reply({
      content:
        "Servidor não registrado. Peça ao administrador que use `/register` para registrar o servidor.",
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
        "Você não está registrado. Use `/register-user` para se registrar!",
      flags: MessageFlags.ephemeral,
    });
    return null;
  }

  return user;
}

function InGuild(interaction) {
  if (!interaction.inGuild()) {
    interaction.reply({
      content: "❌ Este comando só pode ser executado dentro de um servidor.",
      flags: MessageFlags.ephemeral,
    });
    return false;
  }
  return true;
}

async function UserExist(interaction) {
  const user = await User.findOne({ userId: interaction.user.id });

  if (user) {
    await interaction.reply({
      content: "Usuário já registrado!",
      flags: MessageFlags.ephemeral,
    });
    return true;
  }

  return false;
}

async function EmojiMatchCheck(emojiMatch, interaction) {
  if (!emojiMatch) {
    await interaction.reply({
      content: `Emoji Inválido, Por favor utilize um emoji personalizado do servidor!`,
      flags: MessageFlags.Ephemeral,
    });
    return false;
  }
  return true;
}

async function AdministratorCheck(interaction) {
  if (!interaction.member.permissions.has("Administrator")) {
    await interaction.reply({
      content: "❌ Apenas administradores podem usar este comando.",
      flags: MessageFlags.Ephemeral,
    });
    return false;
  }
  return true;
}

async function GuildRegisterCheck(interaction) {
  const server = await Guild.findOne({ guildId: interaction.guild.id });

  if (server) {
    await interaction.reply({
      content: `Servidor Já Registrado!`,
      flags: MessageFlags.Ephemeral,
    });
    return false;
  }
  return true;
}

async function AlreadyClaimed(interaction, now) {
  const user = await User.findOne({ userId: interaction.user.id });
  const alreadyClaimed =
    user.lastDaily &&
    user.lastDaily.getDate() === now.getDate() &&
    user.lastDaily.getMonth() === now.getMonth() &&
    user.lastDaily.getFullYear() === now.getFullYear();

  if (alreadyClaimed) {
    await interaction.reply({
      content: "Você ja coletou sua recompensa, tente amanha!",
      flags: MessageFlags.ephemeral,
    });
    return false;
  }
  return true;
}

async function ReceivedZero(interaction, received) {
  if (received === 0) {
    await interaction.reply({
      content: `Infelizmente você nao conseguiu mineirar nada, tente novamente! mais tarde!`,
    });
    return true;
  }
  return false;
}

module.exports = {
  ServerVerification,
  UserVerification,
  InGuild,
  UserExist,
  EmojiMatchCheck,
  AdministratorCheck,
  GuildRegisterCheck,
  AlreadyClaimed,
  ReceivedZero,
};
