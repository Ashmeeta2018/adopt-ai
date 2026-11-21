import { Eyebrow, Hairline } from '@adopt-ai/ui-web';

import { ResourceCard } from './ResourceCard';

import type { ResourceSummary } from '@/lib/resources';

interface RelatedResourcesProps {
  resources: ResourceSummary[];
}

export function RelatedResources({ resources }: RelatedResourcesProps) {
  if (resources.length === 0) return null;
  return (
    <aside>
      <Eyebrow className="mb-6">More resources</Eyebrow>
      <div className="divide-hairline flex flex-col divide-y">
        {resources.map((r, i) => (
          <div key={r.slug}>
            <ResourceCard resource={r} variant="compact" />
            {i < resources.length - 1 && <Hairline />}
          </div>
        ))}
      </div>
    </aside>
  );
}
