import { EmberText, Eyebrow, SiteFooter, SiteNav } from '@adopt-ai/ui-web';
import type { Metadata } from 'next';

import { ResourceCard } from '@/components/resources/ResourceCard';
import { getAllResourceSummaries } from '@/lib/resources';

export const metadata: Metadata = {
  title: 'Resources',
  description: 'Playbooks, whitepapers, and code we ship alongside our customers.',
};

export default function ResourcesPage() {
  const resources = getAllResourceSummaries();
  const featured = resources.find((r) => r.featured) ?? resources[0];
  const sidebar = resources.filter((r) => r.slug !== featured?.slug).slice(0, 3);
  const grid = resources.filter((r) => r.slug !== featured?.slug);

  return (
    <main className="bg-cream text-ink">
      <SiteNav current="resources" />

      <section className="px-14 pb-10 pt-24">
        <div className="mx-auto max-w-[1280px]">
          <Eyebrow className="mb-4">Resources · The playbook library</Eyebrow>
          <h1
            className="max-w-[1100px] font-display"
            style={{ fontSize: 80, letterSpacing: '-0.04em', lineHeight: 1 }}
          >
            Field notes on shipping{' '}
            <EmberText>production-grade agents</EmberText>.
          </h1>
        </div>
      </section>

      {/* Featured + sidebar row */}
      <section className="px-14 pb-16">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
          {featured && <ResourceCard resource={featured} variant="featured" />}
          <aside className="flex flex-col gap-4">
            {sidebar.map((r) => (
              <ResourceCard key={r.slug} resource={r} />
            ))}
          </aside>
        </div>
      </section>

      {/* Full library grid */}
      <section className="border-t border-hairline px-14 py-20">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-8 flex items-baseline justify-between">
            <Eyebrow>Library · {grid.length} entries</Eyebrow>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {grid.map((r) => (
              <ResourceCard key={r.slug} resource={r} />
            ))}
          </div>
        </div>
      </section>

      <SiteFooter dark={false} />
    </main>
  );
}
