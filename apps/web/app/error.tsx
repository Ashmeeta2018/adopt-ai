'use client';

/**
 * Route-level error boundary.
 * Fires when a Server Component inside app/layout.tsx's children throws.
 * The root layout is still alive, so Tailwind, font variables, and ui-web
 * components all work normally here.
 */

import { Button } from '@adopt-ai/ui-web';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO: replace with captureException(error) once Sentry is wired.
    console.error('[error boundary]', error);
  }, [error]);

  return (
    <div className="bg-cream flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-eyebrow text-accent font-mono uppercase tracking-[0.18em]">
        Something went wrong
      </p>
      <h1 className="font-display text-ink mt-4 max-w-[520px] text-[52px] font-medium leading-[1.04] tracking-[-0.035em]">
        This page ran into a problem.
      </h1>
      <p className="text-ink/60 mt-5 max-w-[400px] text-[17px] leading-[1.55]">
        The error has been logged. Try again — if it keeps happening,{' '}
        <Link href="/contact" className="hover:text-accent underline decoration-dotted">
          let us know
        </Link>
        .
      </p>
      {error.digest && (
        <p className="text-ink/30 mt-3 font-mono text-[11px]">ref: {error.digest}</p>
      )}
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button variant="primary" onClick={reset}>
          Try again
        </Button>
        <Link href="/">
          <Button variant="ghost" trailingIcon={null}>
            ← Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
