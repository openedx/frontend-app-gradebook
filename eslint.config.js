// @ts-check

const { createLintConfig } = require('@openedx/frontend-base/config');

module.exports = createLintConfig(
  {
    files: [
      'src/**/*',
      'site.config.*',
    ],
  },
  {
    ignores: [
      'documentation/*',
    ],
  },
);
