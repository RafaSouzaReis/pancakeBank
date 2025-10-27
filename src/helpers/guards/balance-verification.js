const { MessageFlags } = require("discord.js");
const wrapInteraction = require("@helpers/middleware/wrappers/wrap-interaction");

async function isValueNotValid(interaction, value, message) {
  if (value <= 0) {
    await wrapInteraction(interaction, (i) =>
      i.reply({
        content: message,
        flags: MessageFlags.ephemeral,
      })
    );
    return true;
  }
  return false;
}

async function isReceivedZero(interaction, received, message) {
  if (received === 0) {
    await wrapInteraction(interaction, (i) =>
      i.reply({
        content: message,
      })
    );
    return true;
  }
  return false;
}

async function balanceCheck(interaction, user, value, message) {
  if (user.balance < value) {
    await wrapInteraction(interaction, (i) =>
      i.reply({
        content: message,
        flags: MessageFlags.ephemeral,
      })
    );
    return true;
  }
  return false;
}

module.exports = {
  isValueNotValid,
  isReceivedZero,
  balanceCheck,
};
