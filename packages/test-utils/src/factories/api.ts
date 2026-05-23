import { createAlert, createOrganisation } from './user';

import type { MockAlert } from './user';

export interface AgentSummary {
  id: string;
  slug: string;
  name: string;
  description: string;
  status: string;
  tasks24h: number;
  successRate: number;
}

export interface DashboardResponse {
  greeting: string;
  weekRange: { start: string; end: string };
  hoursReallocated: number;
  hoursTrendPct: number;
  liveAgents: number;
  openAlerts: number;
  agents: AgentSummary[];
}

export interface AgentDetailResponse {
  agent: AgentSummary;
  metrics: {
    tasks24h: number;
    successRate: number;
    p95LatencyMs: number;
  };
  throughput: { ts: string; value: number }[];
}

export interface WeeklyReportResponse {
  range: { start: string; end: string };
  hoursSaved: number;
  hoursSavedTrendPct: number;
  costReducedUsd: number;
  costReducedTrendPct: number;
  pipelines: {
    name: string;
    hoursSaved: number;
    tasks: number;
    successRate: number;
    accent: 'accent' | 'glow' | 'amber';
  }[];
}

export interface AlertsResponse {
  today: MockAlert[];
  earlier: MockAlert[];
  nextCursor: string | null;
}

export function createDashboardResponse(
  overrides: Partial<DashboardResponse> = {},
): DashboardResponse {
  const agents = overrides.agents ?? [
    { id: 'agent-1', slug: 'inbox-triage', name: 'Inbox Triage', description: 'Triages incoming emails', status: 'running', tasks24h: 48, successRate: 0.98 },
    { id: 'agent-2', slug: 'doc-extraction', name: 'Doc Extraction', description: 'Extracts structured data from documents', status: 'running', tasks24h: 22, successRate: 0.95 },
  ];

  return {
    greeting: overrides.greeting ?? 'Good morning',
    weekRange: overrides.weekRange ?? {
      start: '2026-05-15',
      end: '2026-05-22',
    },
    hoursReallocated: overrides.hoursReallocated ?? 22,
    hoursTrendPct: overrides.hoursTrendPct ?? 12,
    liveAgents: overrides.liveAgents ?? 2,
    openAlerts: overrides.openAlerts ?? 0,
    agents,
  };
}

export function createAgentDetailResponse(
  overrides: Partial<AgentDetailResponse> = {},
): AgentDetailResponse {
  const agent = overrides.agent ?? {
    id: 'agent-1',
    slug: 'inbox-triage',
    name: 'Inbox Triage',
    description: 'Triages incoming emails',
    status: 'running',
    tasks24h: 48,
    successRate: 0.98,
  };

  const now = new Date();
  const throughput = overrides.throughput ?? Array.from({ length: 24 }, (_, i) => {
    const ts = new Date(now);
    ts.setHours(ts.getHours() - (23 - i));
    return { ts: ts.toISOString(), value: Math.floor(Math.random() * 10) + 1 };
  });

  return {
    agent,
    metrics: overrides.metrics ?? {
      tasks24h: 48,
      successRate: 0.98,
      p95LatencyMs: 1200,
    },
    throughput,
  };
}

export function createWeeklyReportResponse(
  overrides: Partial<WeeklyReportResponse> = {},
): WeeklyReportResponse {
  return {
    range: overrides.range ?? { start: '2026-05-15', end: '2026-05-22' },
    hoursSaved: overrides.hoursSaved ?? 22,
    hoursSavedTrendPct: overrides.hoursSavedTrendPct ?? 12,
    costReducedUsd: overrides.costReducedUsd ?? 1850,
    costReducedTrendPct: overrides.costReducedTrendPct ?? 8,
    pipelines: overrides.pipelines ?? [
      { name: 'Inbox Triage', hoursSaved: 12.5, tasks: 340, successRate: 0.98, accent: 'accent' },
      { name: 'Doc Extraction', hoursSaved: 6.0, tasks: 180, successRate: 0.95, accent: 'glow' },
      { name: 'Support Routing', hoursSaved: 3.5, tasks: 95, successRate: 0.92, accent: 'amber' },
    ],
  };
}

export function createAlertsResponse(
  overrides: Partial<AlertsResponse> = {},
): AlertsResponse {
  const orgId = createOrganisation().id;

  return {
    today: overrides.today ?? [
      createAlert({ organisationId: orgId, severity: 'OPS', title: 'Agent latency spike', body: 'p95 exceeded 5s threshold', ts: new Date() }),
    ],
    earlier: overrides.earlier ?? [
      createAlert({ organisationId: orgId, severity: 'DRIFT', title: 'Model drift detected', body: 'Success rate dropped below 90%', ts: new Date(Date.now() - 86400000) }),
    ],
    nextCursor: overrides.nextCursor ?? null,
  };
}
