import { beforeEach, describe, expect, it, vi } from 'vitest';

import { authRouter } from '@/lib/trpc/routers/auth';

// ── Mocks ──────────────────────────────────────────────────────
vi.mock('@/lib/rate-limit', () => ({
  authLimiter: {
    limit: vi.fn().mockResolvedValue({ success: true, remaining: 9 }),
  },
  contactLimiter: {
    limit: vi.fn().mockResolvedValue({ success: true, remaining: 4 }),
  },
}));

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

// ── Helpers ────────────────────────────────────────────────────
function caller(ip: string | null = '127.0.0.1') {
  return authRouter.createCaller({ session: null, prisma: {} as never, ip });
}

// ── Tests ──────────────────────────────────────────────────────
describe('authRouter.requestMagicLink', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns ok:true for a valid email', async () => {
    const result = await caller().requestMagicLink({ email: 'user@example.com' });
    expect(result.ok).toBe(true);
  });

  it('uses the IP as the rate-limit key when available', async () => {
    const { authLimiter } = await import('@/lib/rate-limit');
    await caller('203.0.113.42').requestMagicLink({ email: 'user@example.com' });
    expect(vi.mocked(authLimiter.limit)).toHaveBeenCalledWith('203.0.113.42');
  });

  it('falls back to email as key when IP is null', async () => {
    const { authLimiter } = await import('@/lib/rate-limit');
    await caller(null).requestMagicLink({ email: 'user@example.com' });
    expect(vi.mocked(authLimiter.limit)).toHaveBeenCalledWith('user@example.com');
  });

  it('normalises mixed-case emails', async () => {
    // Zod .toLowerCase() on the email schema
    const { authLimiter } = await import('@/lib/rate-limit');
    await caller(null).requestMagicLink({ email: 'User@Example.COM' });
    expect(vi.mocked(authLimiter.limit)).toHaveBeenCalledWith('user@example.com');
  });

  it('throws TOO_MANY_REQUESTS when rate-limited', async () => {
    const { authLimiter } = await import('@/lib/rate-limit');
    // Cast because our in-memory mock returns a narrower type than Upstash's RatelimitResponse.
    // The router only reads `.success` and `.remaining`, so the mock is behaviourally correct.
    // `as never` is the idiomatic Vitest escape hatch when the mock shape is
    // narrower than the actual return type (our in-memory stub omits `limit`/`pending`).
    vi.mocked(authLimiter.limit).mockResolvedValueOnce(
      { success: false, remaining: 0 } as never,
    );

    await expect(
      caller().requestMagicLink({ email: 'user@example.com' }),
    ).rejects.toThrow('Too many requests');
  });

  it('rejects invalid email addresses', async () => {
    await expect(
      caller().requestMagicLink({ email: 'not-an-email' }),
    ).rejects.toThrow();
  });

  it('rejects disallowed callback paths with protocol', async () => {
    await expect(
      caller().requestMagicLink({
        email: 'user@example.com',
        callbackPath: 'https://evil.com',
      }),
    ).rejects.toThrow();
  });

  it('accepts a valid relative callback path', async () => {
    const result = await caller().requestMagicLink({
      email: 'user@example.com',
      callbackPath: '/portal/dashboard',
    });
    expect(result.ok).toBe(true);
  });

  it('logs the magic-link request', async () => {
    const { logger } = await import('@/lib/logger');
    await caller().requestMagicLink({ email: 'user@example.com' });
    expect(vi.mocked(logger.info)).toHaveBeenCalledWith(
      expect.objectContaining({ provider: 'email' }),
      expect.any(String),
    );
  });
});
