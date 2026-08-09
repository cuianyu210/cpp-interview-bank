import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'app.js',
      'questions.js',
      'styles.css',
      'dist/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**'
    ]
  },
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts', 'tools/**/*.ts', 'tests/**/*.ts', '*.config.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error'
    }
  },
  {
    files: ['src/**/*.ts', 'tools/**/*.ts'],
    rules: {
      complexity: ['error', 10],
      'max-lines': ['error', { max: 200, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['error', { max: 60, skipBlankLines: true, skipComments: true, IIFEs: true }]
    }
  }
);
