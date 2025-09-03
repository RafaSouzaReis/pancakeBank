const { MessageFlags } = require("discord.js");
const translate = require("../../i18n/translate");

async function isUserCheck(interaction, user, message) {
  if (user) {
    await interaction.reply({
      content: message,
      flags: MessageFlags.ephemeral,
    });
    return false;
  }
  return true;
}

async function isTargetNotSelf(interaction, user, target) {
  if (user.userId === target.userId) {
    await interaction.reply({
      content: "Você não pode fazer uma transferência para si mesmo.",
      flags: MessageFlags.ephemeral,
    });
    return false;
  }
  return true;
}

async function isValueValid(interaction, value, message) {
  if (value <= 0) {
    await interaction.reply({
      content: message,
      flags: MessageFlags.ephemeral,
    });
    return false;
  }
  return true;
}

async function isReceivedZero(interaction, received) {
  if (received === 0) {
    await interaction.reply({
      content:
        "⛏️ Nada foi encontrado desta vez... tente novamente mais tarde!",
    });
    return false;
  }
  return true;
}

module.exports = {
  isUserCheck,
  isTargetNotSelf,
  isValueValid,
  isReceivedZero,
};
