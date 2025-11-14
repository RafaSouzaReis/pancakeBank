const Guild = jest.fn().mockImplementation((data) => {
  return {
    ...data,
    save: jest.fn().mockResolvedValue(true),
  };
});

Guild.findOne = jest.fn();
Guild.findOneAndUpdate = jest.fn();
Guild.create = jest.fn();

module.exports = Guild;
