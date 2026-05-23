import { colors } from '@adopt-ai/tokens';

import { cn } from '../utils/cn';

type Status = 'running' | 'queued' | 'queue' | 'error' | 'paused';

interface AgentPillProps {
  label?: string;
  status?: Status;
  count?: number;
  dark?: boolean;
}

const dotColor: Record<Status, string> = {
  running: colors.success,
  queued: colors.gold,
  queue: colors.gold,
  error: colors.accent,
  paused: '#888',
};

const statusLabel: Record<Status, string> = {
  running: 'Running',
  queued: 'Queued',
  queue: 'Queued',
  error: 'Error',
  paused: 'Paused',
};

export function AgentPill({ label, status = 'running', count, dark = false }: AgentPillProps) {
  const color = dotColor[status];
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2.5 rounded-full px-3 py-2',
        'font-mono text-[11.5px] tracking-[0.06em]',
        dark
          ? 'bg-[rgba(248,244,238,0.06)] border border-hairline-dark text-cream'
          : 'bg-[rgba(61,26,15,0.04)] border border-hairline text-ink',
      )}
    >
      <span
        className={status === 'running' ? 'animate-agent-pulse' : undefined}
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 0 3px ${color}33`,
        }}
      />
      {label ?? statusLabel[status]}
      {count !== undefined && <span className="ml-1 opacity-50">· {count}</span>}
    </div>
  );
}
