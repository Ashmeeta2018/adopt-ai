import path from 'path';

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Point output file tracing at the monorepo root so Next.js includes the
  // Prisma query-engine binary (libquery_engine-rhel-openssl-3.0.x.so.node)
  // in the serverless bundle. Without this the Lambda can't find the engine.
  outputFileTracingRoot: path.join(__dirname, '../../'),
  // Exclude @prisma/client from bundling so it is resolved at runtime from
  // the traced node_modules rather than being inlined (and broken) by webpack.
  serverExternalPackages: ['@prisma/client', '@prisma/engines'],
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
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
