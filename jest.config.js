const { createConfig } = require('@edx/frontend-build');

module.exports = createConfig('jest', {
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTest.js',
  ],
  modulePaths: ['<rootDir>/src/'],
  snapshotSerializers: [
    'enzyme-to-json/serializer',
  ],
  coveragePathIgnorePatterns: [
    'src/segment.js',
    'src/postcss.config.js',
  ],
});
