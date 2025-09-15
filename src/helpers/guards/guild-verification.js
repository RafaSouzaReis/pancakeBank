const { MessageFlags } = require("discord.js");
const wrapInteraction = require("../middleware/wrappers/wrap-interaction");

async function isGuildExist(interaction, server, message) {
  if (!server) {
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

async function isInNotGuild(interaction, message) {
  if (!interaction.inGuild()) {
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

async function isNotAdmin(interaction, message) {
  if (!interaction.member.permissions.has("Administrator")) {
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

async function isEmojiNotValid(interaction, emojiMatch, message) {
  if (!emojiMatch) {
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
  isGuildExist,
  isInNotGuild,
  isNotAdmin,
  isEmojiNotValid,
};
