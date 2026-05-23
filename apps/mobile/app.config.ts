import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Adopt AI',
  slug: 'adopt-ai-portal',
  scheme: 'adoptai',
  version: '0.1.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.adoptai.portal',
    config: {
      usesNonExemptEncryption: false,
    },
    infoPlist: {
      NSFaceIDUsageDescription: 'Use Face ID to unlock the Adopt AI portal.',
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: 'com.adoptai.portal',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0F0805', // theme.colors.void — Expo config can't import ESM tokens
    },
  },
  plugins: [
    'expo-router',
    'expo-font',
    'expo-secure-store',
    [
      'expo-local-authentication',
      { faceIDPermission: 'Allow Adopt AI to use Face ID.' },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api',
    version: process.env.EXPO_PUBLIC_APP_VERSION ?? '0.1.0',
    buildNumber: process.env.EXPO_PUBLIC_BUILD_NUMBER ?? 'dev',
  },
};

export default config;
