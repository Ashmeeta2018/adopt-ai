import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

function makePrismaClient() {
  // PrismaNeon v6.x accepts a PoolConfig object, not a Pool instance.
  // It manages the Neon WebSocket pool internally — no binary engine required.
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const baseClient = globalForPrisma.prisma ?? makePrismaClient();

export const prisma = baseClient.$extends({
  query: {
    async $allOperations({ args, query }) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          // query() is typed as `any` by Prisma's extension API — cast through unknown.
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return await query(args);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          if (attempt === 0 && (msg.includes('Closed') || msg.includes('Connection'))) {
            continue;
          }
          throw err;
        }
      }
      // TypeScript requires an explicit return — the loop always throws or returns above.
      throw new Error('Unreachable');
    },
  },
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = baseClient;
}

export * from '@prisma/client';
