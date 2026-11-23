import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },

  // Katman kuralı: engine/ React'ı, ui/'yi ve scene/'i tanımaz
  {
    files: ['src/engine/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['react', 'react/*', 'react-dom', 'react-dom/*', '@react-three/*'], message: 'engine/ React bilmez.' },
          { group: ['**/ui', '**/ui/*', '**/scene', '**/scene/*'], message: 'engine/ ui/ ve scene/ katmanlarını import edemez.' },
        ],
      }],
    },
  },

  // Katman kuralı: state/ hiçbir katmanı ve React'ı tanımaz
  {
    files: ['src/state/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['react', 'react/*', 'react-dom', 'react-dom/*'], message: 'state/ React bilmez (vanilla store).' },
          { group: ['**/engine', '**/engine/*', '**/ui', '**/ui/*', '**/scene', '**/scene/*'], message: 'state/ başka katman import edemez.' },
        ],
      }],
    },
  },
])