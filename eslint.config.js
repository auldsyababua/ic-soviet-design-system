import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['dist', 'storybook-static', 'coverage', 'node_modules', 'fonts', 'design-preview'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // CSS custom properties in inline styles require object casts; allow the
      // intentional `as` escape hatches the Contract uses.
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  // config/build files run in Node and aren't part of the tsconfig program
  {
    files: ['*.{js,ts}', '.storybook/**/*.{js,ts}'],
    languageOptions: { globals: { ...globals.node } },
  },
  ...storybook.configs['flat/recommended'],
  {
    // We target Storybook 8.6, where `import type { Meta, StoryObj } from
    // '@storybook/react'` is the correct convention (the framework package does
    // not re-export those types in SB8). `no-renderer-packages` is a SB9+ rule.
    files: ['**/*.stories.@(ts|tsx)'],
    rules: { 'storybook/no-renderer-packages': 'off' },
  },
);
