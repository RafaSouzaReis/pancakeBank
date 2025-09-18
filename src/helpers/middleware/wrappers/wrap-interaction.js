const { MessageFlags } = require("discord.js");
const translate = require("../../../i18n/translate");

module.exports = async function wrapInteraction(interaction, callBack) {
  try {
    await callBack(interaction);
  } catch (error) {
    console.error("Error occurred while processing interaction:", error);

    const errorMessage = translate("pt", "errors.errorProcessingRequest", {
      command: interaction.commandName,
    });

    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: errorMessage,
        flags: MessageFlags.Ephemeral,
      });
    } else if (interaction.deferred) {
      await interaction.editReply({ content: errorMessage });
    } else {
      await interaction.followUp({
        content: errorMessage,
        flags: MessageFlags.Ephemeral,
      });
    }
  }
};
