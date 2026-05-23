/**
 * Portal page loading skeleton.
 *
 * Shown inside PortalShell's content area while the incoming page loads.
 * The sidebar and header remain visible — only the page slot is replaced.
 * No 'use client' needed: this is a pure Server Component returning static markup.
 */

export default function PortalLoading() {
  return (
    <div className="animate-pulse space-y-8" aria-label="Loading" aria-busy>
      {/* Page title area */}
      <div className="space-y-2.5">
        <div className="h-3 w-20 rounded-full bg-ink/[0.07]" />
        <div className="h-8 w-52 rounded-lg bg-ink/[0.07]" />
      </div>

      {/* Metric card row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-ink/[0.07]" />
        ))}
      </div>

      {/* Content rows — mimics an agent list or alert list */}
      <div className="space-y-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 rounded-xl bg-ink/[0.07]" />
        ))}
      </div>
    </div>
  );
}
