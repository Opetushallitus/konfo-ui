module.exports = {
  parser: '@typescript-eslint/parser',
  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:lodash/recommended',
  ],
  plugins: ['@typescript-eslint', 'prettier', 'lodash', 'import', 'react-refresh'],
  env: {
    browser: true,
    node: true,
  },
  root: true,
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      {
        allowConstantExport: true,
        checkJS: true,
      },
    ],
    'react/prop-types': 'off',
    'react/display-name': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'react/jsx-uses-react': ['warn'],
    'no-restricted-imports': ['error', 'lodash/fp', 'lodash-fp/*'],
    '@typescript-eslint/no-shadow': ['warn'],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          object: false,
        },
        extendDefaults: true,
      },
    ],
    '@typescript-eslint/array-type': [
      'warn',
      {
        default: 'generic',
      },
    ],
    'prettier/prettier': [
      'warn',
      {
        usePrettierrc: true,
      },
    ],
    'import/no-default-export': ['warn'],
    'import/no-duplicates': ['warn'],
    'import/no-anonymous-default-export': 'off',
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal'],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '#/**',
            group: 'internal',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'lodash/import-scope': ['error', 'member'],
    'lodash/matches-prop-shorthand': 'off',
    'lodash/prefer-lodash-method': 'off',
    'lodash/prefer-lodash-chain': 'off',
    'lodash/prefer-constant': 'off',
    'lodash/prefer-noop': 'off',
    'lodash/prefer-immutable-method': 'off',
    'lodash/prefer-includes': 'off',
    'lodash/path-style': ['error', 'as-needed'],
    'no-negated-condition': ['warn'],
    'no-implicit-coercion': ['warn'],
    'no-var': ['warn'],
  },
  overrides: [
    {
      files: '*.config.ts',
      rules: {
        'import/no-default-export': 'off',
      },
    },
    {
      files: './playwright/*.ts',
      extends: 'plugin:playwright/recommended',
      parserOptions: {
        tsconfigRootDir: __dirname,
        parser: '@typescript-eslint/parser',
        project: './playwright/tsconfig.json',
      },
      rules: {
        'playwright/expect-expect': 'off',
        '@typescript-eslint/no-floating-promises': ['error'],
      },
    },
  ],
};
