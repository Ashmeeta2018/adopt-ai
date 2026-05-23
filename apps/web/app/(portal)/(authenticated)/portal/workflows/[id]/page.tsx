'use client';

import { AgentPill, Eyebrow, GlassCard } from '@adopt-ai/ui-web';
import Link from 'next/link';
import { use } from 'react';

import { trpc } from '@/lib/trpc/client';

// ── Display helpers ────────────────────────────────────────────

function formatDuration(ms: number): string {
  if (ms === 0) return '—';
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  const m = Math.floor(ms / 60_000);
  const s = Math.round((ms % 60_000) / 1000);
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  );
}

const STATUS_DOT: Record<string, string> = {
  ACTIVE:   'bg-success',
  DRAFT:    'bg-amber',
  PAUSED:   'bg-ink/30',
  ARCHIVED: 'bg-ink/20',
};

const EXEC_STATUS_CLASS: Record<string, { dot: string; badge: string; text: string }> = {
  completed: { dot: 'bg-success',      badge: 'bg-success/10',    text: 'text-success' },
  running:   { dot: 'bg-accent animate-agent-pulse', badge: 'bg-accent/10', text: 'text-accent' },
  failed:    { dot: 'bg-error',        badge: 'bg-error/10',      text: 'text-error' },
  cancelled: { dot: 'bg-ink/30',       badge: 'bg-ink/5',         text: 'text-ink/40' },
};

/** Render nodes from nodesJson if it's a [{type|kind|label}] array; fall back to a generic flow. */
function parseNodes(raw: unknown): string[] {
  if (Array.isArray(raw) && raw.length > 0) {
    const labels = raw.map((n) => {
      if (typeof n === 'object' && n !== null) {
        const node = n as Record<string, unknown>;
        return String(node.type ?? node.kind ?? node.label ?? 'node');
      }
      return 'node';
    });
    if (labels.some((l) => l !== 'node')) return labels;
  }
  return ['trigger', 'agent', 'condition', 'output'];
}

function nodeClass(label: string): string {
  const l = label.toLowerCase();
  if (l === 'agent')     return 'bg-accent/10 text-accent';
  if (l === 'trigger')   return 'bg-success/10 text-success';
  if (l === 'condition') return 'bg-amber/10 text-amber';
  if (l === 'output')    return 'bg-ink/5 text-ink/50';
  return 'bg-ink/5 text-ink/50';
}

// ── Page ──────────────────────────────────────────────────────

export default function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: workflowId } = use(params);
  const { data: wf, isLoading } = trpc.workflows.get.useQuery({ workflowId });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!wf) {
    return (
      <p className="py-20 text-center font-body text-ink/50">Workflow not found.</p>
    );
  }

  const nodes    = parseNodes(wf.nodesJson);
  const dotClass = STATUS_DOT[wf.status] ?? 'bg-ink/20';

  return (
    <div className="space-y-8">

      {/* ── Header ─────────────────────────────────────────── */}
      <div>
        <Link
          href="/portal/workflows"
          className="font-mono text-xs uppercase tracking-wider text-ink/40 hover:text-accent"
        >
          ← Workflows
        </Link>

        <div className="mt-3 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-void">
            <span className="font-mono text-base text-cream">⑂</span>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-3xl font-semibold text-ink">{wf.name}</h1>
              {/* Status badge */}
              <div className="flex items-center gap-1.5">
                <div className={`h-2 w-2 rounded-full ${dotClass}`} />
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink/50">
                  {wf.status.toLowerCase()}
                </span>
              </div>
            </div>
            {wf.description && (
              <p className="mt-1 font-body text-sm text-ink/55">{wf.description}</p>
            )}
          </div>
        </div>

        {/* Meta strip */}
        <div className="mt-5 flex flex-wrap gap-6">
          {(
            [
              { label: 'version',  value: `v${wf.version}` },
              { label: 'trigger',  value: wf.trigger.toLowerCase() },
              { label: 'nodes',    value: String(nodes.length) },
              { label: 'agents',   value: String(wf.agents.length) },
              { label: 'executions', value: String(wf.executions.length) },
            ] as const
          ).map(({ label, value }) => (
            <div key={label}>
              <p className="font-mono text-sm font-medium text-ink">{value}</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-ink/40">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Attached agents ────────────────────────────────── */}
      {wf.agents.length > 0 && (
        <GlassCard>
          <div className="p-6">
            <Eyebrow tone="muted">Attached agents</Eyebrow>
            <div className="mt-4 space-y-3">
              {wf.agents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center justify-between border-b border-hairline/50 pb-3 last:border-0 last:pb-0"
                >
                  <Link
                    href={`/portal/agents/${agent.id}`}
                    className="font-body text-sm text-ink hover:text-accent"
                  >
                    {agent.name}
                  </Link>
                  <AgentPill status={agent.status.toLowerCase() as Parameters<typeof AgentPill>[0]['status']} />
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      )}

      {/* ── Node diagram ───────────────────────────────────── */}
      <GlassCard>
        <div className="p-6">
          <Eyebrow tone="muted">Node flow · v{wf.version}</Eyebrow>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {nodes.map((label, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={`rounded-md px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider ${nodeClass(label)}`}
                >
                  {label}
                </div>
                {i < nodes.length - 1 && (
                  <span className="font-mono text-xs text-ink/20">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* ── Recent executions ──────────────────────────────── */}
      <GlassCard>
        <div className="p-6">
          <Eyebrow tone="muted">Recent executions</Eyebrow>

          {wf.executions.length === 0 ? (
            <p className="mt-4 font-body text-sm text-ink/45">
              No executions yet. This workflow has not been triggered.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-hairline">
                    {['Status', 'Trigger', 'Duration', 'Started', 'Error'].map((h) => (
                      <th
                        key={h}
                        className="pb-3 pr-6 font-mono text-[10px] uppercase tracking-wider text-ink/40 last:pr-0"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {wf.executions.map((exec) => {
                    const s = EXEC_STATUS_CLASS[exec.status] ?? EXEC_STATUS_CLASS['cancelled']!;
                    return (
                      <tr key={exec.id} className="border-b border-hairline/40 last:border-0">
                        <td className="py-3 pr-6">
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 shrink-0 rounded-full ${s.dot}`} />
                            <span className={`font-mono text-xs capitalize ${s.text}`}>
                              {exec.status}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 pr-6 font-mono text-xs capitalize text-ink/60">
                          {exec.trigger}
                        </td>
                        <td className="py-3 pr-6 font-mono text-xs text-ink/60">
                          {formatDuration(exec.durationMs)}
                        </td>
                        <td className="py-3 pr-6 font-mono text-xs text-ink/50">
                          {formatDateTime(exec.startedAt.toISOString())}
                        </td>
                        <td className="py-3 font-mono text-xs text-error/80">
                          {exec.error ? (
                            <span title={exec.error}>
                              {exec.error.length > 48 ? exec.error.slice(0, 48) + '…' : exec.error}
                            </span>
                          ) : (
                            <span className="text-ink/25">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </GlassCard>

    </div>
  );
}
