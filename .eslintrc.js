const { createConfig } = require('@edx/frontend-build');

const config = createConfig('eslint');

config.settings = {
  "import/resolver": {
    node: {
      paths: ["src", "node_modules"],
      extensions: [".js", ".jsx"],
    },
  },
};

module.exports = config;
