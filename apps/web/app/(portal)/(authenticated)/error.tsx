'use client';

/**
 * Portal-scoped error boundary.
 * Fires when a portal page throws. The authenticated layout (PortalShell
 * with sidebar) is still alive, so Tailwind and ui-web components work.
 *
 * Escape hatch links to /portal (login) rather than / (marketing home)
 * so authenticated users land in a context they recognise.
 */

import { Button } from '@adopt-ai/ui-web';
import Link from 'next/link';
import { useEffect } from 'react';

export default function PortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[portal error boundary]', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <p className="text-eyebrow text-accent font-mono uppercase tracking-[0.18em]">
        Something went wrong
      </p>
      <h1 className="font-display text-ink mt-4 max-w-[480px] text-[40px] font-medium leading-[1.05] tracking-[-0.03em]">
        This page ran into a problem.
      </h1>
      <p className="text-ink/60 mt-4 max-w-[380px] text-[15px] leading-[1.55]">
        The error has been logged. Try again, or return to the portal home.
      </p>
      {error.digest && (
        <p className="text-ink/30 mt-3 font-mono text-[11px]">ref: {error.digest}</p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button variant="primary" onClick={reset}>
          Try again
        </Button>
        <Link href="/portal/dashboard">
          <Button variant="ghost" trailingIcon={null}>
            ← Portal
          </Button>
        </Link>
      </div>
    </div>
  );
}
