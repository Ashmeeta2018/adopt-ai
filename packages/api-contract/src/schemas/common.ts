import { z } from 'zod';

export const idSchema = z.string().cuid2().or(z.string().uuid());
export const emailSchema = z.string().email().max(254).toLowerCase().trim();
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s\-().]{7,}$/, 'Enter a valid phone number');

export const orgScope = z.object({
  organisationId: idSchema,
});

export const cursorPagination = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CursorPagination = z.infer<typeof cursorPagination>;
