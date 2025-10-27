const { REST, Routes } = require("discord.js");
require("dotenv").config();
const loadingCommands = require("@scripts/loadingCommands");

const commands = loadingCommands()
  .filter((cmd) => cmd.data.name !== "reload")
  .map((cmd) => cmd.data.toJSON());

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands globally.`
    );

    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENTID),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands globally.`
    );
  } catch (error) {
    console.error(error);
  }
})();
