import dns from 'dns';
import path from 'path';
import url from 'url';

import react from '@vitejs/plugin-react';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import { defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';
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
            // Paketin nimen perusteella, koska pnpm:n hakemistonimissä olevat hashit voivat
            // sisältää esim. merkkijonon "d3"
            if (/[\\/]node_modules[\\/](victory|d3)[^\\/]*[\\/]/.test(id)) {
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
      // Tuotanto-buildissa karsitaan devaus-plugineja hidastamasta
      ...(isDev
        ? [
            checker({
              typescript: true,
              eslint: {
                lintCommand: 'eslint ./src',
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
