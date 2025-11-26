const isInNotGuild = jest.fn().mockResolvedValue(false);
const isGuildNotExist = jest.fn().mockResolvedValue(false);
const isEmojiNotValid = jest.fn().mockResolvedValue(false);
const isNotAdmin = jest.fn().mockResolvedValue(false);
const isGuildExist = jest.fn().mockResolvedValue(false);

module.exports = {
  isInNotGuild,
  isGuildNotExist,
  isEmojiNotValid,
  isNotAdmin,
  isGuildExist,
};
