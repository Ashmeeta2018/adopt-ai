'use client';

import { Eyebrow, GlassCard, Metric } from '@adopt-ai/ui-web';
import Link from 'next/link';
import { use, useEffect, useRef, useState } from 'react';

import { trpc } from '@/lib/trpc/client';

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function ThroughputChart({ data }: { data: { ts: string; value: number }[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center font-mono text-xs text-cream/30">
        No throughput data in the last 24h
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.value), 1);
  const barWidth = Math.max(100 / data.length, 2);

  return (
    <div className="flex h-40 items-end gap-[1px]">
      {data.map((d, i) => (
        <div
          key={i}
          className="rounded-t-sm bg-gradient-to-t from-accent/60 to-glow/80 transition-all hover:from-accent hover:to-glow"
          style={{
            width: `${barWidth}%`,
            height: `${(d.value / max) * 100}%`,
            minHeight: '2px',
          }}
          title={`${formatTime(d.ts)}: ${d.value} tasks`}
        />
      ))}
    </div>
  );
}

function LiveFeed({ agentId }: { agentId: string }) {
  const [events, setEvents] = useState<Array<{ id: string; ts: string; status: string; message: string }>>([]);
  const feedRef = useRef<HTMLDivElement>(null);

  trpc.portal.streamFeed.useSubscription(
    { agentId },
    {
      onData(event) {
        setEvents((prev) => [...prev.slice(-49), event]);
      },
    },
  );

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [events]);

  const statusColor: Record<string, string> = {
    ok: 'text-success',
    warn: 'text-amber-400',
    error: 'text-red-400',
  };

  return (
    <div ref={feedRef} className="h-64 overflow-y-auto rounded-lg bg-void p-4 font-mono text-xs">
      {events.length === 0 && (
        <p className="text-cream/30">Waiting for live events…</p>
      )}
      {events.map((e) => (
        <div key={e.id} className="flex gap-3 py-0.5">
          <span className="shrink-0 text-cream/30">{formatTime(e.ts)}</span>
          <span className={`shrink-0 ${statusColor[e.status] ?? 'text-cream/30'}`}>●</span>
          <span className="text-cream/70">{e.message}</span>
        </div>
      ))}
    </div>
  );
}

export default function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: agentId } = use(params);

  const { data, isLoading } = trpc.portal.getAgent.useQuery({ agentId });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!data) return <p className="py-20 text-center font-body text-cream/50">Agent not found.</p>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/portal/agents" className="font-mono text-xs uppercase tracking-wider text-cream/40 hover:text-accent">
            ← Agents
          </Link>
          <div className="mt-2 flex items-center gap-4">
            <h1 className="font-display text-3xl font-semibold text-cream">{data.agent.name}</h1>
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor: data.agent.status === 'running' ? '#2BAE5C' : data.agent.status === 'error' ? '#D9462C' : '#888',
                boxShadow: `0 0 0 3px ${data.agent.status === 'running' ? 'rgba(43,174,92,0.25)' : 'transparent'}`,
              }}
            />
          </div>
          <p className="mt-1 font-body text-sm text-cream/50">{data.agent.description}</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <GlassCard variant="dark">
          <div className="p-5">
            <Eyebrow tone="cream">Tasks / 24h</Eyebrow>
            <Metric value={data.metrics.tasks24h.toLocaleString()} label="total runs" dark />
          </div>
        </GlassCard>
        <GlassCard variant="dark">
          <div className="p-5">
            <Eyebrow tone="cream">Success rate</Eyebrow>
            <Metric value={`${(data.metrics.successRate * 100).toFixed(2)}%`} label="accuracy" accent dark />
          </div>
        </GlassCard>
        <GlassCard variant="dark">
          <div className="p-5">
            <Eyebrow tone="cream">p95 latency</Eyebrow>
            <Metric value={`${data.metrics.p95LatencyMs}ms`} label="response time" dark />
          </div>
        </GlassCard>
      </div>

      {/* Throughput + Live Feed */}
      <div className="grid grid-cols-2 gap-6">
        <GlassCard variant="dark">
          <div className="p-5">
            <Eyebrow tone="cream">Throughput (24h)</Eyebrow>
            <div className="mt-4">
              <ThroughputChart data={data.throughput} />
            </div>
          </div>
        </GlassCard>

        <GlassCard variant="dark">
          <div className="p-5">
            <Eyebrow tone="glow">Live feed</Eyebrow>
            <div className="mt-4">
              <LiveFeed agentId={agentId} />
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
