const { MessageFlags } = require("discord.js");
const wrapInteraction = require("@helpers/middleware/wrappers/wrap-interaction");

async function isUserExist(interaction, user, message) {
  if (user) {
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

async function isUserNotExist(interaction, user, message) {
  if (!user) {
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

async function isTargetSelf(interaction, user, target, message) {
  if (user.userId === target.userId) {
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
  isUserExist,
  isTargetSelf,
  isUserNotExist,
};
