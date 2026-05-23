import { describe, expect, it, vi } from 'vitest';
import { TRPCError } from '@trpc/server';

import { agentsRouter, workflowsRouter } from '@/lib/trpc/routers/agents';
import type { TrpcContext } from '@/lib/trpc/context';

// Contract output types — used as explicit annotations on selected test results
// so TypeScript verifies the router's return shape matches the published types.
// If a contract type changes and the router or mock drifts, these catch it.
import type {
  AgentGetOutput,
  AgentListItem,
  PaginatedExecutionsOutput,
  PaginatedRunsOutput,
  WorkflowGetOutput,
  WorkflowListItem,
} from '@adopt-ai/api-contract';

// ── Stable UUIDs (pass cuid2().or(uuid()) validation) ─────────
const AGENT_ID = '11111111-0000-4000-8000-000000000001';
const WF_ID = '22222222-0000-4000-8000-000000000001';
const RUN_ID_1 = '33333333-0000-4000-8000-000000000001';
const RUN_ID_2 = '33333333-0000-4000-8000-000000000002';
const EXEC_ID = '44444444-0000-4000-8000-000000000001';
const ORG_ID = '55555555-0000-4000-8000-000000000001';
const USER_ID = '66666666-0000-4000-8000-000000000001';

// ── Prisma mock ───────────────────────────────────────────────
const now = new Date();
const yesterday = new Date(now.getTime() - 86_400_000);

const sampleAgent = {
  id: AGENT_ID,
  slug: 'intake-agent-v4',
  name: 'intake-agent-v4',
  description: 'Routes inbound carrier emails.',
  status: 'RUNNING',
  organisationId: ORG_ID,
  workflowId: WF_ID,
  deletedAt: null,
  createdAt: yesterday,
  updatedAt: now,
  _count: { runs: 55 },
  workflow: { id: WF_ID, name: 'Inbound Carrier Coordination', status: 'ACTIVE' },
  runs: [
    { id: RUN_ID_1, ts: now, latencyMs: 120, status: 'success', message: 'Routed' },
    { id: RUN_ID_2, ts: yesterday, latencyMs: 200, status: 'success', message: 'Routed' },
  ],
};

const sampleWorkflow = {
  id: WF_ID,
  organisationId: ORG_ID,
  name: 'Inbound Carrier Coordination',
  status: 'ACTIVE',
  version: 4,
  nodesJson: [],
  edgesJson: [],
  deletedAt: null,
  createdAt: yesterday,
  updatedAt: now,
  _count: { agents: 1, executions: 12 },
  agents: [{ id: AGENT_ID, name: 'intake-agent-v4', status: 'RUNNING' }],
  executions: [
    { id: EXEC_ID, startedAt: now, completedAt: now, status: 'COMPLETED', error: null },
  ],
};

function makePrisma(overrides: Record<string, unknown> = {}) {
  return {
    agent: {
      findMany: vi.fn().mockResolvedValue([sampleAgent]),
      findFirst: vi.fn().mockResolvedValue(sampleAgent),
      update: vi.fn().mockResolvedValue({ ...sampleAgent, status: 'PAUSED' }),
    },
    agentRun: {
      findMany: vi.fn().mockResolvedValue(sampleAgent.runs),
    },
    workflow: {
      findMany: vi.fn().mockResolvedValue([sampleWorkflow]),
      findFirst: vi.fn().mockResolvedValue(sampleWorkflow),
    },
    workflowExecution: {
      findMany: vi.fn().mockResolvedValue(sampleWorkflow.executions),
    },
    ...overrides,
  };
}

type Session = NonNullable<TrpcContext['session']>;

function ownerSession(): Session {
  return {
    user: {
      id: USER_ID,
      name: 'Maya',
      email: 'maya@apex.example',
      image: null,
      memberships: [{ organisationId: ORG_ID, role: 'OWNER' }],
    },
    expires: new Date(Date.now() + 86_400_000).toISOString(),
  };
}

function adminSession(): Session {
  return {
    ...ownerSession(),
    user: { ...ownerSession().user, memberships: [{ organisationId: ORG_ID, role: 'ADMIN' }] },
  };
}

function memberSession(): Session {
  return {
    ...ownerSession(),
    user: { ...ownerSession().user, memberships: [{ organisationId: ORG_ID, role: 'MEMBER' }] },
  };
}

