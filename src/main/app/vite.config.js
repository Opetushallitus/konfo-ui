import path from 'path';
import url from 'url';

import { optimizeLodashImports } from '@optimize-lodash/rollup-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import pluginRewriteAll from 'vite-plugin-rewrite-all';
import svgr from 'vite-plugin-svgr';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    plugins: [react(), svgr(), optimizeLodashImports(), pluginRewriteAll()],
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
