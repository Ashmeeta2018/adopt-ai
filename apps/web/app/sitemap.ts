import type { MetadataRoute } from 'next';

import { getAllPostSummaries } from '@/lib/blog';
import { getAllResourceSummaries } from '@/lib/resources';

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

/** Conversion and navigation priority levels */
const PRIORITY = {
  home:    1.0,
  convert: 0.9,  // /book, /pricing, /services
  hub:     0.8,  // /blog, /resources, /work
  static:  0.6,  // /about, /contact
  content: 0.7,  // individual posts, resources, case studies
} as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const posts     = getAllPostSummaries();
  const resources = getAllResourceSummaries();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,        priority: PRIORITY.home,    changeFrequency: 'monthly' },
    { url: `${BASE}/book`,    priority: PRIORITY.convert, changeFrequency: 'monthly' },
    { url: `${BASE}/pricing`, priority: PRIORITY.convert, changeFrequency: 'monthly' },
    { url: `${BASE}/services`,priority: PRIORITY.convert, changeFrequency: 'monthly' },
    { url: `${BASE}/work`,    priority: PRIORITY.hub,     changeFrequency: 'monthly' },
    { url: `${BASE}/blog`,    priority: PRIORITY.hub,     changeFrequency: 'weekly'  },
    { url: `${BASE}/resources`,priority: PRIORITY.hub,    changeFrequency: 'weekly'  },
    { url: `${BASE}/about`,   priority: PRIORITY.static,  changeFrequency: 'yearly'  },
    { url: `${BASE}/contact`, priority: PRIORITY.static,  changeFrequency: 'yearly'  },
    // Case studies — add a slug entry here whenever a new one is published.
    // TODO: move to filesystem loader (like blog/resources) when > 3 studies exist.
    { url: `${BASE}/work/apex-regional-logistics`, priority: PRIORITY.content, changeFrequency: 'yearly' },
  ];

  const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url:             `${BASE}/blog/${p.slug}`,
    lastModified:    new Date(p.date),
    priority:        PRIORITY.content,
    changeFrequency: 'monthly' as const,
  }));

  const resourceRoutes: MetadataRoute.Sitemap = resources.map((r) => ({
    url:             `${BASE}/resources/${r.slug}`,
    lastModified:    new Date(r.date),
    priority:        PRIORITY.content,
    changeFrequency: 'monthly' as const,
  }));

  return [...staticRoutes, ...blogRoutes, ...resourceRoutes];
}
