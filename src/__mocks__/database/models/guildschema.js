const Guild = jest.fn().mockImplementation((data) => {
  return {
    ...data,
    save: jest.fn().mockResolvedValue(true),
  };
});

Guild.findOne = jest.fn().mockResolvedValue({
  guildId: "guild123",
  coinName: "Pancake",
  emojiRaw: "🥞",
});

module.exports = Guild;
