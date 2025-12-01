const isUserExist = jest.fn().mockResolvedValue(false);
const isUserNotExist = jest.fn().mockResolvedValue(false);

module.exports = {
  isUserExist,
  isUserNotExist,
};
