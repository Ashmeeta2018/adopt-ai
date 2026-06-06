import Link from 'next/link';

import type { ResourceSummary } from '@/lib/resources';
import { typeAccentClass } from '@/lib/resources';
import { cn } from '@adopt-ai/ui-web';

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
        <div className={cn('font-mono text-eyebrow uppercase tracking-[0.18em]', accentClass)}>
          {resource.type} · {resource.format}
        </div>
        <h3
          className="mt-2 font-display text-[18px] leading-snug tracking-[-0.015em]
                     transition-colors duration-150 group-hover:text-accent"
        >
          {resource.title}
        </h3>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <article className="rounded-3xl border border-hairline-dark bg-void p-12 text-cream">
        <div className="mb-5 font-mono text-eyebrow uppercase tracking-[0.18em] text-glow">
          Featured · {resource.type} · {resource.format}
        </div>
        <h2
          className="font-display"
          style={{ fontSize: 44, letterSpacing: '-0.035em', lineHeight: 1.05 }}
        >
          {resource.title}
        </h2>
        <p className="mt-6 max-w-[460px] text-[16px] leading-[1.55] text-cream/65">
          {resource.dek}
        </p>
        <div className="mt-10">
          <Link href={`/resources/${resource.slug}`}>
            <span
              className="inline-flex items-center gap-2 rounded-full bg-ember-cta px-[18px] py-[12px]
                         font-display text-[14px] font-medium tracking-tight text-[#FFF8F0]
                         shadow-cta transition-transform duration-150 hover:scale-[1.02]"
            >
              {resource.downloadLabel ?? (resource.externalLabel ?? 'Read the resource')} →
            </span>
          </Link>
        </div>
      </article>
    );
  }

  // Default grid card
  return (
    <article className="group relative flex min-h-[220px] flex-col rounded-2xl border border-hairline bg-paper p-6">
      <div className={cn('font-mono text-eyebrow uppercase tracking-[0.18em]', accentClass)}>
        {resource.type}
      </div>
      <h3
        className="mt-3 font-display text-[22px] leading-snug tracking-[-0.02em]
                   transition-colors duration-150 group-hover:text-accent"
      >
        {resource.title}
      </h3>
      <p className="mt-2 flex-1 text-[14px] leading-[1.5] text-ink/65">{resource.dek}</p>
      <div className="mt-5 flex items-center justify-between font-mono text-eyebrow uppercase tracking-[0.14em] text-ink/50">
        <span>{resource.format}</span>
        <Link
          href={`/resources/${resource.slug}`}
          className="text-accent transition-opacity duration-150 group-hover:opacity-100 opacity-70"
        >
          Read →
        </Link>
      </div>
    </article>
  );
}
