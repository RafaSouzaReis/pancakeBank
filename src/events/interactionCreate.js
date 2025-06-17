const { Events, Collection, MessageFlags } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,

  async execute(interaction) {
    const { cooldowns } = interaction.client;

    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`Comando ${interaction.commandName} não encontrado.`);
      return;
    }

    if (!cooldowns.has(command.data.name)) {
      cooldowns.set(command.data.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name);
    const defaultCooldownSeconds = 3;

    const cooldownAmount = (command.cooldown ?? defaultCooldownSeconds) * 1_000;

    if (timestamps.has(interaction.user.id)) {
      const expirationTime =
        timestamps.get(interaction.user.id) + cooldownAmount;

      if (now < expirationTime) {
        const expiredTimestamp = Math.round(expirationTime / 1000);
        return interaction.reply({
          content: `⏳ Você está em cooldown para \`${command.data.name}\`. Pode usar novamente <t:${expiredTimestamp}:R>.`,
          flags: MessageFlags.Ephemeral,
        });
      }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(
        `Erro ao executar o comando ${interaction.commandName}:`,
        error
      );

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "❌ Ocorreu um erro ao executar este comando.",
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: "❌ Ocorreu um erro ao executar este comando.",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
};
