'use client';

import { Eyebrow, GlassCard, Metric } from '@adopt-ai/ui-web';
import Link from 'next/link';

import { trpc } from '@/lib/trpc/client';

const AGENT_COLORS: Record<string, string> = {
  INBOX_TRIAGE: '#D9462C',
  DOCUMENT_EXTRACTION: '#E67E22',
  SUPPORT_ROUTING: '#D6912A',
  CUSTOM: '#C68A1F',
};

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toLocaleString();
}

export default function PortalDashboard() {
  const { data, isLoading } = trpc.portal.getDashboard.useQuery();

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
      {/* Header */}
      <div>
        <Eyebrow tone="glow">
          {data.weekRange.start} — {data.weekRange.end}
        </Eyebrow>
        <h1 className="font-display text-cream mt-2 text-3xl font-semibold">{data.greeting}</h1>
      </div>

      {/* Hero metrics */}
      <div className="grid grid-cols-3 gap-4">
        <GlassCard variant="dark" className="relative overflow-hidden">
          <div className="bg-linear-to-br from-accent/20 via-void to-void absolute inset-0" />
          <div className="relative p-6">
            <Eyebrow tone="glow">Hours reallocated</Eyebrow>
            <Metric value={data.hoursReallocated} label="this week" accent dark />
            <p className="text-cream/50 mt-2 font-mono text-xs">
              +{data.hoursTrendPct}% vs last week
            </p>
          </div>
        </GlassCard>

        <GlassCard variant="dark">
          <div className="p-6">
            <Eyebrow tone="cream">Live agents</Eyebrow>
            <Metric value={data.liveAgents} label="running now" dark />
          </div>
        </GlassCard>

        <GlassCard variant="dark">
          <div className="p-6">
            <Eyebrow tone={data.openAlerts > 0 ? 'accent' : 'cream'}>Open alerts</Eyebrow>
            <Metric
              value={data.openAlerts}
              label={data.openAlerts === 1 ? 'alert' : 'alerts'}
              dark
            />
          </div>
        </GlassCard>
      </div>

      {/* Agent list */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-cream text-lg font-semibold">Your agents</h2>
          <Link
            href="/portal/agents"
            className="text-accent hover:text-glow font-mono text-xs uppercase tracking-wider"
          >
            View all →
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          {data.agents.map((agent) => (
            <Link key={agent.id} href={`/portal/agents/${agent.id}`}>
              <div className="border-hairline-dark bg-cream/4 hover:border-accent/30 hover:bg-cream/6 group flex items-center justify-between rounded-xl border px-5 py-4 transition-all">
                <div className="flex items-center gap-4">
                  <div
                    className="text-cream flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl font-mono text-sm"
                    style={{
                      background: `linear-gradient(140deg, ${AGENT_COLORS[agent.kind] ?? '#C68A1F'}, #E8E3DB)`,
                    }}
                  >
                    ◈
                  </div>
                  <div>
                    <p className="font-display text-cream group-hover:text-accent text-sm font-semibold">
                      {agent.name}
                    </p>
                    <p className="font-body text-cream/50 text-xs">{agent.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-cream font-mono text-sm font-medium">
                      {formatNumber(agent.tasks24h)}
                    </p>
                    <p className="text-cream/40 font-mono text-[10px] uppercase tracking-wider">
                      tasks/24h
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-cream font-mono text-sm font-medium">
                      {(agent.successRate * 100).toFixed(2)}%
                    </p>
                    <p className="text-cream/40 font-mono text-[10px] uppercase tracking-wider">
                      success
                    </p>
                  </div>
                  <span className="text-cream/30 group-hover:text-accent">→</span>
                </div>
              </div>
            </Link>
          ))}

          {data.agents.length === 0 && (
            <div className="border-hairline-dark rounded-xl border border-dashed py-12 text-center">
              <p className="font-body text-cream/50 text-sm">No agents yet.</p>
              <p className="text-cream/30 mt-1 font-mono text-xs">
                Your architect will set these up during onboarding.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
