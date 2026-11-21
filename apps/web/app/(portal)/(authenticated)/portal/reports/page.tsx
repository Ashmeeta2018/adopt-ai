'use client';

import { Eyebrow, GlassCard, Metric } from '@adopt-ai/ui-web';

import { trpc } from '@/lib/trpc/client';

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
        <div className="border-accent h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8">
      <div>
        <Eyebrow tone="cream">
          {data.range.start} — {data.range.end}
        </Eyebrow>
        <h1 className="font-display text-cream mt-2 text-3xl font-semibold">Weekly Report</h1>
      </div>

      {/* Hero metrics */}
      <div className="grid grid-cols-2 gap-6">
        <GlassCard variant="dark" className="relative overflow-hidden">
          <div className="bg-linear-to-br from-accent/20 via-void to-void absolute inset-0" />
          <div className="relative p-8">
            <Eyebrow tone="glow">Hours saved</Eyebrow>
            <Metric
              value={data.hoursSaved.toFixed(1)}
              label="hours reallocated this week"
              accent
              dark
            />
            <p className="text-cream/50 mt-2 font-mono text-xs">
              +{data.hoursSavedTrendPct}% vs last week
            </p>
          </div>
        </GlassCard>

        <GlassCard variant="dark" className="relative overflow-hidden">
          <div className="bg-linear-to-br from-glow/20 via-void to-void absolute inset-0" />
          <div className="relative p-8">
            <Eyebrow tone="glow">Cost reduced</Eyebrow>
            <Metric
              value={`$${data.costReducedUsd.toLocaleString()}`}
              label="estimated value recovered"
              accent
              dark
            />
            <p className="text-cream/50 mt-2 font-mono text-xs">
              +{data.costReducedTrendPct}% vs last week
            </p>
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
            const gradient =
              ACCENT_MAP[pipeline.accent as keyof typeof ACCENT_MAP] ?? ACCENT_MAP.accent!;

            return (
              <div
                key={pipeline.name}
                className="border-hairline-dark bg-cream/4 rounded-xl border px-6 py-4"
              >
                <div className="flex items-center justify-between">
                  <p className="font-display text-cream text-sm font-semibold">{pipeline.name}</p>
                  <div className="flex items-center gap-6">
                    <span className="text-cream font-mono text-sm">
                      {pipeline.hoursSaved.toFixed(1)}h
                    </span>
                    <span className="text-cream/40 font-mono text-xs">
                      {pipeline.tasks.toLocaleString()} tasks
                    </span>
                    <span className="text-cream/40 font-mono text-xs">
                      {(pipeline.successRate * 100).toFixed(1)}% success
                    </span>
                  </div>
                </div>
                <div className="bg-cream/10 mt-3 h-2 w-full overflow-hidden rounded-full">
                  <div
                    className={`bg-linear-to-r h-full rounded-full ${gradient} transition-all duration-500`}
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
        <button className="border-hairline-dark bg-cream/4 text-cream/60 hover:border-accent hover:text-accent rounded-lg border px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors">
          Export PDF
        </button>
        <button className="border-hairline-dark bg-cream/4 text-cream/60 hover:border-accent hover:text-accent rounded-lg border px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors">
          Share Report
        </button>
      </div>
    </div>
  );
}
