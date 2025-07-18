async function UserCheck(interaction, target) {
  const user = await User.findOne({ userId: interaction.user.id });
  const targetUser = await User.findOne({ userId: target.id });

  if (!user) {
  const user = await User.findOne({ userId: interaction.user.id });

  if (!user) {
    await interaction.reply({
      content:
        "Você não está registrado. Use `/register-user` para se registrar!",
      flags: MessageFlags.ephemeral,
    });
    return null;
  }

    const targetUser = await User.findOne({ userId: target.id });
    if (!targetUser) {
      await interaction.reply({
        content:
          "Membro não está registrado. Peça para que ele use o comando `/register-user` para se registrar!",
        flags: MessageFlags.ephemeral,
      });
      return null;
    }

    if (user.userId === targetUser.userId) {
      await interaction.reply({
        content: "Voce não pode fazer uma transferencia para si mesmo",
        flags: MessageFlags.ephemeral,
      });
      return null;
    }

  return user;
}
