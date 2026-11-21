import rnConfig from '@adopt-ai/config-eslint/react-native';

export default [
  ...rnConfig,
  {
    rules: {
      // React Native resolves static assets via require('./asset.png') —
      // there is no import-based equivalent for Metro asset resolution.
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
