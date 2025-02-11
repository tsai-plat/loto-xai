import js from '@eslint/js';
import globals from 'globals';

import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config({
  extends: [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    eslintConfigPrettier,
  ],
  files: ['**/*.{ts,js,json}'],
  ignores: [
    'build/*',
    '.changeset/*',
    '.vscode/*',
    '.husky/*',
    'dist',
    'node_modules',
    '.vscode',
    'tsconfig.json',
    'tsconfig.*.json',
    'package.json',
    '.*',
    'commitlint.config.mjs',
  ],
  languageOptions: {
    ecmaVersion: 2020,
    globals: {
      ...globals.browser,
      ...globals.node,
      ...globals.jest,
    },
  },
  plugins: {},
  rules: {
    'arrow-body-style': 'warn',
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        'args': 'all',
        'argsIgnorePattern': '^_',
        'caughtErrors': 'all',
        'caughtErrorsIgnorePattern': '^_',
        'destructuredArrayIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
        'ignoreRestSiblings': true,
      },
    ],
    // "@typescript-eslint/no-unused-expressions": "off"
  },
});
