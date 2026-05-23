import { requestMagicLinkInput } from '@adopt-ai/api-contract';
import { TRPCError } from '@trpc/server';

import { authLimiter } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

import { publicProcedure, router } from '../trpc';

export const authRouter = router({
  requestMagicLink: publicProcedure
    .input(requestMagicLinkInput)
    .mutation(async ({ input, ctx }) => {
      const key = ctx.ip ?? input.email;
      const limited = await authLimiter.limit(key);
      if (!limited.success) {
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: 'Too many requests. Try again in five minutes.',
        });
      }

      // The actual magic-link send is handled by the Auth.js signIn endpoint;
      // this tRPC procedure exists so the mobile app and the portal can
      // request links with a single typed contract.
      logger.info({ provider: 'email' }, 'auth.requestMagicLink');
      return { ok: true as const };
    }),
});
