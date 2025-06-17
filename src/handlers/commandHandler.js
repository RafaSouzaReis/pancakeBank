const fs = require("node:fs");
const path = require("node:path");
const loadingCommands = require("../util/loadingCommands");
const client = require("../configs/client");

module.exports = (Client) => {
  const commands = loadingCommands();

  commands.forEach((command) => {
    client.commands.set(command.data.name, command);
  });
};
