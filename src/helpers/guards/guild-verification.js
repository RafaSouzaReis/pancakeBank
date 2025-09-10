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
    return false;
  }
  return true;
}

async function isInGuild(interaction, message) {
  if (!interaction.inGuild()) {
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

async function isAdmin(interaction, message) {
  if (!interaction.member.permissions.has("Administrator")) {
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

async function isEmojiValid(emojiMatch, interaction, message) {
  if (!emojiMatch) {
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

module.exports = {
  isGuildExist,
  isInGuild,
  isAdmin,
  isEmojiValid,
};
