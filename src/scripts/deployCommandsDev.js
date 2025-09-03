const { REST, Routes } = require("discord.js");
require("dotenv").config();

const loadingCommands = require("./loadingCommands");

const commands = loadingCommands().map((element) => element.data.toJSON());

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const data = await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENTID,
        process.env.GUILDID
      ),
      { body: commands }
    );
    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
})();
