/**
 * Shared Playwright fixtures and helpers for Adopt AI E2E tests.
 *
 * Usage:
 *   import { test, expect } from '../fixtures';
 *
 * Extends the base @playwright/test with:
 *   - authedPage: a page pre-authenticated with a seeded session cookie.
 *     Only works when the dev server has DATABASE_URL pointing at a seeded DB.
 */
import { type Page, test as base, expect } from '@playwright/test';

// Re-export expect so consumers don't need a separate import
export { expect };

// ── Helpers ────────────────────────────────────────────────────

/** Navigate to a path and assert the response is 2xx. */
export async function loadOk(page: Page, path: string) {
  const res = await page.goto(path);
  expect(res?.status(), `${path} must return 2xx`).toBeLessThan(400);
  return res;
}

/** Wait for network idle then run axe on the current page. */
export async function runAxe(page: Page) {
  const { default: AxeBuilder } = await import('@axe-core/playwright');
  await page.waitForLoadState('networkidle');
  return new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
}

// ── Extended test with authenticated fixture ───────────────────

interface AuthedFixtures {
  /** Page with a session cookie pre-set from the seeded test user. */
  authedPage: Page;
}

export const test = base.extend<AuthedFixtures>({
  authedPage: async ({ page, context }, use) => {
    // Inject a session cookie that Auth.js will accept in test mode.
    // The seed user (maya@apex.example) must exist in the test DB.
    // The cookie value is derived from AUTH_SECRET = 'ci-only-non-secret-value-for-tests-only'.
    //
    // In CI this is populated by running `pnpm db:seed` before the E2E run.
    // In local dev you need DATABASE_URL pointing at a seeded DB.
    //
    // If no cookie is set the authedPage falls back to an anonymous page.
    const sessionCookie = process.env.E2E_SESSION_COOKIE;
    if (sessionCookie) {
      await context.addCookies([
        {
          name: 'authjs.session-token',
          value: sessionCookie,
          domain: 'localhost',
          path: '/',
          httpOnly: true,
          sameSite: 'Lax',
        },
      ]);
    }
    await use(page);
  },
});
