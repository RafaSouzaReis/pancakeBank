const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Decimal = require("decimal.js");

const User = require("../../database/models/userschema");
const Guild = require("../../database/models/guildschema");

const {
  isInGuild,
  isGuildExist,
} = require("../../helpers/guards/guild-verification");
const { isUserCheck } = require("../../helpers/guards/user-verification");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Recarrega um comando.")
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription("O nome do comando")
        .setRequired(true)
    ),

  async execute(Interaction) {
    const commandName = Interaction.options.getString("command").toLowerCase();

    const commandsPath = path.join(__dirname, "..");
    const commandFolders = fs.readdirSync(commandsPath);

    let commandFound = false;

    for (const folder of commandFolders) {
      const commandFilePath = path.join(
        commandsPath,
        folder,
        `${commandName}.js`
      );

      if (fs.existsSync(commandFilePath)) {
        delete require.cache[require.resolve(commandFilePath)];

        try {
          const newCommand = require(commandFilePath);
          Interaction.client.commands.set(newCommand.data.name, newCommand);

          await Interaction.reply({
            content: `✅ O comando \`${newCommand.data.name}\` foi recarregado com sucesso!`,
            flags: MessageFlags.Ephemeral,
          });

          commandFound = true;
          break;
        } catch (error) {
          console.error(error);
          await Interaction.reply({
            content: `❌ Erro ao recarregar o comando \`${commandName}\`:\n\`${error.message}\``,
            flags: MessageFlags.Ephemeral,
          });
          return;
        }
      }
    }

    if (!commandFound) {
      await Interaction.reply({
        content: `❌ Não encontrei o comando \`${commandName}\`. Verifique se ele existe e se está nomeado corretamente.`,
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
