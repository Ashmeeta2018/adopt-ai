'use client';

import { trpc } from '@/lib/trpc/client';
import { Eyebrow, GlassCard, Metric } from '@adopt-ai/ui-web';

const ACCENT_MAP: Record<string, string> = {
  accent: 'from-accent/80 to-accent/40',
  glow: 'from-glow/80 to-glow/40',
  amber: 'from-amber/80 to-amber/40',
};

export default function ReportsPage() {
  const { data, isLoading } = trpc.portal.getWeeklyReport.useQuery({});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8">
      <div>
        <Eyebrow tone="cream">{data.range.start} — {data.range.end}</Eyebrow>
        <h1 className="mt-2 font-display text-3xl font-semibold text-cream">Weekly Report</h1>
      </div>

      {/* Hero metrics */}
      <div className="grid grid-cols-2 gap-6">
        <GlassCard variant="dark" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-void to-void" />
          <div className="relative p-8">
            <Eyebrow tone="glow">Hours saved</Eyebrow>
            <Metric value={data.hoursSaved.toFixed(1)} label="hours reallocated this week" accent dark />
            <p className="mt-2 font-mono text-xs text-cream/50">+{data.hoursSavedTrendPct}% vs last week</p>
          </div>
        </GlassCard>

        <GlassCard variant="dark" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-glow/20 via-void to-void" />
          <div className="relative p-8">
            <Eyebrow tone="glow">Cost reduced</Eyebrow>
            <Metric value={`$${data.costReducedUsd.toLocaleString()}`} label="estimated value recovered" accent dark />
            <p className="mt-2 font-mono text-xs text-cream/50">+{data.costReducedTrendPct}% vs last week</p>
          </div>
        </GlassCard>
      </div>

      {/* Pipeline breakdown */}
      <div>
        <Eyebrow tone="cream">Pipeline breakdown</Eyebrow>
        <div className="mt-4 space-y-3">
          {data.pipelines.map((pipeline) => {
            const maxHours = Math.max(...data.pipelines.map((p) => p.hoursSaved));
            const widthPct = maxHours > 0 ? (pipeline.hoursSaved / maxHours) * 100 : 0;
            const gradient = ACCENT_MAP[pipeline.accent as keyof typeof ACCENT_MAP] ?? ACCENT_MAP['accent']!;

            return (
              <div key={pipeline.name} className="rounded-xl border border-hairline-dark bg-cream/[0.04] px-6 py-4">
                <div className="flex items-center justify-between">
                  <p className="font-display text-sm font-semibold text-cream">{pipeline.name}</p>
                  <div className="flex items-center gap-6">
                    <span className="font-mono text-sm text-cream">{pipeline.hoursSaved.toFixed(1)}h</span>
                    <span className="font-mono text-xs text-cream/40">{pipeline.tasks.toLocaleString()} tasks</span>
                    <span className="font-mono text-xs text-cream/40">
                      {(pipeline.successRate * 100).toFixed(1)}% success
                    </span>
                  </div>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-cream/10">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-500`}
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Export actions */}
      <div className="flex gap-3">
        <button className="rounded-lg border border-hairline-dark bg-cream/[0.04] px-4 py-2 font-mono text-xs uppercase tracking-wider text-cream/60 transition-colors hover:border-accent hover:text-accent">
          Export PDF
        </button>
        <button className="rounded-lg border border-hairline-dark bg-cream/[0.04] px-4 py-2 font-mono text-xs uppercase tracking-wider text-cream/60 transition-colors hover:border-accent hover:text-accent">
          Share Report
        </button>
      </div>
    </div>
  );
}
