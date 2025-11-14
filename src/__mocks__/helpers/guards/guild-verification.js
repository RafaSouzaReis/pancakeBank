const isInNotGuild = jest.fn().mockResolvedValue(false);
const isGuildNotExist = jest.fn().mockResolvedValue(false);

module.exports = {
  isInNotGuild,
  isGuildNotExist,
};
