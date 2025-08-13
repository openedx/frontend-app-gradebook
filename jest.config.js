const { createConfig } = require('@openedx/frontend-base/config');

module.exports = createConfig('test', {
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTest.js',
  ],
  modulePaths: ['<rootDir>/src/'],
  coveragePathIgnorePatterns: [
    'testUtils', // don't unit test jest mocking tools
  ],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/src/__mocks__/svg.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/__mocks__/file.js',
  },
});
