/**
 * Unit tests for the blog content loader (lib/blog.ts).
 *
 * These run entirely in the Vitest Node environment — no DOM, no Next.js,
 * just the filesystem. They exercise every exported function and act as a
 * regression guard for the MDX frontmatter contract.
 */
import { describe, expect, it } from 'vitest';

import {
  formatDate,
  getAllPostSummaries,
  getAllPosts,
  getPost,
  getRelatedPosts,
} from '@/lib/blog';

// ── getAllPosts ────────────────────────────────────────────────
describe('getAllPosts', () => {
  it('returns all 6 seed posts', () => {
    const posts = getAllPosts();
    expect(posts).toHaveLength(6);
  });

  it('returns posts sorted by date descending (newest first)', () => {
    const posts = getAllPosts();
    for (let i = 1; i < posts.length; i++) {
      const prev = new Date(posts[i - 1]!.date).getTime();
      const curr = new Date(posts[i]!.date).getTime();
      expect(prev).toBeGreaterThanOrEqual(curr);
    }
  });

  it('every post has required frontmatter fields', () => {
    for (const post of getAllPosts()) {
      expect(post.slug, `${post.slug} missing slug`).toBeTruthy();
      expect(post.title, `${post.slug} missing title`).toBeTruthy();
      expect(post.date, `${post.slug} missing date`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(post.category, `${post.slug} missing category`).toBeTruthy();
      expect(post.readMinutes, `${post.slug} missing readMinutes`).toBeGreaterThan(0);
      expect(post.dek, `${post.slug} missing dek`).toBeTruthy();
    }
  });

  it('every post has non-empty MDX content', () => {
    for (const post of getAllPosts()) {
      expect(post.content.trim().length, `${post.slug} has empty content`).toBeGreaterThan(100);
    }
  });

  it('exactly one post is marked as featured', () => {
    const featured = getAllPosts().filter((p) => p.featured);
    expect(featured).toHaveLength(1);
  });
});

// ── getAllPostSummaries ───────────────────────────────────────
describe('getAllPostSummaries', () => {
  it('returns the same count as getAllPosts', () => {
    expect(getAllPostSummaries()).toHaveLength(getAllPosts().length);
  });

  it('does not include the raw MDX content field', () => {
    for (const summary of getAllPostSummaries()) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((summary as any).content).toBeUndefined();
    }
  });
});

// ── getPost ───────────────────────────────────────────────────
describe('getPost', () => {
  it('returns the confidence-gating post by slug', () => {
    const post = getPost('confidence-gating');
    expect(post).toBeDefined();
    expect(post?.slug).toBe('confidence-gating');
    expect(post?.featured).toBe(true);
  });

  it('returns undefined for an unknown slug', () => {
    expect(getPost('not-a-real-slug')).toBeUndefined();
  });

  it('includes raw MDX content', () => {
    const post = getPost('confidence-gating');
    expect(post?.content).toContain('confidence');
  });

  it('all 6 slugs resolve', () => {
    const slugs = [
      'confidence-gating',
      'scoping-sprint',
      'apex-logistics-six-weeks',
      'on-call-rotation',
      'operate-fees',
      'boring-half-of-agent-production',
    ];
    for (const slug of slugs) {
      expect(getPost(slug), `${slug} should resolve`).toBeDefined();
    }
  });
});

// ── getRelatedPosts ───────────────────────────────────────────
describe('getRelatedPosts', () => {
  it('excludes the current post from related', () => {
    const related = getRelatedPosts('confidence-gating', 3);
    expect(related.map((p) => p.slug)).not.toContain('confidence-gating');
  });

  it('respects the limit parameter', () => {
    expect(getRelatedPosts('confidence-gating', 2)).toHaveLength(2);
    expect(getRelatedPosts('confidence-gating', 5)).toHaveLength(5);
  });

  it('returns at most (total - 1) posts', () => {
    const all = getAllPosts().length;
    const related = getRelatedPosts('confidence-gating', 100);
    expect(related.length).toBeLessThanOrEqual(all - 1);
  });
});

// ── formatDate ────────────────────────────────────────────────
describe('formatDate', () => {
  it('formats an ISO date as human-readable US English', () => {
    expect(formatDate('2026-05-18')).toBe('May 18, 2026');
  });

  it('handles single-digit days without zero-padding', () => {
    expect(formatDate('2026-04-07')).toBe('April 7, 2026');
  });
});
