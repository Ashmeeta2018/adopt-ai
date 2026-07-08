'use client';

import { Eyebrow } from '@adopt-ai/ui-web';

import { trpc } from '@/lib/trpc/client';

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
  const style = SEVERITY_STYLES[alert.severity] ?? SEVERITY_STYLES.ops!;
  const time = new Date(alert.ts);
  const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div
      className={`bg-cream/3 group rounded-xl border p-5 transition-all ${style.border} ${!alert.read ? style.bg : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div
            className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${style.dot} ${!alert.read ? 'animate-pulse' : 'opacity-30'}`}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-cream/40 font-mono text-[10px] uppercase tracking-wider">
                {alert.severity}
              </span>
              {!alert.read && (
                <span className="bg-accent/15 text-accent rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider">
                  new
                </span>
              )}
            </div>
            <p
              className={`font-display mt-1 text-sm font-semibold ${!alert.read ? 'text-cream' : 'text-cream/60'}`}
            >
              {alert.title}
            </p>
            <p className="font-body text-cream/50 mt-0.5 text-sm">{alert.body}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="text-cream/30 font-mono text-xs">
            {dateStr} {timeStr}
          </span>
          {!alert.read && (
            <button
              onClick={() => onMarkRead(alert.id)}
              className="border-hairline-dark bg-cream/4 text-cream/50 hover:border-accent hover:text-accent rounded-md border px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors"
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
        <div className="border-accent h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
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
        <h1 className="font-display text-cream mt-2 text-3xl font-semibold">Alerts</h1>
      </div>

      {data.today.length > 0 && (
        <div>
          <Eyebrow tone="cream">Today</Eyebrow>
          <div className="mt-3 space-y-3">
            {data.today.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onMarkRead={(id) => markRead.mutate({ alertId: id })}
              />
            ))}
          </div>
        </div>
      )}

      {data.earlier.length > 0 && (
        <div>
          <Eyebrow tone="cream">Earlier</Eyebrow>
          <div className="mt-3 space-y-3">
            {data.earlier.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onMarkRead={(id) => markRead.mutate({ alertId: id })}
              />
            ))}
          </div>
        </div>
      )}

      {data.today.length === 0 && data.earlier.length === 0 && (
        <div className="border-hairline-dark rounded-xl border border-dashed py-16 text-center">
          <p className="font-body text-cream/50 text-sm">No alerts.</p>
          <p className="text-cream/30 mt-1 font-mono text-xs">
            We&apos;ll surface issues here when agents need attention.
          </p>
        </div>
      )}
    </div>
  );
}
