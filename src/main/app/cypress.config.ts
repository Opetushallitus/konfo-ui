import { defineConfig } from 'cypress';
import vitePreprocessor from 'cypress-vite';

export default defineConfig({
  e2e: {
    defaultCommandTimeout: 8000,
    baseUrl: 'http://localhost:3005/konfo',
    env: {
      NODE_ENV: 'production',
    },
    video: false,
    setupNodeEvents(on) {
      on('file:preprocessor', vitePreprocessor());
    },
    specPattern: 'cypress/integration/**/*.spec.js',
  },
});
