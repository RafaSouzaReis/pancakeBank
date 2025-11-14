const User = jest.fn().mockImplementation((data) => {
  return {
    ...data,
    save: jest.fn().mockResolvedValue(true),
  };
});

User.findOne = jest.fn();
User.findOneAndUpdate = jest.fn();
User.create = jest.fn();

module.exports = User;
