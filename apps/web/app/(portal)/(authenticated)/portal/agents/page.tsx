'use client';

import { Eyebrow } from '@adopt-ai/ui-web';
import Link from 'next/link';

import { trpc } from '@/lib/trpc/client';

const AGENT_COLORS: Record<string, string> = {
  INBOX_TRIAGE: '#D9462C',
  DOCUMENT_EXTRACTION: '#E67E22',
  SUPPORT_ROUTING: '#D6912A',
  CUSTOM: '#C68A1F',
};

export default function AgentsPage() {
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
      <div>
        <Eyebrow tone="cream">{data.agents.length} agents</Eyebrow>
        <h1 className="font-display text-cream mt-2 text-3xl font-semibold">Agents</h1>
      </div>

      <div className="space-y-3">
        {data.agents.map((agent) => (
          <Link key={agent.id} href={`/portal/agents/${agent.id}`}>
            <div className="border-hairline-dark bg-cream/4 hover:border-accent/30 hover:bg-cream/6 group flex items-center justify-between rounded-xl border px-6 py-5 transition-all">
              <div className="flex items-center gap-5">
                <div
                  className="text-cream flex h-12 w-12 shrink-0 items-center justify-center rounded-lg font-mono text-base"
                  style={{
                    background: `linear-gradient(140deg, ${AGENT_COLORS[agent.kind] ?? '#C68A1F'}, #E8E3DB)`,
                  }}
                >
                  ◈
                </div>
                <div>
                  <p className="font-display text-cream group-hover:text-accent text-base font-semibold">
                    {agent.name}
                  </p>
                  <p className="font-body text-cream/50 mt-0.5 text-sm">{agent.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-10">
                <div className="grid grid-cols-3 gap-8 text-right">
                  <div>
                    <p className="text-cream font-mono text-lg font-medium">
                      {agent.tasks24h.toLocaleString()}
                    </p>
                    <p className="text-cream/40 font-mono text-[10px] uppercase tracking-wider">
                      tasks/24h
                    </p>
                  </div>
                  <div>
                    <p className="text-cream font-mono text-lg font-medium">
                      {(agent.successRate * 100).toFixed(2)}%
                    </p>
                    <p className="text-cream/40 font-mono text-[10px] uppercase tracking-wider">
                      success rate
                    </p>
                  </div>
                  <div>
                    <p className="text-cream font-mono text-lg font-medium capitalize">
                      {agent.status}
                    </p>
                    <p className="text-cream/40 font-mono text-[10px] uppercase tracking-wider">
                      status
                    </p>
                  </div>
                </div>
                <span className="text-cream/30 group-hover:text-accent ml-4 text-lg">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
