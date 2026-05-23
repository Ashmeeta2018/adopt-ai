/**
 * Blog content loader.
 *
 * Reads MDX files from `content/blog/`, parses front-matter with gray-matter,
 * and returns typed post objects. Pure filesystem reads — no database, no CMS.
 *
 * Switch to a CMS adapter later by replacing the internals of `getAllPosts`
 * while keeping the exported types and function signatures stable.
 */

import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';

// ── Types ─────────────────────────────────────────────────────

export interface PostFrontmatter {
  title: string;
  /** ISO date string, e.g. "2026-05-18" */
  date: string;
  /** Display category, e.g. "Engineering" */
  category: string;
  /** Approximate read time in minutes */
  readMinutes: number;
  /** One-sentence summary shown in listings and OG descriptions */
  dek: string;
  /** When true, this post is shown as the featured post on the listing page */
  featured?: boolean;
}

export interface Post extends PostFrontmatter {
  /** Derived from the MDX filename (minus the .mdx extension) */
  slug: string;
  /** Raw MDX source (used by compileMDX on the server) */
  content: string;
}

/** Minimal shape used in listing pages and related-post widgets. */
export type PostSummary = Omit<Post, 'content'>;

// ── Helpers ───────────────────────────────────────────────────

const POSTS_DIR = path.join(process.cwd(), 'content', 'blog');

function parsePost(filename: string): Post {
  const slug = filename.replace(/\.mdx?$/, '');
  const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf8');
  const { data, content } = matter(raw);

  // Validate required fields at read time (catches broken frontmatter early).
  const fm = data as Partial<PostFrontmatter>;
  if (!fm.title) throw new Error(`Missing "title" in front-matter of ${filename}`);
  if (!fm.date) throw new Error(`Missing "date" in front-matter of ${filename}`);
  if (!fm.category) throw new Error(`Missing "category" in front-matter of ${filename}`);
  if (!fm.readMinutes) throw new Error(`Missing "readMinutes" in front-matter of ${filename}`);
  if (!fm.dek) throw new Error(`Missing "dek" in front-matter of ${filename}`);

  return {
    slug,
    content,
    title: fm.title,
    date: fm.date,
    category: fm.category,
    readMinutes: fm.readMinutes,
    dek: fm.dek,
    featured: fm.featured ?? false,
  };
}

// ── Public API ────────────────────────────────────────────────

/** Returns all posts sorted by date descending. */
export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .map(parsePost)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Returns all posts as summaries (no raw MDX content — smaller payload). */
export function getAllPostSummaries(): PostSummary[] {
  return getAllPosts().map(({ content: _content, ...summary }) => summary);
}

/** Returns a single post by slug, or undefined if not found. */
export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

/**
 * Returns up to `limit` posts that are NOT the given slug, in date order.
 * Used for "related posts" and "more in category" widgets.
 */
export function getRelatedPosts(currentSlug: string, limit = 3): PostSummary[] {
  return getAllPostSummaries()
    .filter((p) => p.slug !== currentSlug)
    .slice(0, limit);
}

/** Formats a date string for display, e.g. "May 18, 2026". */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
