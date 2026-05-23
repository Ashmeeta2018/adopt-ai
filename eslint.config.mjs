// Root ESLint flat config. Apps and packages extend this via their own eslint.config.mjs.
import baseConfig from '@adopt-ai/config-eslint/base';

export default [
  ...baseConfig,
  {
    ignores: [
      '**/.next/**',
      '**/.expo/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/node_modules/**',
      'Design-Docs/**',
    ],
  },
];
