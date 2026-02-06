import eslint from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import prettier from 'eslint-config-prettier'

export default [
  {
    ignores: ['dist/**'],
  },
  eslint.configs.recommended,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: 'module',
      },
      globals: {
        document: 'readonly',
        setTimeout: 'readonly',
        console: 'readonly',
        HTMLElement: 'readonly',
        HTMLDivElement: 'readonly',
        Element: 'readonly',
        XPathResult: 'readonly',
        Document: 'readonly',
        MutationObserver: 'readonly',
        global: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['error'] }],
    },
  },
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      globals: {
        console: 'readonly',
      },
    },
  },
  prettier,
]
