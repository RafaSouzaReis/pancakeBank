const User = jest.fn().mockImplementation((data) => {
  return {
    ...data,
    save: jest.fn().mockResolvedValue(true),
  };
});

User.findOne = jest.fn().mockResolvedValue({
  userId: "user123",
  balance: 1000,
  lastDaily: null,
  save: jest.fn().mockResolvedValue(true),
});

module.exports = User;
