const fs = require("node:fs");
const path = require("node:path");

module.exports = (Client) => {
  const eventsPath = path.join(__dirname, "..", "events");
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    if (event.once) {
      Client.once(event.name, (...args) => event.execute(...args));
    } else {
      Client.on(event.name, (...args) => event.execute(...args));
    }
  }
};
