const { MessageFlags } = require("discord.js");

async function isGuildExist(interaction, server, message) {
  if (!server) {
    await interaction.reply({
      content: message,
      flags: MessageFlags.ephemeral,
    });
    return false;
  }
  return true;
}

async function isInGuild(interaction) {
  if (!interaction.inGuild()) {
    await interaction.reply({
      content: "❌ Este comando só pode ser executado dentro de um servidor.",
      flags: MessageFlags.ephemeral,
    });
    return false;
  }
  return true;
}

async function isAdmin(interaction) {
  if (!interaction.member.permissions.has("Administrator")) {
    await interaction.reply({
      content: "❌ Apenas administradores podem usar este comando.",
      flags: MessageFlags.ephemeral,
    });
    return false;
  }
  return true;
}

async function isEmojiValid(emojiMatch, interaction) {
  if (!emojiMatch) {
    await interaction.reply({
      content: `Emoji Inválido, Por favor utilize um emoji personalizado do servidor!`,
      flags: MessageFlags.ephemeral,
    });
    return false;
  }
  return true;
}

module.exports = {
  isGuildExist,
  isInGuild,
  isAdmin,
  isEmojiValid,
};
