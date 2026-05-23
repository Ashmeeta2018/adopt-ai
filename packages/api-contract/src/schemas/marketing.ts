import { z } from 'zod';

import { emailSchema } from './common';

export const engagementTier = z.enum(['spark', 'lift', 'scale', 'not-sure']);

export const contactSubmitInput = z.object({
  name: z.string().trim().min(2, 'Tell us your name').max(80),
  email: emailSchema,
  company: z.string().trim().min(2).max(120),
  engagement: engagementTier,
  workflow: z
    .string()
    .trim()
    .min(20, 'A sentence or two about the workflow helps')
    .max(2000, 'Keep it under 2000 characters'),
  // Honeypot — must be empty on legit submits.
  hp: z.string().max(0).optional(),
});

export const contactSubmitOutput = z.object({
  ok: z.literal(true),
  ticketId: z.string(),
});

export type ContactSubmitInput = z.infer<typeof contactSubmitInput>;
export type ContactSubmitOutput = z.infer<typeof contactSubmitOutput>;
