import { z } from 'zod';

export const analyticsEnvSchema = z.object({
  SENTRY_DSN: z.string().optional(),
  SENTRY_ENVIRONMENT: z.string().default('development'),
  SENTRY_TRACES_SAMPLE_RATE: z.coerce.number().default(0.1),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  VERCEL_ANALYTICS_ID: z.string().optional(),
});

export type AnalyticsEnv = z.infer<typeof analyticsEnvSchema>;

export function parseAnalyticsEnv(source: Record<string, string | undefined>): AnalyticsEnv {
  return analyticsEnvSchema.parse(source);
}
