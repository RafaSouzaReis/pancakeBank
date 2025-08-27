const messages = require("../i18n/messages");

async function wrapInteraction(interaction, callBack) {
  try {
    await callBack(interaction);
  } catch (error) {
    console.error("Error occurred while processing interaction:", error);
    await interaction.reply({
      content: messages.pt.errors.errorProcessingRequest,
      flags: MessageFlags.ephemeral,
    });
  }
}
