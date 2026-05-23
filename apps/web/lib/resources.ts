/**
 * Resources content loader.
 *
 * Reads MDX files from `content/resources/`, parses front-matter,
 * and returns typed resource objects.
 *
 * Resources differ from blog posts in several ways:
 *   - They have a `type` that drives the CTA (download, external link, or read).
 *   - Some link externally (Code → GitHub, Talk → video).
 *   - They may have `pages`, `duration`, or `format` metadata instead of `readMinutes`.
 *
 * Swap the internals for a CMS adapter later while keeping the exported types stable.
 */

import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';

// ── Types ─────────────────────────────────────────────────────

export type ResourceType = 'Whitepaper' | 'Playbook' | 'Template' | 'Talk' | 'Code' | 'Guide';

export interface ResourceFrontmatter {
  title: string;
  /** ISO date string, e.g. "2026-05-01" */
  date: string;
  /** Format classification — drives the CTA and listing badge. */
  type: ResourceType;
  /** One-sentence summary shown in listings and OG descriptions. */
  dek: string;
  /**
   * Human-readable format metadata for the listing card.
   * Examples: "28 pages", "22 min", "xlsx", "Repo"
   */
  format: string;
  /** When true, this resource is shown in the featured position. */
  featured?: boolean;
  /**
   * Label and URL for a primary download CTA (PDFs, spreadsheets).
   * When present, the detail page shows a prominent download button.
   */
  downloadLabel?: string;
  downloadUrl?: string;
  /**
   * Label and URL for an external link (GitHub repos, video recordings).
   * When present alongside downloadUrl, rendered as a secondary CTA.
   */
  externalLabel?: string;
  externalUrl?: string;
}

export interface Resource extends ResourceFrontmatter {
  slug: string;
  content: string; // raw MDX source
}

export type ResourceSummary = Omit<Resource, 'content'>;

// ── Helpers ───────────────────────────────────────────────────

const RESOURCES_DIR = path.join(process.cwd(), 'content', 'resources');

function parseResource(filename: string): Resource {
  const slug = filename.replace(/\.mdx?$/, '');
  const raw = fs.readFileSync(path.join(RESOURCES_DIR, filename), 'utf8');
  const { data, content } = matter(raw);

  const fm = data as Partial<ResourceFrontmatter>;
  if (!fm.title) throw new Error(`Missing "title" in front-matter of ${filename}`);
  if (!fm.date) throw new Error(`Missing "date" in front-matter of ${filename}`);
  if (!fm.type) throw new Error(`Missing "type" in front-matter of ${filename}`);
  if (!fm.dek) throw new Error(`Missing "dek" in front-matter of ${filename}`);
  if (!fm.format) throw new Error(`Missing "format" in front-matter of ${filename}`);

  return {
    slug,
    content,
    title: fm.title,
    date: fm.date,
    type: fm.type,
    dek: fm.dek,
    format: fm.format,
    featured: fm.featured ?? false,
    downloadLabel: fm.downloadLabel,
    downloadUrl: fm.downloadUrl,
    externalLabel: fm.externalLabel,
    externalUrl: fm.externalUrl,
  };
}

// ── Public API ────────────────────────────────────────────────

/** Returns all resources sorted by date descending. */
export function getAllResources(): Resource[] {
  if (!fs.existsSync(RESOURCES_DIR)) return [];
  return fs
    .readdirSync(RESOURCES_DIR)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .map(parseResource)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Returns all resources as summaries (no raw MDX content). */
export function getAllResourceSummaries(): ResourceSummary[] {
  return getAllResources().map(({ content: _c, ...rest }) => rest);
}

/** Returns a single resource by slug, or undefined if not found. */
export function getResource(slug: string): Resource | undefined {
  return getAllResources().find((r) => r.slug === slug);
}

/**
 * Returns up to `limit` resources NOT matching the current slug, in date order.
 * Used for "More resources" sidebar widgets.
 */
export function getRelatedResources(currentSlug: string, limit = 3): ResourceSummary[] {
  return getAllResourceSummaries()
    .filter((r) => r.slug !== currentSlug)
    .slice(0, limit);
}

/** Colour accent class for each resource type — used on badges. */
export const typeAccentClass: Record<ResourceType, string> = {
  Whitepaper: 'text-accent',
  Playbook: 'text-glow',
  Template: 'text-amber',
  Talk: 'text-accent',
  Code: 'text-glow',
  Guide: 'text-accent',
} as const;

/** Background colour class for the featured card header per type. */
export const typeHeaderBg: Record<ResourceType, string> = {
  Whitepaper: 'bg-void',
  Playbook: 'bg-ink',
  Template: 'bg-obsidian',
  Talk: 'bg-void',
  Code: 'bg-ink',
  Guide: 'bg-obsidian',
} as const;
