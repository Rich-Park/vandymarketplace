module.exports = {
  testEnvironment: 'jsdom', // Use the jsdom test environment
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleFileExtensions: ['js', 'json', 'jsx'],
  collectCoverageFrom: ['**/*.{js,jsx}', '!**/node_modules/**', '!**/coverage/**', '!**/jest.config.js'],
};
