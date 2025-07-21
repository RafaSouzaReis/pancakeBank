async function ReceivedZero(interaction, received) {
  if (received === 0) {
    await interaction.reply({
      content:
        "⛏️ Nada foi encontrado desta vez... tente novamente mais tarde!",
    });
    return true;
  }
  return false;
}

module.exports = ReceivedZero;
