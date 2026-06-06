import {
  agentIdInput,
  agentRunsInput,
  togglePauseInput,
  workflowExecutionsInput,
  workflowIdInput,
} from '@adopt-ai/api-contract';
import { TRPCError } from '@trpc/server';

import { protectedProcedure, router } from '../trpc';

export const agentsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const membership = ctx.session?.user?.memberships?.[0];
    if (!membership) return [];

    return ctx.prisma.agent.findMany({
      where: { organisationId: membership.organisationId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { runs: true } },
        workflow: { select: { id: true, name: true, status: true } },
      },
    });
  }),

  get: protectedProcedure.input(agentIdInput).query(async ({ input, ctx }) => {
    const membership = ctx.session?.user?.memberships?.[0];
    if (!membership) return null;

    return ctx.prisma.agent.findFirst({
      where: { id: input.agentId, organisationId: membership.organisationId, deletedAt: null },
      include: {
        workflow: {
          select: { id: true, name: true, status: true, nodesJson: true, edgesJson: true },
        },
        runs: { take: 10, orderBy: { ts: 'desc' } },
      },
    });
  }),

  runs: protectedProcedure.input(agentRunsInput).query(async ({ input, ctx }) => {
    const membership = ctx.session?.user?.memberships?.[0];
    if (!membership) return { items: [], nextCursor: null };

    const items = await ctx.prisma.agentRun.findMany({
      where: {
        agentId: input.agentId,
        organisationId: membership.organisationId,
        ...(input.cursor ? { ts: { lt: new Date(input.cursor) } } : {}),
      },
      orderBy: { ts: 'desc' },
      take: input.limit + 1,
    });

    let nextCursor: string | null = null;
    if (items.length > input.limit) {
      const next = items.pop();
      nextCursor = next?.ts?.toISOString() ?? null;
    }

    return { items, nextCursor };
  }),

  togglePause: protectedProcedure.input(togglePauseInput).mutation(async ({ input, ctx }) => {
    const membership = ctx.session?.user?.memberships?.[0];
    if (!membership || membership.role === 'MEMBER') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Insufficient permissions.',
      });
    }

    return ctx.prisma.agent.update({
      where: { id: input.agentId },
      data: { status: input.paused ? 'PAUSED' : 'RUNNING' },
    });
  }),
});

export const workflowsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const membership = ctx.session?.user?.memberships?.[0];
    if (!membership) return [];

    return ctx.prisma.workflow.findMany({
      where: { organisationId: membership.organisationId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { agents: true, executions: true } },
      },
    });
  }),

  get: protectedProcedure.input(workflowIdInput).query(async ({ input, ctx }) => {
    const membership = ctx.session?.user?.memberships?.[0];
    if (!membership) return null;

    return ctx.prisma.workflow.findFirst({
      where: {
        id: input.workflowId,
        organisationId: membership.organisationId,
        deletedAt: null,
      },
      include: {
        agents: { select: { id: true, name: true, status: true } },
        executions: { take: 10, orderBy: { startedAt: 'desc' } },
      },
    });
  }),

  executions: protectedProcedure
    .input(workflowExecutionsInput)
    .query(async ({ input, ctx }) => {
      const membership = ctx.session?.user?.memberships?.[0];
      if (!membership) return { items: [], nextCursor: null };

      const items = await ctx.prisma.workflowExecution.findMany({
        where: {
          workflowId: input.workflowId,
          ...(input.cursor ? { startedAt: { lt: new Date(input.cursor) } } : {}),
        },
        orderBy: { startedAt: 'desc' },
        take: input.limit + 1,
      });

      let nextCursor: string | null = null;
      if (items.length > input.limit) {
        const next = items.pop();
        nextCursor = next?.startedAt?.toISOString() ?? null;
      }

      return { items, nextCursor };
    }),
});
