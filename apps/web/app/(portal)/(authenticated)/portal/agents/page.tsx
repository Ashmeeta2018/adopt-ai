'use client';

import { trpc } from '@/lib/trpc/client';
import { AgentPill, Eyebrow } from '@adopt-ai/ui-web';
import Link from 'next/link';

export default function AgentsPage() {
  const { data, isLoading } = trpc.portal.getDashboard.useQuery();

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
        <Eyebrow tone="muted">{data.agents.length} agents</Eyebrow>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Agents</h1>
      </div>

      <div className="space-y-3">
        {data.agents.map((agent) => (
          <Link key={agent.id} href={`/portal/agents/${agent.id}`}>
            <div className="group flex items-center justify-between rounded-xl border border-hairline bg-paper px-6 py-5 transition-all hover:border-accent/30 hover:shadow-md">
              <div className="flex items-center gap-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-void">
                  <AgentPill status={agent.status} />
                </div>
                <div>
                  <p className="font-display text-base font-semibold text-ink group-hover:text-accent">
                    {agent.name}
                  </p>
                  <p className="mt-0.5 font-body text-sm text-ink/50">{agent.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-10">
                <div className="grid grid-cols-3 gap-8 text-right">
                  <div>
                    <p className="font-mono text-lg font-medium text-ink">
                      {agent.tasks24h.toLocaleString()}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-ink/40">tasks/24h</p>
                  </div>
                  <div>
                    <p className="font-mono text-lg font-medium text-ink">
                      {(agent.successRate * 100).toFixed(2)}%
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-ink/40">success rate</p>
                  </div>
                  <div>
                    <p className="font-mono text-lg font-medium capitalize text-ink">{agent.status}</p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-ink/40">status</p>
                  </div>
                </div>
                <span className="ml-4 text-lg text-ink/30 group-hover:text-accent">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
