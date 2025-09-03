const translate = require("../../../i18n/translate");

module.exports = async function wrapInteraction(interaction, callBack) {
  try {
    await callBack(interaction);
  } catch (error) {
    console.error("Error occurred while processing interaction:", error);
    await interaction.reply({
      content: translate("pt", "errors.errorProcessingRequest", {
        command: interaction.commandName,
      }),
      flags: MessageFlags.ephemeral,
    });
  }
};
