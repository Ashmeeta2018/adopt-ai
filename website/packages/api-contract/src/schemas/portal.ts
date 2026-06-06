import { z } from 'zod';

import { cursorPagination, idSchema } from './common';

/* ---------- Agent ---------- */
export const agentStatus = z.enum(['running', 'queued', 'error', 'paused']);

export const agentSummary = z.object({
  id: idSchema,
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  status: agentStatus,
  tasks24h: z.number().int().nonnegative(),
  successRate: z.number().min(0).max(1),
});
export type AgentSummary = z.infer<typeof agentSummary>;

/* ---------- Dashboard ---------- */
export const dashboardOutput = z.object({
  greeting: z.string(),
  weekRange: z.object({ start: z.string().date(), end: z.string().date() }),
  hoursReallocated: z.number().nonnegative(),
  hoursTrendPct: z.number(),
  liveAgents: z.number().int().nonnegative(),
  openAlerts: z.number().int().nonnegative(),
  agents: agentSummary.array(),
});

/* ---------- Agent detail ---------- */
export const agentMetric = z.object({
  tasks24h: z.number().int().nonnegative(),
  successRate: z.number().min(0).max(1),
  p95LatencyMs: z.number().int().nonnegative(),
});

export const agentDetailInput = z.object({ agentId: idSchema });
export const agentDetailOutput = z.object({
  agent: agentSummary,
  metrics: agentMetric,
  throughput: z
    .object({ ts: z.string().datetime(), value: z.number().nonnegative() })
    .array()
    .max(2048),
});

/* ---------- Live feed (SSE) ---------- */
export const feedEventStatus = z.enum(['ok', 'warn', 'error']);
export const feedEvent = z.object({
  id: idSchema,
  ts: z.string().datetime(),
  status: feedEventStatus,
  message: z.string().max(280),
});
export type FeedEvent = z.infer<typeof feedEvent>;

export const streamFeedInput = z.object({ agentId: idSchema });

/* ---------- Weekly report ---------- */
export const pipelineBreakdown = z.object({
  name: z.string(),
  hoursSaved: z.number().nonnegative(),
  tasks: z.number().int().nonnegative(),
  successRate: z.number().min(0).max(1),
  accent: z.enum(['accent', 'glow', 'amber']),
});

export const weeklyReportInput = z.object({
  weekStart: z.string().date().optional(),
});

export const weeklyReportOutput = z.object({
  range: z.object({ start: z.string().date(), end: z.string().date() }),
  hoursSaved: z.number().nonnegative(),
  hoursSavedTrendPct: z.number(),
  costReducedUsd: z.number().nonnegative(),
  costReducedTrendPct: z.number(),
  pipelines: pipelineBreakdown.array(),
});

/* ---------- Alerts ---------- */
export const alertSeverity = z.enum(['ops', 'drift', 'team']);
export const alert = z.object({
  id: idSchema,
  ts: z.string().datetime(),
  severity: alertSeverity,
  title: z.string(),
  body: z.string(),
  read: z.boolean(),
});

export const listAlertsInput = cursorPagination;
export const listAlertsOutput = z.object({
  today: alert.array(),
  earlier: alert.array(),
  nextCursor: z.string().nullable(),
});

export const markAlertReadInput = z.object({ alertId: idSchema });
