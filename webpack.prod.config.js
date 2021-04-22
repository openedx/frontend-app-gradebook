const path = require('path');
const { createConfig } = require('@edx/frontend-build');

const config = createConfig('webpack-prod');

console.log({ configBefore: config });
config.resolve.modules = [
  path.resolve(__dirname, './src'),
  'node_modules'
];
config.module.rules[0].exclude = /node_modules\/(?!(query-string|split-on-first|strict-uri-encode|@edx))/;

console.log({
  config: config,
  resolveModules: config.resolve.modules,
  resolveExtensions: config.resolve.extensions,
});

module.exports = config;
