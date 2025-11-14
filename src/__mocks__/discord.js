const SlashCommandBuilder = jest.fn().mockImplementation(() => {
  return {
    setName: jest.fn().mockReturnThis(),
    setDescription: jest.fn().mockReturnThis(),
  };
});

const MessageFlags = {
  Ephemeral: 64,
};

module.exports = {
  SlashCommandBuilder,
  MessageFlags,
};
