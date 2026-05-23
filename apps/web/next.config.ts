import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: [
    '@adopt-ai/ui-web',
    '@adopt-ai/tokens',
    '@adopt-ai/api-contract',
    '@adopt-ai/auth',
    '@adopt-ai/db',
  ],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
