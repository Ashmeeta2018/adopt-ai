import Link from 'next/link';

import type { ResourceFrontmatter } from '@/lib/resources';
import { Button } from '@adopt-ai/ui-web';

interface ResourceCtaProps
  extends Pick<
    ResourceFrontmatter,
    'type' | 'downloadLabel' | 'downloadUrl' | 'externalLabel' | 'externalUrl'
  > {
  /** When true, renders in a vertical stack layout (sidebar). Default: horizontal. */
  stack?: boolean;
}

/**
 * Type-aware CTA block for a resource.
 *
 * Priority:
 *   1. Download (PDF / xlsx) — primary button when present
 *   2. External link (GitHub / video) — primary button when download absent, secondary otherwise
 *   3. Default "Read" — used when neither download nor external link is set
 */
export function ResourceCta({
  type,
  downloadLabel,
  downloadUrl,
  externalLabel,
  externalUrl,
  stack = false,
}: ResourceCtaProps) {
  const hasDownload = !!(downloadLabel && downloadUrl);
  const hasExternal = !!(externalLabel && externalUrl);

  const wrapperClass = stack
    ? 'flex flex-col gap-3'
    : 'flex flex-wrap items-center gap-3';

  if (!hasDownload && !hasExternal) {
    // Pure prose resource — no special CTA, just start reading
    return (
      <div className={wrapperClass}>
        <Link href="/book">
          <Button variant="primary">Discuss this with us</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      {hasDownload && (
        <a href={downloadUrl} download>
          <Button variant="primary">{downloadLabel}</Button>
        </a>
      )}
      {hasExternal && (
        <a href={externalUrl} target="_blank" rel="noopener noreferrer">
          <Button variant={hasDownload ? 'ghost' : 'primary'}>
            {externalLabel} ↗
          </Button>
        </a>
      )}
      {/* Always offer a contact fallback for non-download types */}
      {type === 'Talk' && !hasDownload && (
        <Link href="/book">
          <Button variant="ghost">Ask a question</Button>
        </Link>
      )}
    </div>
  );
}
