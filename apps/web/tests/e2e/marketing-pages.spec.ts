/**
 * E2E smoke tests for all Adopt AI marketing pages.
 *
 * Strategy: each test checks the most observable, stable signals on each page —
 * the page title, a landmark heading, and that the page is not a 404.
 * Detailed interaction tests (form submission, navigation clicks) live in
 * contact.spec.ts and navigation.spec.ts.
 */
import { type Page, expect, test } from '@playwright/test';

// ── Helpers ────────────────────────────────────────────────────

async function loadPage(page: Page, path: string) {
  const response = await page.goto(path);
  expect(response?.status(), `${path} should return 2xx`).toBeLessThan(400);
  return response;
}

// ── Home page ──────────────────────────────────────────────────
test.describe('Home page (/)', () => {
  test('returns 200 and sets the correct title', async ({ page }) => {
    await loadPage(page, '/');
    await expect(page).toHaveTitle(/Real automation.*Real SMB budgets|Adopt AI/i);
  });

  test('shows the hero headline', async ({ page }) => {
    await loadPage(page, '/');
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/automation|AI/i);
  });

  test('shows the primary CTA button', async ({ page }) => {
    await loadPage(page, '/');
    const cta = page.getByRole('button', { name: /start a project/i })
      .or(page.getByRole('link', { name: /start a project|book a call/i }))
      .first();
    await expect(cta).toBeVisible();
  });

  test('shows the agent status pills', async ({ page }) => {
    await loadPage(page, '/');
    await expect(page.locator('text=6 SMB teams live')).toBeVisible();
    await expect(page.locator('text=$0 per-seat fees')).toBeVisible();
  });

  test('shows the services bento section', async ({ page }) => {
    await loadPage(page, '/');
    await expect(page.locator('text=What we build').or(page.locator('text=Five workflows'))).toBeVisible();
  });

  test('shows the case study section', async ({ page }) => {
    await loadPage(page, '/');
    await expect(page.locator('text=Apex Regional').first()).toBeVisible();
  });

  test('shows the FAQ section', async ({ page }) => {
    await loadPage(page, '/');
    await expect(page.locator('text=Honest answers').or(page.locator('text=FAQ'))).toBeVisible();
  });

  test('renders the site footer', async ({ page }) => {
    await loadPage(page, '/');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText(/Adopt AI/i);
  });

  test('has no broken images (all img load)', async ({ page }) => {
    await loadPage(page, '/');
    // Give images time to load
    await page.waitForLoadState('networkidle');
    const brokenImages = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.src);
    });
    expect(brokenImages, `Broken images: ${brokenImages.join(', ')}`).toHaveLength(0);
  });
});

// ── Pricing ────────────────────────────────────────────────────
test.describe('Pricing page (/pricing)', () => {
  test('returns 200 with the pricing title', async ({ page }) => {
    await loadPage(page, '/pricing');
    await expect(page).toHaveTitle(/Pricing.*Adopt AI/i);
  });

  test('shows the three pricing tiers', async ({ page }) => {
    await loadPage(page, '/pricing');
    await expect(page.locator('text=Spark')).toBeVisible();
    await expect(page.locator('text=Lift')).toBeVisible();
    await expect(page.locator('text=Scale')).toBeVisible();
  });

  test('shows pricing amounts', async ({ page }) => {
    await loadPage(page, '/pricing');
    await expect(page.locator('text=$2,400').first()).toBeVisible();
    await expect(page.locator('text=$5,800').first()).toBeVisible();
  });

  test('shows the most-chosen flag on Lift', async ({ page }) => {
    await loadPage(page, '/pricing');
    await expect(page.locator('text=Most chosen')).toBeVisible();
  });

  test('shows the payback headline', async ({ page }) => {
    await loadPage(page, '/pricing');
    await expect(page.locator('text=eight weeks').or(page.locator('text=8 weeks'))).toBeVisible();
  });
});

// ── Services ───────────────────────────────────────────────────
test.describe('Services page (/services)', () => {
  test('returns 200 with the services title', async ({ page }) => {
    await loadPage(page, '/services');
    await expect(page).toHaveTitle(/Services.*Adopt AI/i);
  });

  test('shows all five service rows', async ({ page }) => {
    await loadPage(page, '/services');
    for (const label of ['Workflow Agents', 'Document & Invoice', 'Support Router', 'Fine-tuning', 'Operations']) {
      await expect(page.locator(`text=${label}`).first(), `${label} should be visible`).toBeVisible();
    }
  });

  test('shows "stays on the pager" in the hero', async ({ page }) => {
    await loadPage(page, '/services');
    await expect(page.locator('text=stays on the pager').first()).toBeVisible();
  });
});

