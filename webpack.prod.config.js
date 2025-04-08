const path = require('path');
const { createConfig } = require('@openedx/frontend-build');

const config = createConfig('webpack-prod');

config.resolve.alias['@src'] = path.resolve(__dirname, 'src');

config.resolve.modules = [
  path.resolve(__dirname, './src'),
  'node_modules',
];

config.module.rules[0].exclude = /node_modules\/(?!(query-string|split-on-first|strict-uri-encode|@edx))/;

module.exports = config;
