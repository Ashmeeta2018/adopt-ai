export interface MswRequest {
  method: string;
  path: string;
  status: number;
  body: unknown;
}

export function createAuthHandlers(baseUrl: string): MswRequest[] {
  const base = baseUrl.replace(/\/$/, '');
  return [
    {
      method: 'POST',
      path: `${base}/api/auth/magic-link`,
      status: 200,
      body: { ok: true },
    },
    {
      method: 'GET',
      path: `${base}/api/auth/session`,
      status: 200,
      body: {
        user: {
          id: 'cltestuser00000001',
          email: 'test@example.com',
          name: 'Test User',
        },
        expires: new Date(Date.now() + 86400000 * 30).toISOString(),
      },
    },
    {
      method: 'POST',
      path: `${base}/api/auth/signout`,
      status: 200,
      body: { ok: true },
    },
  ];
}

export function createPortalHandlers(baseUrl: string): MswRequest[] {
  const base = baseUrl.replace(/\/$/, '');
  return [
    {
      method: 'GET',
      path: `${base}/api/trpc/portal.getDashboard`,
      status: 200,
      body: {
        result: {
          data: {
            greeting: 'Good morning',
            weekRange: { start: '2026-05-15', end: '2026-05-22' },
            hoursReallocated: 22,
            hoursTrendPct: 12,
            liveAgents: 2,
            openAlerts: 0,
            agents: [
              { id: 'agent-1', slug: 'inbox-triage', name: 'Inbox Triage', description: 'Triages incoming emails', status: 'running', tasks24h: 48, successRate: 0.98 },
            ],
          },
        },
      },
    },
    {
      method: 'GET',
      path: `${base}/api/trpc/portal.getAgent`,
      status: 200,
      body: {
        result: {
          data: {
            agent: { id: 'agent-1', slug: 'inbox-triage', name: 'Inbox Triage', description: 'Triages incoming emails', status: 'running', tasks24h: 48, successRate: 0.98 },
            metrics: { tasks24h: 48, successRate: 0.98, p95LatencyMs: 1200 },
            throughput: [],
          },
        },
      },
    },
    {
      method: 'GET',
      path: `${base}/api/trpc/portal.getWeeklyReport`,
      status: 200,
      body: {
        result: {
          data: {
            range: { start: '2026-05-15', end: '2026-05-22' },
            hoursSaved: 22,
            hoursSavedTrendPct: 12,
            costReducedUsd: 1850,
            costReducedTrendPct: 8,
            pipelines: [
              { name: 'Inbox Triage', hoursSaved: 12.5, tasks: 340, successRate: 0.98, accent: 'accent' },
            ],
          },
        },
      },
    },
    {
      method: 'GET',
      path: `${base}/api/trpc/portal.listAlerts`,
      status: 200,
      body: {
        result: {
          data: {
            today: [],
            earlier: [],
            nextCursor: null,
          },
        },
      },
    },
    {
      method: 'POST',
      path: `${base}/api/trpc/portal.markAlertRead`,
      status: 200,
      body: { result: { data: { ok: true } } },
    },
  ];
}

export function createMarketingHandlers(baseUrl: string): MswRequest[] {
  const base = baseUrl.replace(/\/$/, '');
  return [
    {
      method: 'POST',
      path: `${base}/api/trpc/marketing.contact.submit`,
      status: 200,
      body: { result: { data: { ok: true, ticketId: 'ticket-001' } } },
    },
  ];
}
