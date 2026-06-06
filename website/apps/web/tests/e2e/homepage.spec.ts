import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads and shows hero content', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Adopt AI/);
  });

  test('has a visible call-to-action', async ({ page }) => {
    await page.goto('/');
    const cta = page.getByRole('link', { name: /get started|book a call|start/i }).first();
    await expect(cta).toBeVisible();
  });
});

test.describe('Marketing pages', () => {
  test('pricing page loads', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.locator('body')).toBeVisible();
  });

  test('services page loads', async ({ page }) => {
    await page.goto('/services');
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Portal auth redirect', () => {
  test('unauthenticated /portal/dashboard redirects to /portal', async ({ page }) => {
    await page.goto('/portal/dashboard');
    // Next.js auth middleware should redirect unauthenticated users
    expect(page.url()).toMatch(/\/portal$/);
  });
});
