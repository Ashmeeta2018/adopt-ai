/**
 * Composed Jest resolver:
 * 1. react-native-worklets needs its `.native` entrypoints skipped under Jest
 *    (they require a native worklets runtime) — same logic as the resolver the
 *    package ships at react-native-worklets/jest/resolver.js.
 * 2. Everything then delegates to jest-expo's resolver (Metro alias emulation),
 *    which would otherwise be lost by overriding `resolver`.
 */
const preset = require('jest-expo/jest-preset');
const baseResolver = require(preset.resolver);

module.exports = (request, options) => {
  if (
    options.basedir.includes('react-native-worklets') ||
    request.includes('react-native-worklets')
  ) {
    options = {
      ...options,
      extensions: options.extensions?.filter((ext) => !ext.includes('native')),
    };
  }
  return baseResolver(request, options);
};
