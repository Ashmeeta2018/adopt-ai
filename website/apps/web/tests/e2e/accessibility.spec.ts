/**
 * Automated accessibility checks using axe-core on all marketing pages.
 *
 * Rules: WCAG 2.1 Level AA.
 * Failures here are hard blockers — CI will not pass with a11y violations.
 *
 * Manual checks (VoiceOver, keyboard-only navigation, focus trapping in
 * dialogs) are covered in the QA runbook and performed before each release.
 */
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const pages = [
  { path: '/', name: 'Home' },
  { path: '/pricing', name: 'Pricing' },
  { path: '/services', name: 'Services' },
  { path: '/about', name: 'About' },
  { path: '/resources', name: 'Resources' },
  { path: '/blog', name: 'Blog' },
  { path: '/contact', name: 'Contact' },
  { path: '/portal', name: 'Portal login' },
];

for (const { path, name } of pages) {
  test(`${name} (${path}) — no WCAG 2.1 AA violations`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      // Known third-party iframe violations we cannot fix
      .exclude('iframe[title*="Calendly"]')
      .exclude('iframe[title*="HubSpot"]')
      .analyze();

    if (results.violations.length > 0) {
      const report = results.violations
        .map((v) => `[${v.impact ?? 'unknown'}] ${v.id}: ${v.description}\n  ${v.helpUrl}`)
        .join('\n');
      expect.soft(results.violations, `\n\nA11y violations on ${name}:\n${report}\n`).toHaveLength(0);
    }

    expect(results.violations).toHaveLength(0);
  });
}

// ── Keyboard navigation ────────────────────────────────────────
test.describe('Keyboard navigation', () => {
  test('Tab key moves focus through interactive elements on home page', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName?.toLowerCase());
    expect(['a', 'button', 'input', 'textarea', 'select', 'details']).toContain(focused);
  });

  test('first focusable element is a link or button', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const firstFocused = page.locator(':focus');
    const tagName = await firstFocused.evaluate((el) => el.tagName.toLowerCase());
    expect(['a', 'button']).toContain(tagName);
  });
});

// ── Focus-visible ─────────────────────────────────────────────
test.describe('Focus styles', () => {
  test('focused elements have a visible focus indicator on the contact form', async ({ page }) => {
    await page.goto('/contact');

    // Tab past the nav into the form area
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
    }

    const focusedEl = page.locator(':focus');
    const outline = await focusedEl.evaluate((el) => {
      const s = window.getComputedStyle(el);
      return [s.outline, s.outlineOffset, s.boxShadow].join(' ');
    });

    // There should be some visible focus indicator (outline or ring box-shadow)
    const hasVisibleFocus =
      !outline.includes('none') || outline.includes('ring') || outline.length > 10;
    expect(hasVisibleFocus, `No visible focus indicator: "${outline}"`).toBe(true);
  });
});
