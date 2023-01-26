// eslint-disable-next-line import/no-extraneous-dependencies
const { createConfig } = require('@edx/frontend-build');

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
});

config.settings = {
  'import/resolver': {
    node: {
      paths: ['src', 'node_modules'],
      extensions: ['.js', '.jsx'],
    },
  },
};

module.exports = config;
