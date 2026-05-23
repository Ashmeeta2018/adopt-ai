'use client';

import { trpc } from '@/lib/trpc/client';
import { Eyebrow } from '@adopt-ai/ui-web';

const SEVERITY_STYLES: Record<string, { dot: string; bg: string; border: string }> = {
  ops: { dot: 'bg-accent', bg: 'bg-accent/5', border: 'border-accent/25' },
  drift: { dot: 'bg-amber', bg: 'bg-amber/5', border: 'border-amber/25' },
  team: { dot: 'bg-success', bg: 'bg-success/5', border: 'border-success/25' },
};

function AlertCard({
  alert,
  onMarkRead,
}: {
  alert: { id: string; ts: string; severity: string; title: string; body: string; read: boolean };
  onMarkRead: (id: string) => void;
}) {
  const style = SEVERITY_STYLES[alert.severity] ?? SEVERITY_STYLES['ops']!;
  const time = new Date(alert.ts);
  const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className={`group rounded-xl border bg-cream/[0.03] p-5 transition-all ${style.border} ${!alert.read ? style.bg : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${style.dot} ${!alert.read ? 'animate-pulse' : 'opacity-30'}`} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-cream/40">
                {alert.severity}
              </span>
              {!alert.read && (
                <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
                  new
                </span>
              )}
            </div>
            <p className={`mt-1 font-display text-sm font-semibold ${!alert.read ? 'text-cream' : 'text-cream/60'}`}>
              {alert.title}
            </p>
            <p className="mt-0.5 font-body text-sm text-cream/50">{alert.body}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="font-mono text-xs text-cream/30">{dateStr} {timeStr}</span>
          {!alert.read && (
            <button
              onClick={() => onMarkRead(alert.id)}
              className="rounded-md border border-hairline-dark bg-cream/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-cream/50 transition-colors hover:border-accent hover:text-accent"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AlertsPage() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.portal.listAlerts.useQuery({});
  const markRead = trpc.portal.markAlertRead.useMutation({
    onSuccess: () => utils.portal.listAlerts.invalidate(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!data) return null;

  const unread = [...data.today, ...data.earlier].filter((a) => !a.read).length;

  return (
    <div className="space-y-8">
      <div>
        <Eyebrow tone={unread > 0 ? 'accent' : 'cream'}>
          {unread > 0 ? `${unread} unread` : 'All caught up'}
        </Eyebrow>
        <h1 className="mt-2 font-display text-3xl font-semibold text-cream">Alerts</h1>
      </div>

      {data.today.length > 0 && (
        <div>
          <Eyebrow tone="cream">Today</Eyebrow>
          <div className="mt-3 space-y-3">
            {data.today.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onMarkRead={(id) => markRead.mutate({ alertId: id })} />
            ))}
          </div>
        </div>
      )}

      {data.earlier.length > 0 && (
        <div>
          <Eyebrow tone="cream">Earlier</Eyebrow>
          <div className="mt-3 space-y-3">
            {data.earlier.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onMarkRead={(id) => markRead.mutate({ alertId: id })} />
            ))}
          </div>
        </div>
      )}

      {data.today.length === 0 && data.earlier.length === 0 && (
        <div className="rounded-xl border border-dashed border-hairline-dark py-16 text-center">
          <p className="font-body text-sm text-cream/50">No alerts.</p>
          <p className="mt-1 font-mono text-xs text-cream/30">
            We'll surface issues here when agents need attention.
          </p>
        </div>
      )}
    </div>
  );
}
