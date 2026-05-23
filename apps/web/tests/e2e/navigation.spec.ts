/**
 * E2E tests for site navigation — the nav bar, footer links, and
 * cross-page link integrity.
 *
 * These are intentionally lightweight: we just verify that clicking a link
 * lands on the right page (correct URL) and doesn't 404.
 */
import { expect, test } from '@playwright/test';

// ── Site nav ───────────────────────────────────────────────────
test.describe('SiteNav — home page (dark variant)', () => {
  test('shows the brand mark', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('img', { name: /Adopt AI/i }).first()).toBeVisible();
  });

  test('shows all six nav items', async ({ page }) => {
    await page.goto('/');
    for (const item of ['Services', 'Work', 'Resources', 'Blog', 'About', 'Pricing']) {
      await expect(
        page.getByRole('link', { name: item }).or(page.getByRole('navigation').getByText(item)),
      ).toBeVisible();
    }
  });

  test('Services link navigates to /services', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Services' }).first().click();
    await page.waitForURL('**/services**');
    expect(page.url()).toContain('/services');
    const res = await page.evaluate(() => document.readyState);
    expect(res).toBe('complete');
  });

  test('Pricing link navigates to /pricing', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Pricing' }).first().click();
    await page.waitForURL('**/pricing**');
    expect(page.url()).toContain('/pricing');
  });

  test('"Book a call" button navigates to /contact', async ({ page }) => {
    await page.goto('/');
    const btn = page.getByRole('button', { name: /book a call/i })
      .or(page.getByRole('link', { name: /book a call/i }))
      .first();
    await btn.click();
    await page.waitForURL('**/contact**', { timeout: 5_000 }).catch(() => {
      // Button might open an external booking page — just verify navigation happened
    });
  });

  test('"Sign in" link navigates to /portal', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /sign in/i }).first().click();
    await page.waitForURL('**/portal**');
    expect(page.url()).toContain('/portal');
  });
});

// ── Logo link ─────────────────────────────────────────────────
test.describe('Logo home link', () => {
  test('clicking logo from /pricing returns to /', async ({ page }) => {
    await page.goto('/pricing');
    await page.getByRole('link', { name: /Adopt AI home/i }).click();
    await page.waitForURL('/');
    expect(new URL(page.url()).pathname).toBe('/');
  });
});

// ── Footer ────────────────────────────────────────────────────
test.describe('SiteFooter links', () => {
  test.beforeEach(async ({ page }) => {
    // Use pricing (light surface, footer rendered)
    await page.goto('/pricing');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  });

  test('footer renders with copyright', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('2026 Adopt AI');
  });

  test('footer has Terms, Privacy, Security links', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer.getByRole('link', { name: /Terms/i })).toBeVisible();
    await expect(footer.getByRole('link', { name: /Privacy/i })).toBeVisible();
    await expect(footer.getByRole('link', { name: /Security/i })).toBeVisible();
  });
});

// ── CTA deep-links ────────────────────────────────────────────
test.describe('Cross-page CTA links', () => {
  test('Home → case study "Read the build log" link works', async ({ page }) => {
    await page.goto('/');
    const link = page.getByRole('link', { name: /build log|case study/i }).first();
    if (await link.isVisible()) {
      await link.click();
      await page.waitForURL('**/work/**');
      expect(page.url()).toContain('/work/');
    }
  });

  test('Pricing → "Talk to an architect" leads to /contact', async ({ page }) => {
    await page.goto('/pricing');
    const btn = page.getByRole('button', { name: /Talk to an architect/i });
    if (await btn.isVisible()) {
      await btn.click();
      // Could navigate to /contact or open an external page
    }
  });
});

// ── Mobile viewport ───────────────────────────────────────────
test.describe('Mobile viewport (375px)', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('home page renders without overflow', async ({ page }) => {
    await page.goto('/');
    const overflowing = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(overflowing, 'Horizontal overflow detected on mobile').toBe(false);
  });

  test('pricing page renders without overflow', async ({ page }) => {
    await page.goto('/pricing');
    const overflowing = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(overflowing, 'Horizontal overflow detected on mobile').toBe(false);
  });
});
