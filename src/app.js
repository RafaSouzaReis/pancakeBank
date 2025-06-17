require("dotenv").config();
const client = require("./configs/client");
const loadCommands = require("./handlers/commandHandler");
const loadEvents = require("./handlers/eventHandler");

loadCommands(client);
loadEvents(client);

client.login(process.env.TOKEN);
