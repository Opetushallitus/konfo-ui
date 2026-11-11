import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintReact from '@eslint-react/eslint-plugin';
import lodashEsPlugin from 'eslint-plugin-lodash-es';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import playwright from 'eslint-plugin-playwright';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default defineConfig([
  globalIgnores([
    'build/',
    'public/',
    '**/*.min.js',
    '**/rpc-client.js',
    'playwright/fixtures',
    'playwright/mocks',
    'test-server.js',
    'src/types/contentful/**',
    '**/konfo-backend.d.ts',
  ]),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      eslintReact.configs['recommended-typescript'],
      lodashEsPlugin.configs.recommended,
      eslintConfigPrettier,
    ],
    plugins: {
      prettier: prettierPlugin,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'react-refresh/only-export-components': [
        'error',
        {
          allowConstantExport: true,
          checkJS: true,
          extraHOCs: ['withStyles', 'styled'],
        },
      ],
      '@eslint-react/rules-of-hooks': 'error',
      '@eslint-react/exhaustive-deps': 'warn',
      // @eslint-react/eslint-plugin's recommended-typescript config bundles a much larger
      // "React Compiler readiness" rule set beyond rules-of-hooks/exhaustive-deps (purity,
      // set-state-in-*, static-components, use-memo/use-state, unsupported-syntax,
      // error-boundaries). Disabled here to keep the same scope the project had with
      // eslint-plugin-react-hooks; adopting the full set is a separate, code-level task.
      '@eslint-react/purity': 'off',
      '@eslint-react/set-state-in-effect': 'off',
      '@eslint-react/set-state-in-render': 'off',
      '@eslint-react/static-components': 'off',
      '@eslint-react/unsupported-syntax': 'off',
      '@eslint-react/use-memo': 'off',
      '@eslint-react/use-state': 'off',
      '@eslint-react/error-boundaries': 'off',
      // Not enforced before the flat config migration; fixing these needs code-level work
      // (stable keys for list items, forwardRef -> ref prop), so they're a separate task.
      '@eslint-react/no-array-index-key': 'off',
      '@eslint-react/no-forward-ref': 'off',
      'no-empty': 'off',
      'no-duplicate-imports': ['error', { allowSeparateTypeImports: true }],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            '@mui/styles',
            {
              name: '@emotion/styled',
              message: 'Please use "import { styled } from \'#/src/theme\'"',
            },
          ],
          patterns: [
            {
              group: ['@mui/*'],
              importNames: ['styled'],
              message: 'Please use "import { styled } from \'#/src/theme\'"',
            },
            {
              group: ['lodash', 'lodash/**', 'lodash-fp', 'lodash-fp/**'],
              message: 'Import from lodash-es, not lodash or lodash-fp.',
            },
          ],
        },
      ],
      '@typescript-eslint/no-deprecated': 'error',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowTernary: true,
        },
      ],
      '@typescript-eslint/array-type': [
        'error',
        {
          default: 'generic',
        },
      ],
      'prettier/prettier': 'warn',
      'no-negated-condition': 'error',
      'no-implicit-coercion': 'error',
      'no-var': 'error',
    },
  },
  {
    files: ['playwright/*.ts'],
    extends: [playwright.configs['flat/recommended']],
    rules: {
      'playwright/expect-expect': 'off',
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },
]);
