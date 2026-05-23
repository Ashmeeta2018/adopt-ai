import { contactSubmitInput } from '@adopt-ai/api-contract';
import { TRPCError } from '@trpc/server';

import { contactLimiter } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

import { publicProcedure, router } from '../trpc';

export const marketingRouter = router({
  contact: router({
    submit: publicProcedure
      .input(contactSubmitInput)
      .mutation(async ({ input, ctx }) => {
        // Honeypot — silently drop bot submissions.
        if (input.hp) {
          return { ok: true as const, ticketId: 'honeypot' };
        }

        const key = ctx.ip ?? input.email;
        const limited = await contactLimiter.limit(key);
        if (!limited.success) {
          throw new TRPCError({
            code: 'TOO_MANY_REQUESTS',
            message: 'Too many submissions. Try again in a minute.',
          });
        }

        // TODO: notify (Resend, HubSpot, etc.) when integrations land.
        logger.info({ engagement: input.engagement }, 'contact.submit received');

        const ticketId = crypto.randomUUID();
        await ctx.prisma.contactSubmission.create({
          data: {
            name: input.name,
            email: input.email,
            company: input.company,
            engagement: input.engagement,
            workflow: input.workflow,
            ticketId,
          },
        });
        return { ok: true as const, ticketId };
      }),
  }),
});
