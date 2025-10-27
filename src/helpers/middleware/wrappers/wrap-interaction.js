const { MessageFlags } = require("discord.js");
const translate = require("@i18n/translate");

module.exports = async function wrapInteraction(interaction, callBack) {
  try {
    if (!interaction.deferred && !interaction.replied) {
      await interaction.deferReply({ ephemeral: true });
    }

    await callBack(interaction);
  } catch (error) {
    console.error("Error occurred while processing interaction:", error);

    const errorMessage = translate("pt", "errors.errorProcessingRequest", {
      command: interaction.commandName,
    });

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({
        content: errorMessage,
      });
    } else {
      await interaction.reply({
        content: errorMessage,
        flags: MessageFlags.Ephemeral,
      });
    }
  }
};
