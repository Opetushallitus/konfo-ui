/* eslint-disable */
const vitePreprocessor = require('cypress-vite');

module.exports = (on, _config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('file:preprocessor', vitePreprocessor());
};
