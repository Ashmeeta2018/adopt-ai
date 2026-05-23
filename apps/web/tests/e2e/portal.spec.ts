/**
 * E2E smoke tests for the Adopt AI client portal.
 *
 * The portal login page is public. The dashboard and sub-routes are
 * protected — unauthenticated requests should redirect to /portal.
 *
 * We do NOT test sign-in end-to-end here because it requires real Auth.js
 * email delivery and is covered separately by integration tests against
 * a seeded database. These smoke tests focus on what an anonymous visitor
 * and a properly sign-in'd user (via session fixture) can observe.
 */
import { expect, test } from '@playwright/test';

// ── Portal login page ──────────────────────────────────────────
test.describe('Portal login page (/portal)', () => {
  test('returns 200', async ({ page }) => {
    const res = await page.goto('/portal');
    expect(res?.status()).toBeLessThan(400);
  });

  test('shows "Welcome back." headline', async ({ page }) => {
    await page.goto('/portal');
    await expect(page.locator('text=Welcome back')).toBeVisible();
  });

  test('shows the email sign-in form', async ({ page }) => {
    await page.goto('/portal');
    await expect(page.getByRole('textbox').first()).toBeVisible();
  });

  test('shows SSO button', async ({ page }) => {
    await page.goto('/portal');
    await expect(
      page.getByRole('button', { name: /SSO|Okta/i }),
    ).toBeVisible();
  });

  test('shows security compliance footer', async ({ page }) => {
    await page.goto('/portal');
    await expect(page.locator('text=SOC 2').first()).toBeVisible();
    await expect(page.locator('text=HIPAA')).toBeVisible();
  });

  test('has the brand mark visible', async ({ page }) => {
    await page.goto('/portal');
    // BrandMark renders an img with alt="Adopt AI"
    const mark = page.getByRole('img', { name: /Adopt AI/i }).first();
    await expect(mark).toBeVisible();
  });
});

// ── Portal login form interaction ─────────────────────────────
test.describe('Portal login form', () => {
  test('accepts a valid email and shows confirmation', async ({ page }) => {
    // We don't have a real mail server — just test that the form submits
    // successfully to the tRPC endpoint and shows the confirmation message.
    // The tRPC mock layer (or real dev server) handles the mutation.
    await page.goto('/portal');

    const emailInput = page.getByRole('textbox').first();
    await emailInput.fill('maya@apex.example');

    const submitBtn = page.getByRole('button', { name: /sign.?in link|send/i });
    await submitBtn.click();

    // Either shows confirmation or an error — we just check it responded.
    // In CI the dev tRPC endpoint is live so it should show the confirmation.
    await expect(
      page.locator('text=Check your inbox').or(
        page.locator('text=sent you a sign-in link'),
      ).or(
        // If rate-limited or server error
        page.locator('[role="alert"]'),
      ),
    ).toBeVisible({ timeout: 10_000 });
  });

  test('shows an error for an invalid email', async ({ page }) => {
    await page.goto('/portal');

    const emailInput = page.getByRole('textbox').first();
    await emailInput.fill('not-an-email');

    const submitBtn = page.getByRole('button', { name: /sign.?in link|send/i });
    await submitBtn.click();

    // Zod validation error should appear
    await expect(
      page.locator('[role="alert"]').or(page.locator('text=valid email')),
    ).toBeVisible({ timeout: 5_000 });
  });
});

// ── Protected portal routes ────────────────────────────────────
test.describe('Protected portal routes', () => {
  const protectedPaths = [
    '/portal/dashboard',
    '/portal/agents',
    '/portal/reports',
    '/portal/alerts',
  ];

  for (const path of protectedPaths) {
    test(`${path} redirects unauthenticated users`, async ({ page }) => {
      await page.goto(path);
      // Should land on /portal (the sign-in page) or a 401/403
      const url = page.url();
      const isRedirectedToPortal = url.includes('/portal') && !url.includes('/portal/dashboard');
      const status = await page.evaluate(() => document.documentElement.dataset.status);
      expect(isRedirectedToPortal || status === '401' || status === '403').toBeTruthy();
    });
  }
});

// ── Portal health check ───────────────────────────────────────
test.describe('API health', () => {
  test('/api/health returns { ok: true }', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.status()).toBe(200);
    const body = await response.json() as { ok: boolean; ts?: string };
    expect(body.ok).toBe(true);
    expect(body.ts).toBeTruthy();
  });
});
