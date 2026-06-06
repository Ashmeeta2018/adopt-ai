import { describe, expect, it, vi } from 'vitest';
import { TRPCError } from '@trpc/server';

import { portalRouter } from '@/lib/trpc/routers/portal';
import type { TrpcContext } from '@/lib/trpc/context';

// ── Stable UUIDs for test data ────────────────────────────────
// tRPC input schemas use z.string().cuid2().or(z.string().uuid())
// so IDs in tRPC *inputs* must be valid UUIDs (or cuid2s).
const AGENT_ID = '11111111-0000-4000-8000-000000000001';
const AGENT_ID_2 = '11111111-0000-4000-8000-000000000002';
const ALERT_ID = '22222222-0000-4000-8000-000000000001';
const ORG_ID = '33333333-0000-4000-8000-000000000001';
const USER_ID = '44444444-0000-4000-8000-000000000001';

// ── Prisma mock factory ───────────────────────────────────────
function makePrisma(overrides: Partial<ReturnType<typeof mockPrisma>> = {}) {
  return { ...mockPrisma(), ...overrides };
}

function mockPrisma() {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 86_400_000);

  const sampleAgents = [
    {
      id: AGENT_ID,
      slug: 'intake-agent-v4',
      name: 'intake-agent-v4',
      description: 'Routes inbound carrier emails.',
      status: 'RUNNING',
      runs: [{ ts: now, latencyMs: 120 }],
      _count: { runs: 42 },
    },
    {
      id: AGENT_ID_2,
      slug: 'invoice-agent-v2',
      name: 'invoice-agent-v2',
      description: 'Extracts invoices.',
      status: 'RUNNING',
      runs: [],
      _count: { runs: 0 },
    },
  ];

  return {
    agent: {
      findMany: vi.fn().mockResolvedValue(sampleAgents),
      findFirst: vi.fn().mockResolvedValue({
        ...sampleAgents[0],
        runs: [
          { ts: now, latencyMs: 120, status: 'success' },
          { ts: yesterday, latencyMs: 200, status: 'success' },
          { ts: yesterday, latencyMs: 88, status: 'error' },
        ],
      }),
    },
    alert: {
      count: vi.fn().mockResolvedValue(3),
      findMany: vi.fn().mockResolvedValue([
        {
          id: ALERT_ID,
          ts: now,
          severity: 'OPS',
          title: 'Throughput spike',
          body: 'Alert body',
          read: false,
          organisationId: ORG_ID,
          userId: USER_ID,
        },
      ]),
      findFirst: vi.fn().mockResolvedValue({
        id: ALERT_ID,
        ts: now,
        severity: 'OPS',
        title: 'Throughput spike',
        body: 'Alert body',
        read: false,
        organisationId: ORG_ID,
      }),
      update: vi.fn().mockResolvedValue({ id: ALERT_ID, read: true }),
    },
    weeklyReport: {
      findFirst: vi.fn().mockResolvedValue(null),
    },
  };
}

// ── Session helper ────────────────────────────────────────────
const authenticatedSession = (name = 'Maya'): TrpcContext['session'] => ({
  user: {
    id: USER_ID,
    name,
    email: 'maya@apex.example',
    image: null,
    memberships: [{ organisationId: ORG_ID, role: 'OWNER' }],
  },
  expires: new Date(Date.now() + 86_400_000).toISOString(),
});

function authenticatedCaller(prismaOverrides: Partial<ReturnType<typeof mockPrisma>> = {}) {
  return portalRouter.createCaller({
    session: authenticatedSession(),
    prisma: makePrisma(prismaOverrides) as never,
    ip: '127.0.0.1',
  });
}

function unauthCaller() {
  return portalRouter.createCaller({
    session: null,
    prisma: makePrisma() as never,
    ip: '127.0.0.1',
  });
}

/** Helper: assert a tRPC procedure throws a specific error code. */
async function expectTRPCError(
  call: Promise<unknown>,
  code: TRPCError['code'],
) {
  try {
    await call;
    throw new Error('Expected a TRPCError but the call resolved.');
  } catch (err) {
    if (err instanceof TRPCError) {
      expect(err.code).toBe(code);
    } else {
      throw err;
    }
  }
}

// ── getDashboard ──────────────────────────────────────────────
describe('portalRouter.getDashboard', () => {
  it('returns greeting and agent list for authenticated user', async () => {
    const result = await authenticatedCaller().getDashboard();
    expect(result.greeting).toMatch(/Maya/);
    expect(result.agents).toHaveLength(2);
    expect(result.liveAgents).toBe(2); // both RUNNING
    expect(result.openAlerts).toBe(3);
  });

  it('weekRange has start before end', async () => {
    const result = await authenticatedCaller().getDashboard();
    expect(new Date(result.weekRange.start).getTime()).toBeLessThan(
      new Date(result.weekRange.end).getTime(),
    );
  });

  it('maps agent status to lowercase', async () => {
    const result = await authenticatedCaller().getDashboard();
    for (const a of result.agents) {
      expect(a.status).toMatch(/^(running|queued|error|paused)$/);
    }
  });

  it('throws UNAUTHORIZED for unauthenticated caller', async () => {
    await expectTRPCError(unauthCaller().getDashboard(), 'UNAUTHORIZED');
  });

  it('throws FORBIDDEN when user has no membership', async () => {
    const caller = portalRouter.createCaller({
      session: {
        user: {
          id: USER_ID,
          name: 'NoOrg',
          email: 'none@test.com',
          image: null,
          memberships: [],
        },
        expires: new Date(Date.now() + 86_400_000).toISOString(),
      },
      prisma: makePrisma() as never,
      ip: null,
    });
    await expectTRPCError(caller.getDashboard(), 'FORBIDDEN');
  });
});

