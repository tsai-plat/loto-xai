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
    'package.json',
    '.*',
    'commitlint.config.mjs',
  ],
  languageOptions: {
    ecmaVersion: 2020,
    globals: {
      ...globals.browser,
      ...globals.node,
    },
  },
  plugins: {},
  rules: {
    'arrow-body-style': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
  },
});
