import {
  agentDetailInput,
  listAlertsInput,
  markAlertReadInput,
  streamFeedInput,
  weeklyReportInput,
} from '@adopt-ai/api-contract';
import { TRPCError } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import { z } from 'zod';

import { protectedProcedure, router } from '../trpc';

const agentStatusMap = { RUNNING: 'running', QUEUED: 'queued', ERROR: 'error', PAUSED: 'paused' } as const;

const alertSeverityMap = { OPS: 'ops', DRIFT: 'drift', TEAM: 'team' } as const;

const alertSeveritySchema = z.enum(['OPS', 'DRIFT', 'TEAM']);

function toAlertSeverity(raw: unknown): 'ops' | 'drift' | 'team' {
  const parsed = alertSeveritySchema.safeParse(raw);
  return parsed.success ? alertSeverityMap[parsed.data] : 'ops';
}

function pctChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

function greetingFor(name: string | undefined): string {
  const hour = new Date().getHours();
  const part = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  return `${part}, ${name ?? 'there'}.`;
}

function weekRange(): { start: string; end: string } {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { start: fmt(monday), end: fmt(sunday) };
}

export const portalRouter = router({
  getDashboard: protectedProcedure.query(async ({ ctx }) => {
    const membership = ctx.session.user.memberships?.[0];
    if (!membership) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'No workspace membership.' });
    }

    const orgId = membership.organisationId;
    const cutoff24h = new Date(Date.now() - 86_400_000);
    const cutoff48h = new Date(Date.now() - 2 * 86_400_000);

    const [agents, alertCount, prevRunsCount] = await Promise.all([
      ctx.prisma.agent.findMany({
        where: { organisationId: orgId, deletedAt: null },
        select: {
          id: true,
          slug: true,
          name: true,
          description: true,
          status: true,
          kind: true,
          // Fetch up to 100 recent runs so we can compute success rate and
          // last-run timestamp without a separate query.
          runs: {
            take: 100,
            orderBy: { ts: 'desc' },
            where: { ts: { gte: cutoff24h } },
            select: { status: true, latencyMs: true, ts: true },
          },
          // Accurate total count for display (not capped at 100).
          _count: { select: { runs: { where: { ts: { gte: cutoff24h } } } } },
        },
      }),
      ctx.prisma.alert.count({ where: { organisationId: orgId, read: false } }),
      ctx.prisma.agentRun.count({
        where: { organisationId: orgId, ts: { gte: cutoff48h, lt: cutoff24h }, agent: { deletedAt: null } },
      }),
    ]);

    const totalRuns24h = agents.reduce((sum, a) => sum + a._count.runs, 0);
    const hoursRaw = (totalRuns24h * 2.5) / 60;
    const prevHoursRaw = (prevRunsCount * 2.5) / 60;

    return {
      greeting: greetingFor(ctx.session.user.name ?? undefined),
      weekRange: weekRange(),
      hoursReallocated: Math.round(hoursRaw),
      hoursTrendPct: pctChange(hoursRaw, prevHoursRaw),
      liveAgents: agents.filter((a) => a.status === 'RUNNING').length,
      openAlerts: alertCount,
      agents: agents.map((a) => {
        const lastRun = a.runs[0];
        const successCount = a.runs.filter((r) => r.status === 'success').length;
        const successRate = a.runs.length > 0 ? successCount / a.runs.length : 1;
        return {
          id: a.id,
          slug: a.slug,
          name: a.name,
          description: a.description,
          status: agentStatusMap[a.status],
          kind: a.kind,
          tasks24h: a._count.runs,
          successRate: Math.round(successRate * 10000) / 10000,
          lastRunAt: lastRun?.ts?.toISOString() ?? null,
        };
      }),
    };
  }),

  getAgent: protectedProcedure.input(agentDetailInput).query(async ({ input, ctx }) => {
    const membership = ctx.session.user.memberships?.[0];
    if (!membership) throw new TRPCError({ code: 'FORBIDDEN' });

    const agent = await ctx.prisma.agent.findFirst({
      where: { id: input.agentId, organisationId: membership.organisationId, deletedAt: null },
      include: {
        runs: {
          take: 500,
          orderBy: { ts: 'desc' },
          where: { ts: { gte: new Date(Date.now() - 86400000) } },
        },
      },
    });

    if (!agent) throw new TRPCError({ code: 'NOT_FOUND', message: 'Agent not found.' });

    const runs24h = agent.runs.length;
    const successCount = agent.runs.filter((r) => r.status === 'success').length;
    const p95LatencyMs = runs24h > 0
      ? [...agent.runs].sort((a, b) => a.latencyMs - b.latencyMs)[Math.ceil(runs24h * 0.95) - 1]!.latencyMs
      : 0;

    const throughput = agent.runs
      .reverse()
      .reduce<{ ts: string; value: number }[]>((buckets, run) => {
        const hour = run.ts.toISOString().slice(0, 13);
        const existing = buckets.find((b) => b.ts.startsWith(hour));
        if (existing) existing.value++;
        else buckets.push({ ts: `${hour}:00:00Z`, value: 1 });
        return buckets;
      }, []);

    return {
      agent: {
        id: agent.id,
        slug: agent.slug,
        name: agent.name,
        description: agent.description,
        status: agent.status.toLowerCase() as 'running' | 'queued' | 'error' | 'paused',
        tasks24h: runs24h,
        successRate: runs24h > 0 ? Math.round((successCount / runs24h) * 10000) / 10000 : 1,
      },
      metrics: { tasks24h: runs24h, successRate: runs24h > 0 ? successCount / runs24h : 1, p95LatencyMs },
      throughput,
    };
  }),

  streamFeed: protectedProcedure.input(streamFeedInput).subscription(({ input, ctx }) => {
    const orgId = ctx.session.user.memberships?.[0]?.organisationId;
    if (!orgId) throw new TRPCError({ code: 'FORBIDDEN' });

    return observable<{
      id: string;
      ts: string;
      status: 'ok' | 'warn' | 'error';
      message: string;
    }>((emit) => {
      let lastSeen = new Date();

      const poll = async () => {
        try {
          const runs = await ctx.prisma.agentRun.findMany({
            where: {
              agentId: input.agentId,
              organisationId: orgId,
              ts: { gt: lastSeen },
            },
            orderBy: { ts: 'asc' },
            take: 50,
            select: {
              id: true,
              ts: true,
              status: true,
              trigger: true,
              latencyMs: true,
              error: true,
            },
          });

          for (const run of runs) {
            const feedStatus =
              run.status === 'success' ? 'ok' :
              run.status === 'failed' || run.status === 'timed_out' ? 'error' :
              'warn';

            const detail = run.error
              ? run.error
              : `${run.latencyMs}ms via ${run.trigger}`;

            emit.next({
              id: run.id,
              ts: run.ts.toISOString(),
              status: feedStatus,
              message: `${run.status} — ${detail}`,
            });
          }

          if (runs.length > 0) {
            lastSeen = runs[runs.length - 1]!.ts;
          }
        } catch {
          // Swallow DB errors — poll will retry next interval.
        }
      };

      // Initial fetch to catch up on recent runs.
      void poll();
      const interval = setInterval(poll, 3000);
      return () => clearInterval(interval);
    });
  }),

  getWeeklyReport: protectedProcedure.input(weeklyReportInput).query(async ({ input, ctx }) => {
    const membership = ctx.session.user.memberships?.[0];
    if (!membership) throw new TRPCError({ code: 'FORBIDDEN' });

    const orgId = membership.organisationId;
    const weekStart = input.weekStart ? new Date(input.weekStart) : new Date(Date.now() - 7 * 86400000);

    const report = await ctx.prisma.weeklyReport.findFirst({
      where: { organisationId: orgId, weekStart: { lte: weekStart } },
      orderBy: { weekStart: 'desc' },
    });

    if (report) {
      const prevReport = await ctx.prisma.weeklyReport.findFirst({
        where: { organisationId: orgId, weekStart: { lt: report.weekStart } },
        orderBy: { weekStart: 'desc' },
      });

      const hoursTrend = prevReport ? pctChange(Number(report.hoursSaved), Number(prevReport.hoursSaved)) : 0;
      const costTrend = prevReport ? pctChange(Number(report.costReducedUsd), Number(prevReport.costReducedUsd)) : 0;

      return {
        range: { start: report.weekStart.toISOString().slice(0, 10), end: report.weekEnd.toISOString().slice(0, 10) },
        hoursSaved: Number(report.hoursSaved),
        hoursSavedTrendPct: hoursTrend,
        costReducedUsd: Number(report.costReducedUsd),
        costReducedTrendPct: costTrend,
        pipelines: (report.pipelinesJson as Array<Record<string, unknown>>) as Array<{
          name: string;
          hoursSaved: number;
          tasks: number;
          successRate: number;
          accent: 'accent' | 'glow' | 'amber';
        }>,
      };
    }

    const weekStartMs = weekStart.getTime();
    const prevWeekStart = new Date(weekStartMs - 7 * 86400000);

    const [agents, prevRunsCount] = await Promise.all([
      ctx.prisma.agent.findMany({
        where: { organisationId: orgId, deletedAt: null },
        include: { runs: { where: { ts: { gte: weekStart } } } },
      }),
      ctx.prisma.agentRun.count({
        where: { organisationId: orgId, ts: { gte: prevWeekStart, lt: weekStart }, agent: { deletedAt: null } },
      }),
    ]);

    const pipelines = agents.map((agent, i) => {
      const successCount = agent.runs.filter((r) => r.status === 'success').length;
      return {
        name: agent.name,
        hoursSaved: Math.round((agent.runs.length * 2.5 / 60) * 10) / 10,
        tasks: agent.runs.length,
        successRate: agent.runs.length > 0 ? successCount / agent.runs.length : 1,
        accent: (['accent', 'glow', 'amber'] as const)[i % 3],
      };
    });

    const totalHours = pipelines.reduce((s, p) => s + p.hoursSaved, 0);
    const totalCost = totalHours * 40;
    const prevHours = Math.round((prevRunsCount * 2.5) / 60 * 10) / 10;
    const prevCost = prevHours * 40;

    return {
      range: weekRange(),
      hoursSaved: Math.round(totalHours * 10) / 10,
      hoursSavedTrendPct: pctChange(totalHours, prevHours),
      costReducedUsd: Math.round(totalCost),
      costReducedTrendPct: pctChange(totalCost, prevCost),
      pipelines,
    };
  }),

  listAlerts: protectedProcedure.input(listAlertsInput).query(async ({ input, ctx }) => {
    const membership = ctx.session.user.memberships?.[0];
    if (!membership) throw new TRPCError({ code: 'FORBIDDEN' });

    const orgId = membership.organisationId;
    const { cursor, limit = 20 } = input;

    const mapAlert = (a: { id: string; ts: Date; severity: string; title: string; body: string; read: boolean }) => ({
      id: a.id,
      ts: a.ts.toISOString(),
      severity: toAlertSeverity(a.severity),
      title: a.title,
      body: a.body,
      read: a.read,
    });

    if (cursor) {
      const earlier = await ctx.prisma.alert.findMany({
        where: { organisationId: orgId },
        orderBy: { ts: 'desc' },
        take: limit,
        skip: 1,
        cursor: { id: cursor },
      });
      const nextCursor = earlier.length === limit ? earlier[earlier.length - 1]!.id : null;
      return { today: [], earlier: earlier.map(mapAlert), nextCursor };
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [todayAlerts, earlierAlerts] = await Promise.all([
      ctx.prisma.alert.findMany({
        where: { organisationId: orgId, ts: { gte: todayStart } },
        orderBy: { ts: 'desc' },
        take: 100,
      }),
      ctx.prisma.alert.findMany({
        where: { organisationId: orgId, ts: { lt: todayStart } },
        orderBy: { ts: 'desc' },
        take: limit,
      }),
    ]);

    const nextCursor = earlierAlerts.length === limit ? earlierAlerts[earlierAlerts.length - 1]!.id : null;
    return { today: todayAlerts.map(mapAlert), earlier: earlierAlerts.map(mapAlert), nextCursor };
  }),

  markAlertRead: protectedProcedure.input(markAlertReadInput).mutation(async ({ input, ctx }) => {
    const membership = ctx.session.user.memberships?.[0];
    if (!membership) throw new TRPCError({ code: 'FORBIDDEN' });

    const alert = await ctx.prisma.alert.findFirst({
      where: { id: input.alertId, organisationId: membership.organisationId },
    });
    if (!alert) throw new TRPCError({ code: 'NOT_FOUND' });

    await ctx.prisma.alert.update({ where: { id: input.alertId }, data: { read: true } });
    return { ok: true as const };
  }),

  getSettings: protectedProcedure.query(async ({ ctx }) => {
    const membership = ctx.session.user.memberships?.[0];
    if (!membership) throw new TRPCError({ code: 'FORBIDDEN', message: 'No workspace membership.' });

    const org = await ctx.prisma.organisation.findUnique({
      where: { id: membership.organisationId },
      select: { name: true, plan: true },
    });
    if (!org) throw new TRPCError({ code: 'NOT_FOUND', message: 'Organisation not found.' });

    return {
      user: {
        email: ctx.session.user.email ?? '',
        name:  ctx.session.user.name  ?? '',
      },
      role:         membership.role,           // OWNER | ADMIN | MEMBER
      organisation: { name: org.name, plan: org.plan },
    };
  }),
});
