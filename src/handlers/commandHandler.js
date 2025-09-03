const loadingCommands = require("../scripts/loadingCommands");
const client = require("../configs/client");

module.exports = (Client) => {
  const commands = loadingCommands();

  commands.forEach((command) => {
    client.commands.set(command.data.name, command);
  });
};
