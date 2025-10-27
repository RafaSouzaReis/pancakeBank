const Client = {
  commands: new Map(),
  cooldowns: new Map(),
  on: jest.fn(),
  login: jest.fn(),
};

const MessageFlags = {
  ephemeral: 64,
};

module.exports = { Client, MessageFlags };
