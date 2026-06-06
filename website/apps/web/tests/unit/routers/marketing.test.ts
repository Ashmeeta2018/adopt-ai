import { describe, expect, it, vi } from 'vitest';

import { marketingRouter } from '@/lib/trpc/routers/marketing';
import type { TrpcContext } from '@/lib/trpc/context';

// ── Mocks ──────────────────────────────────────────────────────
vi.mock('@/lib/rate-limit', () => ({
  contactLimiter: {
    limit: vi.fn().mockResolvedValue({ success: true, remaining: 4 }),
  },
  authLimiter: {
    limit: vi.fn().mockResolvedValue({ success: true, remaining: 9 }),
  },
}));

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn() },
}));

// ── Helpers ────────────────────────────────────────────────────
function createCaller(overrides: Partial<TrpcContext> = {}) {
  const ctx: TrpcContext = {
    session: null,
    prisma: {
      contactSubmission: { create: vi.fn().mockResolvedValue({}) },
    } as unknown as TrpcContext['prisma'],
    ip: '127.0.0.1',
    ...overrides,
  };
  return marketingRouter.createCaller(ctx);
}

const validInput = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  company: 'Acme Corp',
  engagement: 'lift' as const,
  workflow: 'I want to automate inbox triage for my support team.',
};

// ── Tests ──────────────────────────────────────────────────────
describe('marketingRouter.contact.submit', () => {
  it('accepts a valid submission', async () => {
    const result = await createCaller().contact.submit(validInput);
    expect(result.ok).toBe(true);
    expect(result.ticketId).toBeTruthy();
  });

  it('silently accepts honeypot submissions', async () => {
    const result = await createCaller().contact.submit({ ...validInput, hp: '' });
    expect(result.ok).toBe(true);
  });

  it('returns a valid ticketId (UUID)', async () => {
    const result = await createCaller().contact.submit(validInput);
    expect(result.ticketId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });

  it('rejects when rate limited', async () => {
    const { contactLimiter } = await import('@/lib/rate-limit');
    vi.mocked(contactLimiter.limit).mockResolvedValueOnce(
      // The in-memory mock returns fewer fields than Upstash's RatelimitResponse.
      // The router only reads `.success`, so the mock is behaviourally correct.
      { success: false, remaining: 0 } as never,
    );

    await expect(createCaller().contact.submit(validInput)).rejects.toThrow(
      'Too many submissions',
    );
  });
});
