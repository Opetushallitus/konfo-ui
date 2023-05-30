import path from 'path';

import { optimizeLodashImports } from '@optimize-lodash/rollup-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

const opintopolkuDevTarget = 'https://testiopintopolku.fi';

export default defineConfig(() => {
  return {
    base: '/konfo',
    build: {
      outDir: 'build',
    },
    resolve: {
      alias: {
        '#': path.resolve(__dirname),
      },
    },
    plugins: [react(), svgr(), optimizeLodashImports()],
    server: {
      port: 3005,
      proxy: {
        '/konfo-backend': {
          target: opintopolkuDevTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
