const { MessageFlags } = require("discord.js");
const wrapInteraction = require("../middleware/wrappers/wrap-interaction");

async function isValueValid(interaction, value, message) {
  if (value <= 0) {
    await wrapInteraction(interaction, (i) =>
      i.reply({
        content: message,
        flags: MessageFlags.ephemeral,
      })
    );
    return false;
  }
  return true;
}

async function isReceivedZero(interaction, received, message) {
  if (received === 0) {
    await wrapInteraction(interaction, (i) =>
      i.reply({
        content: message,
      })
    );
    return false;
  }
  return true;
}

module.exports = {
  isValueValid,
  isReceivedZero,
};
