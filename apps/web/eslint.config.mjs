import nextConfig from '@adopt-ai/config-eslint/next';

export default [
  ...nextConfig,
  {
    settings: {
      next: { rootDir: '.' },
    },
  },
];
