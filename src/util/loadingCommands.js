const fs = require("node:fs");
const path = require("node:path");

module.exports = () => {
  const commands = [];

  const folderPath = path.join(__dirname, "../commands");
  const commandsFolder = fs.readdirSync(folderPath);

  for (const folder of commandsFolder) {
    const commandsPath = path.join(folderPath, folder);
    const commandsFile = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandsFile) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);

      if ("data" in command && "execute" in command) {
        commands.push(command);
      } else {
        console.warn(
          `[WARNING] O comando em ${filePath} está faltando "data" ou "execute".`
        );
      }
    }
  }
  return commands;
};
