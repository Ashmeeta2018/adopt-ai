import nextConfig from '@adopt-ai/config-eslint/next';

export default [
  ...nextConfig,
  {
    settings: {
      next: { rootDir: '.' },
    },
  },
  {
    // Config files aren't part of the TS project — skip type-aware linting.
    ignores: ['*.config.mjs', 'lighthouserc.json'],
  },
  {
    // Playwright fixtures use a `use` callback that the React hooks rule
    // mistakes for the React `use` hook.
    files: ['tests/e2e/**'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  },
];
