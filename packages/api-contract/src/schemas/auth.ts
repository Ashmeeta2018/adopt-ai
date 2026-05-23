import { z } from 'zod';

import { emailSchema } from './common';

export const requestMagicLinkInput = z.object({
  email: emailSchema,
  // Allowlisted relative path the client expects to land on after sign-in.
  callbackPath: z
    .string()
    .startsWith('/')
    .refine((p) => !p.startsWith('//') && !p.includes(':'), 'Disallowed callback path')
    .optional(),
});

export const requestMagicLinkOutput = z.object({
  ok: z.literal(true),
  /** True only in dev — the link is also emailed. */
  devLink: z.string().url().optional(),
});

export type RequestMagicLinkInput = z.infer<typeof requestMagicLinkInput>;
