import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const baseClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['warn', 'error']
        : ['error'],
  });

export const prisma = baseClient.$extends({
  query: {
    async $allOperations({ args, query }) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          return await query(args);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          if (attempt === 0 && (msg.includes('Closed') || msg.includes('Connection'))) {
            continue;
          }
          throw err;
        }
      }
    },
  },
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = baseClient;
}

export * from '@prisma/client';
