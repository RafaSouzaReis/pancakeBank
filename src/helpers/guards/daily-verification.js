const { MessageFlags } = require("discord.js");
const wrapInteraction = require("@helpers/middleware/wrappers/wrap-interaction");

async function isDailyAlreadyClaimed(
  interaction,
  now,
  user,
  message,
  mode = "24h"
) {
  let alreadyClaimed = false;

  if (user.lastDaily) {
    if (mode === "24h") {
      alreadyClaimed = now - user.lastDaily < 86400000;
    } else if (mode === "daily") {
      alreadyClaimed = user.lastDaily.toDateString() === now.toDateString();
    }
  }

  if (alreadyClaimed) {
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
  isDailyAlreadyClaimed,
};
