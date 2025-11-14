module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/tests/**/*.test.js"],
  setupFilesAfterEnv: ["jest-extended/all"],
  moduleNameMapper: {
    "^@database/(.*)$": "<rootDir>/src/database/$1",
    "^@helpers/(.*)$": "<rootDir>/src/helpers/$1",
    "^@commands/(.*)$": "<rootDir>/src/commands/$1",
    "^@i18n/(.*)$": "<rootDir>/src/i18n/$1",
    "^@events/(.*)$": "<rootDir>/src/events/$1",
    "^@scripts/(.*)$": "<rootDir>/src/scripts/$1",
    "^@mocks/(.*)$": "<rootDir>/src/__mocks__/$1",
  },
  clearMocks: true,
  restoreMocks: true,
};
