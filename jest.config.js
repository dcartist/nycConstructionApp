module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec).js'],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    '!**/node_modules/**',
    '!**/v1/**'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testTimeout: 30000
};
