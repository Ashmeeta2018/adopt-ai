import { z } from 'zod';

const envSchema = z.object({
  AUTH_SECRET: z.string().min(32, 'AUTH_SECRET must be at least 32 chars'),
  AUTH_TRUST_HOST: z
    .union([z.literal('true'), z.literal('false')])
    .default('false')
    .transform((v) => v === 'true'),
  AUTH_RESEND_KEY: z.string().optional(),
  AUTH_EMAIL_FROM: z.string().email().default('hello@adoptai.com'),
  AUTH_OKTA_ID: z.string().optional(),
  AUTH_OKTA_SECRET: z.string().optional(),
  AUTH_OKTA_ISSUER: z.string().url().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
});

export const authEnv = envSchema.parse({
  AUTH_SECRET: process.env.AUTH_SECRET,
  AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
  AUTH_RESEND_KEY: process.env.AUTH_RESEND_KEY,
  AUTH_EMAIL_FROM: process.env.AUTH_EMAIL_FROM,
  AUTH_OKTA_ID: process.env.AUTH_OKTA_ID,
  AUTH_OKTA_SECRET: process.env.AUTH_OKTA_SECRET,
  AUTH_OKTA_ISSUER: process.env.AUTH_OKTA_ISSUER,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

export type AuthEnv = typeof authEnv;
