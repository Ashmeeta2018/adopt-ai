'use client';

import { Eyebrow, GlassCard } from '@adopt-ai/ui-web';
import Link from 'next/link';

import { trpc } from '@/lib/trpc/client';

const STATUS_DOT: Record<string, string> = {
  ACTIVE: 'bg-success',
  DRAFT: 'bg-amber',
  PAUSED: 'bg-cream/30',
  ARCHIVED: 'bg-cream/20',
};

// Fixed diagram nodes — same shape for every workflow card.
const DIAGRAM_NODES = ['trigger', 'agent', 'condition', 'agent', 'output'] as const;

function nodeClass(kind: string): string {
  if (kind === 'agent') return 'bg-accent/10 text-accent';
  if (kind === 'trigger') return 'bg-success/10 text-success';
  if (kind === 'condition') return 'bg-amber/10 text-amber';
  return 'bg-cream/5 text-cream/40';
}

export default function WorkflowsPage() {
  const { data: workflows, isLoading } = trpc.workflows.list.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!workflows) return null;

  return (
    <div className="space-y-8">
      <div>
        <Eyebrow tone="cream">{workflows.length} workflow{workflows.length !== 1 ? 's' : ''}</Eyebrow>
        <h1 className="mt-2 font-display text-3xl font-semibold text-cream">Workflows</h1>
      </div>

      {workflows.length === 0 && (
        <div className="rounded-xl border border-dashed border-hairline-dark py-16 text-center">
          <p className="font-body text-sm text-cream/50">No workflows yet.</p>
          <p className="mt-1 font-mono text-xs text-cream/30">
            Workflows appear here once your first project is configured.
          </p>
        </div>
      )}

      <div className="grid gap-4">
        {workflows.map((wf) => {
          const nodeCount = Array.isArray(wf.nodesJson) ? wf.nodesJson.length : 0;

          return (
            <Link key={wf.id} href={`/portal/workflows/${wf.id}`} className="block">
              <GlassCard variant="dark">
                <div className="p-6 transition-colors hover:bg-cream/[0.03]">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cream/10">
                        <span className="font-mono text-xs text-cream">⑂</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-display text-base font-semibold text-cream">{wf.name}</h3>
                          <div className="flex items-center gap-1.5">
                            <div className={`h-2 w-2 rounded-full ${STATUS_DOT[wf.status] ?? 'bg-cream/20'}`} />
                            <span className="font-mono text-[10px] uppercase tracking-wider text-cream/40">
                              {wf.status.toLowerCase()}
                            </span>
                          </div>
                        </div>
                        {wf.description && (
                          <p className="mt-0.5 font-body text-sm text-cream/50">{wf.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-8 text-right">
                      <div>
                        <p className="font-mono text-sm font-medium text-cream">v{wf.version}</p>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-cream/40">version</p>
                      </div>
                      <div>
                        <p className="font-mono text-sm font-medium text-cream">{nodeCount}</p>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-cream/40">nodes</p>
                      </div>
                      <div>
                        <p className="font-mono text-sm font-medium text-cream">{wf._count.agents}</p>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-cream/40">agents</p>
                      </div>
                      <div>
                        <p className="font-mono text-sm font-medium capitalize text-cream">
                          {wf.trigger.toLowerCase()}
                        </p>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-cream/40">trigger</p>
                      </div>
                    </div>
                  </div>

                  {/* Mini workflow diagram */}
                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-cream/[0.04] p-3">
                    {DIAGRAM_NODES.map((kind, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className={`rounded-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${nodeClass(kind)}`}>
                          {kind}
                        </div>
                        {i < DIAGRAM_NODES.length - 1 && (
                          <span className="text-cream/20">→</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
