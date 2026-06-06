/**
 * E2E tests for the contact form — the most critical conversion point
 * on the marketing site.
 *
 * These tests exercise both client-side validation (Zod + RHF) and the
 * full round-trip to the tRPC mutation endpoint.
 */
import { expect, test } from '@playwright/test';

const CONTACT_PATH = '/contact';

// ── Page load ──────────────────────────────────────────────────
test.describe('Contact page', () => {
  test('renders the page without errors', async ({ page }) => {
    await page.goto(CONTACT_PATH);
    await expect(page).toHaveTitle(/Contact.*Adopt AI/i);
    // No error boundaries should be showing
    await expect(page.locator('text=Application error').or(page.locator('text=Something went wrong'))).not.toBeVisible();
  });

  test('shows both the copy block and the form card', async ({ page }) => {
    await page.goto(CONTACT_PATH);
    // Hero copy
    await expect(page.locator('text=eating someone')).toBeVisible();
    // Form fields
    await expect(page.getByRole('textbox', { name: /your name/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /work email/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /company/i })).toBeVisible();
  });
});

// ── Client-side validation ─────────────────────────────────────
test.describe('Contact form — validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(CONTACT_PATH);
  });

  test('shows error when submitting with empty fields', async ({ page }) => {
    await page.getByRole('button', { name: /request a working session/i }).click();
    // At least one validation message should appear
    await expect(page.locator('[role="alert"]').first()).toBeVisible({ timeout: 3_000 });
  });

  test('shows error for invalid email', async ({ page }) => {
    await page.getByRole('textbox', { name: /your name/i }).fill('Test User');
    await page.getByRole('textbox', { name: /work email/i }).fill('bad-email');
    await page.getByRole('textbox', { name: /company/i }).fill('Acme');
    await page.getByRole('button', { name: /request a working session/i }).click();

    await expect(
      page.locator('[role="alert"]').filter({ hasText: /email|valid/i }),
    ).toBeVisible({ timeout: 3_000 });
  });

  test('shows error when workflow textarea is too short', async ({ page }) => {
    await page.getByRole('textbox', { name: /your name/i }).fill('Test User');
    await page.getByRole('textbox', { name: /work email/i }).fill('test@example.com');
    await page.getByRole('textbox', { name: /company/i }).fill('Acme Corp');
    await page.getByRole('textbox', { name: /workflow/i }).fill('Too short');
    await page.getByRole('button', { name: /request a working session/i }).click();

    await expect(
      page.locator('[role="alert"]').filter({ hasText: /sentence|character/i }),
    ).toBeVisible({ timeout: 3_000 });
  });
});

// ── Engagement tier selection ──────────────────────────────────
test.describe('Contact form — engagement tier pills', () => {
  test('can select each engagement tier', async ({ page }) => {
    await page.goto(CONTACT_PATH);

    for (const tier of ['Spark', 'Lift', 'Scale', 'Not sure']) {
      const pill = page.getByRole('button', { name: new RegExp(tier, 'i') }).first();
      if (await pill.isVisible()) {
        await pill.click();
        // After click, the pill should have active styling (bg-ink class)
        await expect(pill).toHaveClass(/bg-ink/);
      }
    }
  });
});

// ── Happy-path submission ──────────────────────────────────────
test.describe('Contact form — happy path', () => {
  test('shows confirmation after a valid submission', async ({ page }) => {
    await page.goto(CONTACT_PATH);

    await page.getByRole('textbox', { name: /your name/i }).fill('Maya Lindqvist');
    await page.getByRole('textbox', { name: /work email/i }).fill('maya@apex.example');
    await page.getByRole('textbox', { name: /company/i }).fill('Apex Regional Logistics');

    // Select "Lift" tier
    const liftPill = page.getByRole('button', { name: /Lift/i }).first();
    if (await liftPill.isVisible()) {
      await liftPill.click();
    }

    await page.getByRole('textbox', { name: /workflow/i }).fill(
      'I want to automate our inbound carrier email triage. We get around 1,000 emails per week and it takes three full-time coordinators to process them.',
    );

    await page.getByRole('button', { name: /request a working session/i }).click();

    await expect(
      page.locator("text=Got it").or(page.locator("text=we'll be in touch")).or(
        page.locator("text=Thank you"),
      ),
    ).toBeVisible({ timeout: 10_000 });
  });
});

// ── Never share email copy ─────────────────────────────────────
test.describe('Contact form — trust signals', () => {
  test('shows "never share your email" footer', async ({ page }) => {
    await page.goto(CONTACT_PATH);
    await expect(
      page.locator('text=never share your email').or(page.locator('text=NEVER SHARE YOUR EMAIL')),
    ).toBeVisible();
  });
});
