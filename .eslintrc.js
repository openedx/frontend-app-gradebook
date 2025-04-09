// eslint-disable-next-line import/no-extraneous-dependencies
const { createConfig } = require('@openedx/frontend-build');

const config = createConfig('eslint', {
  rules: {
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    'import/no-self-import': 'off',
    'spaced-comment': ['error', 'always', { 'block': { 'exceptions': ['*'] } }],

    // TOD: Remove this rule once we have a better way to handle this.
    'import/no-import-module-exports': 'off',
    'no-import-assign': 'off',
    'default-param-last': 'off',
  },
  overrides: [{
    files: ['*.test.js'], rules: { 'no-import-assign': 'off' },
  }],
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack.prod.config.js',
      },
    },
  },
});

module.exports = config;
