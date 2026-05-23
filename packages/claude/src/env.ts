import { z } from 'zod';

const claudeEnvSchema = z.object({
  ANTHROPIC_API_KEY: z.string().min(1),
  CLAUDE_MODEL: z.string().min(1).default('claude-sonnet-4-6-20250514'),
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
  CLAUDE_TEMPERATURE: z
    .string()
    .default('0')
    .transform((v) => {
      const parsed = Number(v);
      if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) {
        throw new Error('CLAUDE_TEMPERATURE must be between 0 and 1');
      }
      return parsed;
    }),
});

export type ClaudeEnv = z.infer<typeof claudeEnvSchema>;

export function getClaudeEnv(
  overrides?: Partial<Record<string, string | undefined>>,
): ClaudeEnv {
  return claudeEnvSchema.parse({
    ANTHROPIC_API_KEY: overrides?.ANTHROPIC_API_KEY ?? process.env.ANTHROPIC_API_KEY,
    CLAUDE_MODEL: overrides?.CLAUDE_MODEL ?? process.env.CLAUDE_MODEL,
    CLAUDE_MAX_TOKENS: overrides?.CLAUDE_MAX_TOKENS ?? process.env.CLAUDE_MAX_TOKENS,
    CLAUDE_TEMPERATURE: overrides?.CLAUDE_TEMPERATURE ?? process.env.CLAUDE_TEMPERATURE,
  });
}