// ── getAgent ──────────────────────────────────────────────────
describe('portalRouter.getAgent', () => {
  it('returns agent details with metrics', async () => {
    const result = await authenticatedCaller().getAgent({ agentId: AGENT_ID });
    expect(result.agent.id).toBe(AGENT_ID);
    expect(result.metrics.tasks24h).toBeGreaterThanOrEqual(0);
    expect(result.metrics.successRate).toBeGreaterThanOrEqual(0);
    expect(result.metrics.successRate).toBeLessThanOrEqual(1);
  });

  it('builds throughput buckets from runs', async () => {
    const result = await authenticatedCaller().getAgent({ agentId: AGENT_ID });
    expect(Array.isArray(result.throughput)).toBe(true);
  });

  it('throws NOT_FOUND when agent does not exist', async () => {
    const caller = authenticatedCaller({
      agent: {
        findMany: vi.fn(),
        findFirst: vi.fn().mockResolvedValue(null),
      },
    });
    await expectTRPCError(caller.getAgent({ agentId: AGENT_ID }), 'NOT_FOUND');
  });

  it('throws UNAUTHORIZED for unauthenticated caller', async () => {
    await expectTRPCError(unauthCaller().getAgent({ agentId: AGENT_ID }), 'UNAUTHORIZED');
  });
});

// ── getWeeklyReport ───────────────────────────────────────────
describe('portalRouter.getWeeklyReport', () => {
  it('synthesises report from agent runs when no stored report exists', async () => {
    const result = await authenticatedCaller().getWeeklyReport({});
    expect(result.hoursSaved).toBeGreaterThanOrEqual(0);
    expect(result.pipelines).toHaveLength(2);
    expect(result.range.start).toBeTruthy();
    expect(result.range.end).toBeTruthy();
  });

  it('returns stored report when one exists', async () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 86_400_000);
    const storedReport = {
      weekStart: weekAgo,
      weekEnd: now,
      hoursSaved: 22.5,
      costReducedUsd: 918,
      pipelinesJson: [
        { name: 'Intake', hoursSaved: 15, tasks: 120, successRate: 0.99, accent: 'accent' },
      ],
    };
    const caller = authenticatedCaller({
      weeklyReport: { findFirst: vi.fn().mockResolvedValue(storedReport) },
    });
    const result = await caller.getWeeklyReport({});
    expect(result.hoursSaved).toBe(22.5);
    expect(result.pipelines).toHaveLength(1);
  });

  it('throws UNAUTHORIZED for unauthenticated caller', async () => {
    await expectTRPCError(unauthCaller().getWeeklyReport({}), 'UNAUTHORIZED');
  });
});

// ── listAlerts ────────────────────────────────────────────────
describe('portalRouter.listAlerts', () => {
  it('returns today and earlier alert arrays', async () => {
    const result = await authenticatedCaller().listAlerts({});
    expect(Array.isArray(result.today)).toBe(true);
    expect(Array.isArray(result.earlier)).toBe(true);
    expect(result.nextCursor).toBeNull();
  });

  it('throws UNAUTHORIZED for unauthenticated caller', async () => {
    await expectTRPCError(unauthCaller().listAlerts({}), 'UNAUTHORIZED');
  });
});

// ── markAlertRead ─────────────────────────────────────────────
describe('portalRouter.markAlertRead', () => {
  it('returns ok:true for a valid alertId', async () => {
    const result = await authenticatedCaller().markAlertRead({ alertId: ALERT_ID });
    expect(result.ok).toBe(true);
  });

  it('calls prisma.alert.update with read:true when alert exists', async () => {
    const prismaInstance = makePrisma();
    const caller = portalRouter.createCaller({
      session: authenticatedSession(),
      prisma: prismaInstance as never,
      ip: null,
    });
    await caller.markAlertRead({ alertId: ALERT_ID });
    expect(prismaInstance.alert.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ read: true }),
      }),
    );
  });

  it('throws NOT_FOUND when alert does not belong to org', async () => {
    const caller = authenticatedCaller({
      alert: {
        ...makePrisma().alert,
        findFirst: vi.fn().mockResolvedValue(null),
      },
    });
    await expectTRPCError(caller.markAlertRead({ alertId: ALERT_ID }), 'NOT_FOUND');
  });

  it('throws UNAUTHORIZED for unauthenticated caller', async () => {
    await expectTRPCError(unauthCaller().markAlertRead({ alertId: ALERT_ID }), 'UNAUTHORIZED');
  });
});
