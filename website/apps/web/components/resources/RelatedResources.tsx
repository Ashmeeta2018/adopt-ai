import { Eyebrow, Hairline } from '@adopt-ai/ui-web';

import type { ResourceSummary } from '@/lib/resources';
import { ResourceCard } from './ResourceCard';

interface RelatedResourcesProps {
  resources: ResourceSummary[];
}

export function RelatedResources({ resources }: RelatedResourcesProps) {
  if (resources.length === 0) return null;
  return (
    <aside>
      <Eyebrow className="mb-6">More resources</Eyebrow>
      <div className="flex flex-col divide-y divide-hairline">
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
