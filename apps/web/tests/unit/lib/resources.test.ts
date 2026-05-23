import { describe, expect, it } from 'vitest';

import {
  getAllResourceSummaries,
  getAllResources,
  getRelatedResources,
  getResource,
  typeAccentClass,
} from '@/lib/resources';
import type { ResourceType } from '@/lib/resources';

// ── getAllResources ────────────────────────────────────────────
describe('getAllResources', () => {
  it('returns all 10 seed resources', () => {
    expect(getAllResources()).toHaveLength(10);
  });

  it('returns resources sorted by date descending', () => {
    const resources = getAllResources();
    for (let i = 1; i < resources.length; i++) {
      const prev = new Date(resources[i - 1]!.date).getTime();
      const curr = new Date(resources[i]!.date).getTime();
      expect(prev).toBeGreaterThanOrEqual(curr);
    }
  });

  it('every resource has required frontmatter fields', () => {
    const validTypes: ResourceType[] = [
      'Whitepaper', 'Playbook', 'Template', 'Talk', 'Code', 'Guide',
    ];
    for (const r of getAllResources()) {
      expect(r.slug, `${r.slug} missing slug`).toBeTruthy();
      expect(r.title, `${r.slug} missing title`).toBeTruthy();
      expect(r.date, `${r.slug} missing date`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(validTypes, `${r.slug} has invalid type "${r.type}"`).toContain(r.type);
      expect(r.dek, `${r.slug} missing dek`).toBeTruthy();
      expect(r.format, `${r.slug} missing format`).toBeTruthy();
    }
  });

  it('every resource has non-empty MDX content', () => {
    for (const r of getAllResources()) {
      expect(r.content.trim().length, `${r.slug} has empty content`).toBeGreaterThan(200);
    }
  });

  it('exactly one resource is marked as featured', () => {
    const featured = getAllResources().filter((r) => r.featured);
    expect(featured).toHaveLength(1);
  });

  it('all six resource types are represented', () => {
    const types = new Set(getAllResources().map((r) => r.type));
    expect(types).toContain('Whitepaper');
    expect(types).toContain('Playbook');
    expect(types).toContain('Template');
    expect(types).toContain('Talk');
    expect(types).toContain('Code');
    expect(types).toContain('Guide');
  });
});

// ── getAllResourceSummaries ───────────────────────────────────
describe('getAllResourceSummaries', () => {
  it('returns the same count as getAllResources', () => {
    expect(getAllResourceSummaries()).toHaveLength(getAllResources().length);
  });

  it('does not include the raw MDX content', () => {
    for (const summary of getAllResourceSummaries()) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((summary as any).content).toBeUndefined();
    }
  });
});

// ── getResource ───────────────────────────────────────────────
describe('getResource', () => {
  it('returns the production-agent-playbook as the featured resource', () => {
    const r = getResource('production-agent-playbook');
    expect(r).toBeDefined();
    expect(r?.featured).toBe(true);
    expect(r?.type).toBe('Whitepaper');
  });

  it('returns undefined for an unknown slug', () => {
    expect(getResource('not-a-real-resource')).toBeUndefined();
  });

  it('all 10 slugs resolve', () => {
    const slugs = [
      'production-agent-playbook',
      'designing-human-review-layer',
      'discovery-script',
      'eval-suites',
      'buy-vs-build',
      'why-stopped-doing-pilots',
      'confidence-gated-router',
      'fine-tuning-for-tone',
      'owning-model-weights',
      'audit-log-guide',
    ];
    for (const slug of slugs) {
      expect(getResource(slug), `${slug} should resolve`).toBeDefined();
    }
  });

  it('code resource has externalUrl', () => {
    const r = getResource('confidence-gated-router');
    expect(r?.type).toBe('Code');
    expect(r?.externalUrl).toBeTruthy();
  });

  it('talk resource has externalUrl', () => {
    const r = getResource('why-stopped-doing-pilots');
    expect(r?.type).toBe('Talk');
    expect(r?.externalUrl).toBeTruthy();
  });

  it('whitepaper with download has downloadLabel and downloadUrl', () => {
    const r = getResource('production-agent-playbook');
    expect(r?.downloadLabel).toBeTruthy();
    expect(r?.downloadUrl).toBeTruthy();
  });

  it('includes raw MDX content', () => {
    const r = getResource('confidence-gated-router');
    expect(r?.content).toContain('confidence');
  });
});

// ── getRelatedResources ───────────────────────────────────────
describe('getRelatedResources', () => {
  it('excludes the current resource from related', () => {
    const related = getRelatedResources('production-agent-playbook', 3);
    expect(related.map((r) => r.slug)).not.toContain('production-agent-playbook');
  });

  it('respects the limit', () => {
    expect(getRelatedResources('production-agent-playbook', 2)).toHaveLength(2);
    expect(getRelatedResources('production-agent-playbook', 5)).toHaveLength(5);
  });

  it('never returns more than (total - 1) resources', () => {
    const total = getAllResources().length;
    const related = getRelatedResources('production-agent-playbook', 100);
    expect(related.length).toBeLessThanOrEqual(total - 1);
  });
});

// ── typeAccentClass ───────────────────────────────────────────
describe('typeAccentClass', () => {
  it('has an entry for every ResourceType', () => {
    const types: ResourceType[] = [
      'Whitepaper', 'Playbook', 'Template', 'Talk', 'Code', 'Guide',
    ];
    for (const t of types) {
      expect(typeAccentClass[t], `missing accent class for ${t}`).toBeTruthy();
    }
  });
});
