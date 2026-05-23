'use client';

/**
 * Global error boundary — fires when app/layout.tsx itself crashes.
 * At this point the root layout is gone: no Tailwind, no CSS variables,
 * no font files. Every style here is inline. Must supply its own <html>/<body>.
 */

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[global-error boundary]', error);
  }, [error]);

  return (
    <html lang="en">
      <body style={S.body}>
        <p style={S.eyebrow}>Something went wrong</p>
        <h1 style={S.heading}>The app ran into a problem.</h1>
        <p style={S.body_text}>
          Try refreshing. If it keeps happening, email us at{' '}
          <a href="mailto:hello@adoptai.com" style={S.link}>
            hello@adoptai.com
          </a>
          .
        </p>
        {error.digest && (
          <p style={S.digest}>ref: {error.digest}</p>
        )}
        <div style={S.actions}>
          <button onClick={reset} style={S.primaryBtn}>Try again →</button>
          <a href="/" style={S.ghostBtn}>← Home</a>
        </div>
      </body>
    </html>
  );
}

// Inline style tokens — mirrors packages/tokens values without importing them.
const S = {
  body: {
    margin: 0,
    fontFamily: 'system-ui, sans-serif',
    background: '#F8F4EE',
    color: '#3D1A0F',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    minHeight: '100dvh',
    textAlign: 'center' as const,
    padding: '40px 24px',
    boxSizing: 'border-box' as const,
  },
  eyebrow: {
    margin: '0 0 16px',
    fontFamily: 'monospace',
    fontSize: 12,
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const,
    color: '#D9462C',
  },
  heading: {
    margin: 0,
    fontSize: 'clamp(36px, 6vw, 52px)',
    fontWeight: 500,
    letterSpacing: '-0.035em',
    lineHeight: 1.05,
    maxWidth: 520,
  },
  body_text: { marginTop: 20, fontSize: 17, lineHeight: 1.55, color: 'rgba(61,26,15,0.60)', maxWidth: 400 },
  link:      { color: '#D9462C', textDecoration: 'none' as const },
  digest:    { marginTop: 12, fontFamily: 'monospace', fontSize: 11, color: 'rgba(61,26,15,0.28)' },
  actions:   { marginTop: 40, display: 'flex' as const, gap: 12, flexWrap: 'wrap' as const, justifyContent: 'center' as const },
  primaryBtn: {
    padding: '12px 24px',
    borderRadius: 9999,
    background: 'linear-gradient(120deg, #A82A28, #D9462C 45%, #E67E22)',
    color: '#FFF8F0',
    fontSize: 14,
    fontWeight: 500,
    border: 'none',
    cursor: 'pointer' as const,
  },
  ghostBtn: {
    padding: '12px 24px',
    borderRadius: 9999,
    border: '1px solid rgba(61,26,15,0.12)',
    color: '#3D1A0F',
    textDecoration: 'none' as const,
    fontSize: 14,
    display: 'inline-flex' as const,
    alignItems: 'center' as const,
  },
} satisfies Record<string, React.CSSProperties>;
