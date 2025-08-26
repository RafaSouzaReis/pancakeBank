const { MessageFlags } = require("discord.js");

async function GuildExist(interaction, server, message) {
  if (!server) {
    await interaction.reply({
      content: message,
      flags: MessageFlags.ephemeral,
    });
    return false;
  }
  return true;
}

async function InGuild(interaction) {
  if (!interaction.inGuild()) {
    await interaction.reply({
      content: "❌ Este comando só pode ser executado dentro de um servidor.",
      flags: MessageFlags.ephemeral,
    });
    return false;
  }
  return true;
}

async function UserCheck(interaction, user, message) {
  if (user) {
    await interaction.reply({
      content: message,
      flags: MessageFlags.ephemeral,
    });
    return false;
  }
  return true;
}

async function AlreadyClaimed(interaction, now, user, mode = "24h") {
  let alreadyClaimed = false;

  if (user.lastDaily) {
    if (mode === "24h") {
      alreadyClaimed = now - user.lastDaily < 86400000;
    } else if (mode === "daily") {
      alreadyClaimed = user.lastDaily.toDateString() === now.toDateString();
    }
  }

  if (alreadyClaimed) {
    await interaction.reply({
      content: "Você já coletou sua recompensa, tente amanhã!",
      flags: MessageFlags.ephemeral,
    });
    return false;
  }
  return true;
}

async function EmojiCheck(emojiMatch, interaction) {
  if (!emojiMatch) {
    await interaction.reply({
      content: `Emoji Inválido, Por favor utilize um emoji personalizado do servidor!`,
      flags: MessageFlags.ephemeral,
    });
    return false;
  }
  return true;
}

async function ReceivedZero(interaction, received) {
  if (received === 0) {
    await interaction.reply({
      content:
        "⛏️ Nada foi encontrado desta vez... tente novamente mais tarde!",
    });
    return false;
  }
  return true;
}

async function ADMCheck(interaction) {
  if (!interaction.member.permissions.has("Administrator")) {
    await interaction.reply({
      content: "❌ Apenas administradores podem usar este comando.",
      flags: MessageFlags.ephemeral,
    });
    return false;
  }
  return true;
}

async function TargetIsYou(interaction, user, target) {
  if (user.userId === target.userId) {
    await interaction.reply({
      content: "Você não pode fazer uma transferência para si mesmo.",
      flags: MessageFlags.ephemeral,
    });
    return false;
  }
  return true;
}

async function ValueCheck(interaction, value, message) {
  if (value <= 0) {
    await interaction.reply({
      content: message,
      flags: MessageFlags.ephemeral,
    });
    return false;
  }
  return true;
}

module.exports = {
  GuildExist,
  InGuild,
  UserCheck,
  AlreadyClaimed,
  EmojiCheck,
  ReceivedZero,
  ADMCheck,
  TargetIsYou,
  ValueCheck,
};
