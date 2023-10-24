import dns from 'dns';
import path from 'path';
import url from 'url';

import { optimizeLodashImports } from '@optimize-lodash/rollup-plugin';
import react from '@vitejs/plugin-react';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import { defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';
import pluginRewriteAll from 'vite-plugin-rewrite-all';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import svgr from 'vite-plugin-svgr';

dns.setDefaultResultOrder('verbatim');

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = Object.assign({}, process.env, loadEnv(mode, process.cwd(), ''));

  const isDev = env.NODE_ENV === 'development';

  return {
    base: '/konfo',
    build: {
      outDir: 'build',
      target: browserslistToEsbuild(),
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('victory') || id.includes('d3')) {
              return 'victory';
            } else if (id.includes('react-select')) {
              return 'react-select';
            } else if (id.includes('lodash')) {
              return 'lodash';
            } else if (
              id.includes('@mui') ||
              id.includes('@emotion') ||
              id.includes('@popper')
            ) {
              return 'mui';
            } else if (id.includes('node_modules')) {
              return 'vendor-rest';
            }
          },
        },
      },
    },
    resolve: {
      alias: {
        '#': path.resolve(__dirname),
      },
    },
    plugins: [
      react(),
      svgr(),
      viteStaticCopy({
        targets: [
          {
            src: 'node_modules/@material-design-icons/svg/outlined/*.svg',
            dest: 'icons/material/outlined',
          },
          {
            src: 'node_modules/@material-design-icons/svg/filled/*.svg',
            dest: 'icons/material/filled',
          },
        ],
      }),
      optimizeLodashImports(),
      // Tuotanto-buildissa karsitaan devaus-plugineja hidastamasta
      ...(isDev
        ? [
            pluginRewriteAll(),
            checker({
              typescript: true,
              eslint: {
                lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
              },
              overlay: {
                initialIsOpen: false,
              },
            }),
          ]
        : []),
    ],
    server: {
      port: Number(env.PORT) || 3005,
      host: 'localhost',
      proxy: {
        '/konfo-backend': {
          target: env.OPINTOPOLKU_PROXY_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      include: ['**/**.test.[jt]s(x)?'],
      setupFiles: './src/setupTests.js',
    },
  };
});
