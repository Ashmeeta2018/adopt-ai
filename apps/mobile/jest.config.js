/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  rootDir: '.',
  resolver: '<rootDir>/jest.resolver.js',
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!(' +
      'react-native' +
      '|@react-native' +
      '|expo(nent)?' +
      '|@expo(nent)?' +
      '|@unimodules' +
      '|unimodules' +
      '|native-base' +
      '|react-native-svg' +
      '|@sentry/.*)' +
      ')',
    'node_modules/(?!(.pnpm/)?(' +
      'react-native' +
      '|@react-native' +
      '|expo(nent)?' +
      '|@expo(nent)?' +
      '|@unimodules' +
      '|unimodules' +
      '|native-base' +
      '|react-native-svg' +
      '|@sentry/.*)' +
      ')',
  ],
};
