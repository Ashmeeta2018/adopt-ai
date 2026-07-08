import { cn } from '@adopt-ai/ui-web';
import Link from 'next/link';

import type { ResourceSummary } from '@/lib/resources';

import { typeAccentClass } from '@/lib/resources';

interface ResourceCardProps {
  resource: ResourceSummary;
  /** 'default' shows the full card. 'compact' is for sidebar lists. */
  variant?: 'default' | 'compact' | 'featured';
}

export function ResourceCard({ resource, variant = 'default' }: ResourceCardProps) {
  const accentClass = typeAccentClass[resource.type];

  if (variant === 'compact') {
    return (
      <Link href={`/resources/${resource.slug}`} className="group block py-4">
        <div className={cn('text-eyebrow font-mono uppercase tracking-[0.18em]', accentClass)}>
          {resource.type} · {resource.format}
        </div>
        <h3 className="font-display group-hover:text-accent mt-2 text-[18px] leading-snug tracking-[-0.015em] transition-colors duration-150">
          {resource.title}
        </h3>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <article className="border-hairline-dark bg-void text-cream rounded-3xl border p-12">
        <div className="text-eyebrow text-glow mb-5 font-mono uppercase tracking-[0.18em]">
          Featured · {resource.type} · {resource.format}
        </div>
        <h2
          className="font-display"
          style={{ fontSize: 44, letterSpacing: '-0.035em', lineHeight: 1.05 }}
        >
          {resource.title}
        </h2>
        <p className="text-cream/65 mt-6 max-w-[460px] text-[16px] leading-[1.55]">
          {resource.dek}
        </p>
        <div className="mt-10">
          <Link href={`/resources/${resource.slug}`}>
            <span className="bg-ember-cta font-display shadow-cta inline-flex items-center gap-2 rounded-full px-[18px] py-[12px] text-[14px] font-medium tracking-tight text-[#FFF8F0] transition-transform duration-150 hover:scale-[1.02]">
              {resource.downloadLabel ?? resource.externalLabel ?? 'Read the resource'} →
            </span>
          </Link>
        </div>
      </article>
    );
  }

  // Default grid card
  return (
    <article className="border-hairline bg-paper group relative flex min-h-[220px] flex-col rounded-2xl border p-6">
      <div className={cn('text-eyebrow font-mono uppercase tracking-[0.18em]', accentClass)}>
        {resource.type}
      </div>
      <h3 className="font-display group-hover:text-accent mt-3 text-[22px] leading-snug tracking-[-0.02em] transition-colors duration-150">
        {resource.title}
      </h3>
      <p className="text-ink/65 mt-2 flex-1 text-[14px] leading-normal">{resource.dek}</p>
      <div className="text-eyebrow text-ink/50 mt-5 flex items-center justify-between font-mono uppercase tracking-[0.14em]">
        <span>{resource.format}</span>
        <Link
          href={`/resources/${resource.slug}`}
          className="text-accent opacity-70 transition-opacity duration-150 group-hover:opacity-100"
        >
          Read →
        </Link>
      </div>
    </article>
  );
}
