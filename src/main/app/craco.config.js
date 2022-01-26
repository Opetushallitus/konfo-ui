const { ESLINT_MODES } = require('@craco/craco');
const _fp = require('lodash/fp');

const alias = require('./webpack-alias');

const { CI, NODE_ENV } = process.env;

const isDev = NODE_ENV === 'development';

module.exports = {
  eslint: {
    enable: isDev,
    mode: ESLINT_MODES.file,
  },
  babel: {
    plugins: ['lodash', '@babel/plugin-proposal-optional-chaining'],
  },
  webpack: {
    alias,
    configure: _fp.flow((config) => ({
      ...config,
      ...(CI
        ? {
            devServer: {
              hot: false,
              inline: false,
              liveReload: false,
              proxy: false,
            },
          }
        : {}),
    })),
  },
  typescript: {
    enableTypeChecking: true,
  },
};
