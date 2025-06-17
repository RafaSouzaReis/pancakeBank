const { Events } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(Client) {
    console.log(`✅ Bot online como ${Client.user.tag}`);
  },
};
