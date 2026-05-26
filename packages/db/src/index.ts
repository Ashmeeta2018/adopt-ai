import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

function makePrismaClient() {
  // PrismaNeon + Pool uses Neon's WebSocket driver — no binary engine required.
  // This is the correct approach for Prisma on Neon + Vercel serverless.
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaNeon(pool);
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
