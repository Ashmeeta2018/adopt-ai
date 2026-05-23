/**
 * Security-header smoke tests.
 *
 * These hit the live Next.js server and assert that the middleware-injected
 * headers are present and sane. Failures here mean someone edited middleware.ts
 * in a way that weakened the security posture.
 *
 * See also: CI runs `pnpm audit --prod` and gitleaks as separate checks.
 */
import { expect, test } from '@playwright/test';

const SECURITY_PAGES = ['/', '/pricing', '/portal', '/contact'];

for (const path of SECURITY_PAGES) {
  test.describe(`Security headers on ${path}`, () => {
    let headers: Record<string, string>;

    test.beforeAll(async ({ request }) => {
      const response = await request.get(path);
      const raw = response.headers();
      headers = Object.fromEntries(
        Object.entries(raw).map(([k, v]) => [k.toLowerCase(), v]),
      );
    });

    test('Content-Security-Policy header is present', () => {
      expect(headers['content-security-policy']).toBeTruthy();
    });

    test('CSP contains script-src with nonce', () => {
      const csp = headers['content-security-policy'] ?? '';
      expect(csp).toContain('script-src');
      // Either nonce or strict-dynamic — not unsafe-inline
      const hasNonce = csp.includes("'nonce-") || csp.includes("'strict-dynamic'");
      expect(hasNonce, `CSP script-src should use nonce or strict-dynamic: ${csp}`).toBe(true);
    });

    test('CSP does not contain unsafe-eval in production', () => {
      // Skip this check in development (dev mode uses unsafe-eval for HMR)
      if (process.env.NODE_ENV === 'production') {
        const csp = headers['content-security-policy'] ?? '';
        expect(csp).not.toContain("'unsafe-eval'");
      }
    });

    test('X-Content-Type-Options is nosniff', () => {
      expect(headers['x-content-type-options']).toBe('nosniff');
    });

    test('X-Frame-Options is DENY', () => {
      expect(headers['x-frame-options']).toBe('DENY');
    });

    test('Referrer-Policy header is present', () => {
      expect(headers['referrer-policy']).toBeTruthy();
    });

    test('Permissions-Policy header is present', () => {
      expect(headers['permissions-policy']).toBeTruthy();
    });

    test('X-Powered-By header is absent (no info disclosure)', () => {
      expect(headers['x-powered-by']).toBeUndefined();
    });
  });
}

// ── API endpoint security ──────────────────────────────────────
test.describe('API endpoint hardening', () => {
  test('tRPC endpoint rejects unauthenticated portal.getDashboard', async ({ request }) => {
    const response = await request.post('/api/trpc/portal.getDashboard', {
      headers: { 'Content-Type': 'application/json' },
      data: {},
    });
    // Should return 401 or a tRPC UNAUTHORIZED error (200 with error in body)
    const isUnauthorized =
      response.status() === 401 ||
      response.status() === 403 ||
      (response.status() === 200 &&
        ((await response.json()) as { error?: { data?: { code?: string } } })?.error?.data?.code === 'UNAUTHORIZED');
    expect(isUnauthorized, `Expected UNAUTHORIZED, got ${response.status()}`).toBe(true);
  });

  test('health endpoint responds with ok:true', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.status()).toBe(200);
    const body = await response.json() as { ok: boolean };
    expect(body.ok).toBe(true);
  });
});