function noMembershipSession(): Session {
  return {
    ...ownerSession(),
    user: { ...ownerSession().user, memberships: [] },
  };
}

/** Assert a tRPC procedure throws a specific error code. */
async function expectTRPCError(call: Promise<unknown>, code: TRPCError['code']) {
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

function agentsCaller(sessionOverride?: Session | null, prismaOverrides: Record<string, unknown> = {}) {
  return agentsRouter.createCaller({
    session: sessionOverride === undefined ? ownerSession() : sessionOverride,
    prisma: makePrisma(prismaOverrides) as never,
    ip: '127.0.0.1',
  });
}

function workflowsCaller(sessionOverride?: Session | null, prismaOverrides: Record<string, unknown> = {}) {
  return workflowsRouter.createCaller({
    session: sessionOverride === undefined ? ownerSession() : sessionOverride,
    prisma: makePrisma(prismaOverrides) as never,
    ip: '127.0.0.1',
  });
}

// ── agentsRouter.list ─────────────────────────────────────────
describe('agentsRouter.list', () => {
  it('returns agents for authenticated owner', async () => {
    // Type annotation verifies the router return shape matches the contract.
    const result: AgentListItem[] = (await agentsCaller().list()) as AgentListItem[];
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe(AGENT_ID);
  });

  it('returns empty array for user with no membership', async () => {
    const result = await agentsCaller(noMembershipSession()).list();
    expect(result).toEqual([]);
  });

  it('throws UNAUTHORIZED when unauthenticated', async () => {
    await expectTRPCError(agentsCaller(null).list(), 'UNAUTHORIZED');
  });

  it('queries only non-deleted agents for the org', async () => {
    const prisma = makePrisma();
    await agentsCaller(undefined, prisma).list();
    expect(vi.mocked((prisma as ReturnType<typeof makePrisma>).agent.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ organisationId: ORG_ID, deletedAt: null }),
      }),
    );
  });
});

// ── agentsRouter.get ──────────────────────────────────────────
describe('agentsRouter.get', () => {
  it('returns a single agent with its workflow', async () => {
    const result: AgentGetOutput | null = (await agentsCaller().get({ agentId: AGENT_ID })) as AgentGetOutput | null;
    expect(result?.id).toBe(AGENT_ID);
    expect(result?.workflow?.id).toBe(WF_ID);
  });

  it('returns null when agent not found', async () => {
    const result = await agentsCaller(undefined, {
      agent: { ...makePrisma().agent, findFirst: vi.fn().mockResolvedValue(null) },
    }).get({ agentId: AGENT_ID });
    expect(result).toBeNull();
  });

  it('throws UNAUTHORIZED when unauthenticated', async () => {
    await expectTRPCError(agentsCaller(null).get({ agentId: AGENT_ID }), 'UNAUTHORIZED');
  });
});

// ── agentsRouter.runs ─────────────────────────────────────────
describe('agentsRouter.runs', () => {
  it('returns runs with pagination — nextCursor is null for small sets', async () => {
    // Double-cast needed: Prisma's Decimal for costUsd is structurally incompatible
    // with the contract's `string | number` union until the router serialises it.
    const result = (await agentsCaller().runs({ agentId: AGENT_ID, limit: 50 })) as unknown as PaginatedRunsOutput;
    expect(Array.isArray(result.items)).toBe(true);
    expect(result.nextCursor).toBeNull(); // 2 items < limit 50
  });

  it('sets nextCursor when there are more items than the limit', async () => {
    const manyRuns = Array.from({ length: 11 }, (_, i) => ({
      id: `3${i}333333-0000-4000-8000-000000000001`,
      ts: new Date(now.getTime() - i * 1000),
      latencyMs: 100,
      status: 'success',
      message: `Run ${i}`,
    }));
    const result = await agentsCaller(undefined, {
      agentRun: { findMany: vi.fn().mockResolvedValue(manyRuns) },
    }).runs({ agentId: AGENT_ID, limit: 10 });
    expect(result.nextCursor).toBeTruthy();
    expect(result.items).toHaveLength(10);
  });

  it('throws UNAUTHORIZED when unauthenticated', async () => {
    await expectTRPCError(agentsCaller(null).runs({ agentId: AGENT_ID, limit: 10 }), 'UNAUTHORIZED');
  });
});

