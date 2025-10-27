require("dotenv").config();
const client = require("@configs/client");
const loadCommands = require("@handlers/commandHandler");
const loadEvents = require("@handlers/eventHandler");
const connect = require("@database/connect");

connect();
loadCommands(client);
loadEvents(client);

client.login(process.env.TOKEN);
