import { z } from 'zod';

const claudeEnvSchema = z.object({
  // Optional — the AI SDK's gateway provider resolves credentials itself:
  // AI_GATEWAY_API_KEY locally, OIDC on Vercel deployments.
  AI_GATEWAY_API_KEY: z.string().min(1).optional(),
  // AI Gateway model id ("provider/model").
  CLAUDE_MODEL: z.string().min(1).default('anthropic/claude-sonnet-5'),
  CLAUDE_MAX_TOKENS: z
    .string()
    .default('4096')
    .transform((v) => {
      const parsed = Number(v);
      if (!Number.isFinite(parsed) || parsed < 1) {
        throw new Error('CLAUDE_MAX_TOKENS must be a positive number');
      }
      return parsed;
    }),
  // Optional — current-generation models (Sonnet 5, Opus 4.7+) reject
  // non-default sampling params, so temperature is only sent when set.
  CLAUDE_TEMPERATURE: z
    .string()
    .optional()
    .transform((v) => {
      if (v === undefined) return undefined;
      const parsed = Number(v);
      if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) {
        throw new Error('CLAUDE_TEMPERATURE must be between 0 and 1');
      }
      return parsed;
    }),
});

export type ClaudeEnv = z.infer<typeof claudeEnvSchema>;

export function getClaudeEnv(overrides?: Partial<Record<string, string | undefined>>): ClaudeEnv {
  return claudeEnvSchema.parse({
    AI_GATEWAY_API_KEY: overrides?.AI_GATEWAY_API_KEY ?? process.env.AI_GATEWAY_API_KEY,
    CLAUDE_MODEL: overrides?.CLAUDE_MODEL ?? process.env.CLAUDE_MODEL,
    CLAUDE_MAX_TOKENS: overrides?.CLAUDE_MAX_TOKENS ?? process.env.CLAUDE_MAX_TOKENS,
    CLAUDE_TEMPERATURE: overrides?.CLAUDE_TEMPERATURE ?? process.env.CLAUDE_TEMPERATURE,
  });
}
