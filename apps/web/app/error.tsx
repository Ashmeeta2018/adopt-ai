'use client';

/**
 * Route-level error boundary.
 * Fires when a Server Component inside app/layout.tsx's children throws.
 * The root layout is still alive, so Tailwind, font variables, and ui-web
 * components all work normally here.
 */

import Link from 'next/link';
import { useEffect } from 'react';

import { Button } from '@adopt-ai/ui-web';

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <p className="font-mono text-eyebrow uppercase tracking-[0.18em] text-accent">
        Something went wrong
      </p>
      <h1 className="mt-4 max-w-[520px] font-display text-[52px] font-medium leading-[1.04] tracking-[-0.035em] text-ink">
        This page ran into a problem.
      </h1>
      <p className="mt-5 max-w-[400px] text-[17px] leading-[1.55] text-ink/60">
        The error has been logged. Try again — if it keeps happening,{' '}
        <Link href="/contact" className="underline decoration-dotted hover:text-accent">
          let us know
        </Link>
        .
      </p>
      {error.digest && (
        <p className="mt-3 font-mono text-[11px] text-ink/30">ref: {error.digest}</p>
      )}
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button variant="primary" onClick={reset}>
          Try again
        </Button>
        <Link href="/">
          <Button variant="ghost" trailingIcon={null}>← Home</Button>
        </Link>
      </div>
    </div>
  );
}
