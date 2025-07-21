async function EmojiCheck(emojiMatch, interaction) {
  if (!emojiMatch) {
    await interaction.reply({
      content: `Emoji Inválido, Por favor utilize um emoji personalizado do servidor!`,
      flags: MessageFlags.Ephemeral,
    });
    return false;
  }
  return true;
}

module.exports = EmojiCheck;