// ── Case study ─────────────────────────────────────────────────
test.describe('Case study (/work/apex-regional-logistics)', () => {
  test('returns 200', async ({ page }) => {
    await loadPage(page, '/work/apex-regional-logistics');
    await expect(page).toHaveTitle(/case study.*Adopt AI/i);
  });

  test('shows Apex Regional in the hero', async ({ page }) => {
    await loadPage(page, '/work/apex-regional-logistics');
    await expect(page.locator('text=Apex Regional').first()).toBeVisible();
  });

  test('shows the pull quote', async ({ page }) => {
    await loadPage(page, '/work/apex-regional-logistics');
    await expect(
      page.locator('text=Tuesday back').or(page.locator('blockquote')).first(),
    ).toBeVisible();
  });

  test('shows the math table with net return', async ({ page }) => {
    await loadPage(page, '/work/apex-regional-logistics');
    await expect(page.locator('text=$4,694').or(page.locator('text=+$4,694'))).toBeVisible();
  });

  test('404s for an unknown case study slug', async ({ page }) => {
    const response = await page.goto('/work/nonexistent-company');
    // Next.js notFound() returns 404
    expect(response?.status()).toBe(404);
  });
});

// ── About ──────────────────────────────────────────────────────
test.describe('About page (/about)', () => {
  test('returns 200', async ({ page }) => {
    await loadPage(page, '/about');
    await expect(page).toHaveTitle(/About.*Adopt AI/i);
  });

  test('shows the "five principles" section', async ({ page }) => {
    await loadPage(page, '/about');
    await expect(
      page.locator('text=Five principles').or(page.locator('text=No pilots')),
    ).toBeVisible();
  });

  test('shows the right-fit vs not-a-fit comparison', async ({ page }) => {
    await loadPage(page, '/about');
    await expect(page.locator('text=Right fit').or(page.locator('text=When we say yes'))).toBeVisible();
    await expect(page.locator('text=Not a fit').or(page.locator('text=When we tell you no'))).toBeVisible();
  });
});

// ── Resources ──────────────────────────────────────────────────
test.describe('Resources page (/resources)', () => {
  test('returns 200', async ({ page }) => {
    await loadPage(page, '/resources');
    await expect(page).toHaveTitle(/Resources.*Adopt AI/i);
  });

  test('shows the featured whitepaper', async ({ page }) => {
    await loadPage(page, '/resources');
    await expect(page.locator('text=Production Agent Playbook')).toBeVisible();
  });

  test('shows a download CTA', async ({ page }) => {
    await loadPage(page, '/resources');
    await expect(page.getByRole('button', { name: /download/i })).toBeVisible();
  });
});

// ── Blog ───────────────────────────────────────────────────────
test.describe('Blog page (/blog)', () => {
  test('returns 200', async ({ page }) => {
    await loadPage(page, '/blog');
    await expect(page).toHaveTitle(/Blog.*Adopt AI/i);
  });

  test('shows the featured post headline', async ({ page }) => {
    await loadPage(page, '/blog');
    await expect(page.locator('text=Field notes').first()).toBeVisible();
  });

  test('shows a "Recent" section', async ({ page }) => {
    await loadPage(page, '/blog');
    await expect(page.locator('text=Recent')).toBeVisible();
  });
});

// ── Contact ────────────────────────────────────────────────────
test.describe('Contact page (/contact)', () => {
  test('returns 200', async ({ page }) => {
    await loadPage(page, '/contact');
    await expect(page).toHaveTitle(/Contact.*Adopt AI/i);
  });

  test('shows the contact form', async ({ page }) => {
    await loadPage(page, '/contact');
    await expect(page.getByRole('textbox', { name: /name/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
  });

  test('shows the contact info', async ({ page }) => {
    await loadPage(page, '/contact');
    await expect(page.locator('text=hello@adoptai.com')).toBeVisible();
  });
});

// ── 404 ────────────────────────────────────────────────────────
test.describe('404 page', () => {
  test('returns 404 for unknown route', async ({ page }) => {
    const response = await page.goto('/this-route-definitely-does-not-exist');
    expect(response?.status()).toBe(404);
  });

  test('shows the branded 404 content', async ({ page }) => {
    await page.goto('/this-route-definitely-does-not-exist');
    await expect(page.locator('text=Lost the trail').or(page.locator('text=not found'))).toBeVisible();
  });

  test('shows a home link on the 404 page', async ({ page }) => {
    await page.goto('/this-route-definitely-does-not-exist');
    await expect(
      page.getByRole('link', { name: /home/i }).or(page.getByRole('button', { name: /home/i })),
    ).toBeVisible();
  });
});
