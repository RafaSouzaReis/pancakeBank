const { MessageFlags } = require("discord.js");
const wrapInteraction = require("../middleware/wrappers/wrap-interaction");

async function isDailyAlreadyClaimed(
  interaction,
  now,
  user,
  mode = "24h",
  message
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