// ── agentsRouter.togglePause ──────────────────────────────────
describe('agentsRouter.togglePause', () => {
  it('allows OWNER to pause an agent', async () => {
    const prisma = makePrisma();
    await agentsCaller(undefined, prisma).togglePause({ agentId: AGENT_ID, paused: true });
    expect(vi.mocked((prisma as ReturnType<typeof makePrisma>).agent.update)).toHaveBeenCalledWith(
      expect.objectContaining({ data: { status: 'PAUSED' } }),
    );
  });

  it('allows ADMIN to unpause an agent', async () => {
    const prisma = makePrisma();
    await agentsCaller(adminSession(), prisma).togglePause({ agentId: AGENT_ID, paused: false });
    expect(vi.mocked((prisma as ReturnType<typeof makePrisma>).agent.update)).toHaveBeenCalledWith(
      expect.objectContaining({ data: { status: 'RUNNING' } }),
    );
  });

  it('throws FORBIDDEN for MEMBER role', async () => {
    await expectTRPCError(
      agentsCaller(memberSession()).togglePause({ agentId: AGENT_ID, paused: true }),
      'FORBIDDEN',
    );
  });

  it('throws UNAUTHORIZED when unauthenticated', async () => {
    await expectTRPCError(
      agentsCaller(null).togglePause({ agentId: AGENT_ID, paused: true }),
      'UNAUTHORIZED',
    );
  });
});

// ── workflowsRouter.list ──────────────────────────────────────
describe('workflowsRouter.list', () => {
  it('returns workflows for authenticated user', async () => {
    const result: WorkflowListItem[] = (await workflowsCaller().list()) as WorkflowListItem[];
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe(WF_ID);
  });

  it('returns empty array for user with no membership', async () => {
    const result = await workflowsCaller(noMembershipSession()).list();
    expect(result).toEqual([]);
  });

  it('throws UNAUTHORIZED when unauthenticated', async () => {
    await expectTRPCError(workflowsCaller(null).list(), 'UNAUTHORIZED');
  });
});

// ── workflowsRouter.get ───────────────────────────────────────
describe('workflowsRouter.get', () => {
  it('returns a workflow with agents and executions', async () => {
    const result: WorkflowGetOutput | null = (await workflowsCaller().get({ workflowId: WF_ID })) as WorkflowGetOutput | null;
    expect(result?.id).toBe(WF_ID);
    expect(result?.agents).toHaveLength(1);
    expect(result?.executions).toHaveLength(1);
  });

  it('returns null for a non-existent workflow', async () => {
    const result = await workflowsCaller(undefined, {
      workflow: { ...makePrisma().workflow, findFirst: vi.fn().mockResolvedValue(null) },
    }).get({ workflowId: WF_ID });
    expect(result).toBeNull();
  });

  it('throws UNAUTHORIZED when unauthenticated', async () => {
    await expectTRPCError(workflowsCaller(null).get({ workflowId: WF_ID }), 'UNAUTHORIZED');
  });
});

// ── workflowsRouter.executions ────────────────────────────────
describe('workflowsRouter.executions', () => {
  it('returns executions with pagination — nextCursor null for small set', async () => {
    const result: PaginatedExecutionsOutput = (await workflowsCaller().executions({ workflowId: WF_ID, limit: 10 })) as PaginatedExecutionsOutput;
    expect(Array.isArray(result.items)).toBe(true);
    expect(result.nextCursor).toBeNull();
  });

  it('sets nextCursor when more items exist than the limit', async () => {
    const manyExec = Array.from({ length: 11 }, (_, i) => ({
      id: `4${i}444444-0000-4000-8000-000000000001`,
      startedAt: new Date(now.getTime() - i * 60_000),
      completedAt: new Date(now.getTime() - i * 60_000 + 1000),
      status: 'COMPLETED',
      error: null,
    }));
    const result = await workflowsCaller(undefined, {
      workflowExecution: { findMany: vi.fn().mockResolvedValue(manyExec) },
    }).executions({ workflowId: WF_ID, limit: 10 });
    expect(result.nextCursor).toBeTruthy();
    expect(result.items).toHaveLength(10);
  });

  it('throws UNAUTHORIZED when unauthenticated', async () => {
    await expectTRPCError(
      workflowsCaller(null).executions({ workflowId: WF_ID, limit: 10 }),
      'UNAUTHORIZED',
    );
  });
});
