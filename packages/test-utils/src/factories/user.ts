export interface MockUser {
  id: string;
  email: string;
  emailVerified: Date | null;
  name: string | null;
  image: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockOrganisation {
  id: string;
  name: string;
  slug: string;
  plan: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockMembership {
  id: string;
  userId: string;
  organisationId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  createdAt: Date;
}

export type MockAgentKind =
  | 'INBOX_TRIAGE'
  | 'DOCUMENT_EXTRACTION'
  | 'SUPPORT_ROUTING'
  | 'CUSTOM';

export type MockAgentStatus = 'RUNNING' | 'QUEUED' | 'ERROR' | 'PAUSED';

export interface MockAgent {
  id: string;
  organisationId: string;
  slug: string;
  name: string;
  description: string;
  kind: MockAgentKind;
  status: MockAgentStatus;
  systemPrompt: string | null;
  modelConfig: Record<string, unknown> | null;
  scheduleJson: Record<string, unknown> | null;
  toolsJson: Record<string, unknown> | null;
  workflowId: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type MockAgentRunStatus =
  | 'queued'
  | 'running'
  | 'success'
  | 'failed'
  | 'cancelled'
  | 'timed_out';

export interface MockAgentRun {
  id: string;
  agentId: string;
  organisationId: string;
  trigger: string;
  status: MockAgentRunStatus;
  inputJson: Record<string, unknown> | null;
  outputJson: Record<string, unknown> | null;
  tokenInput: number;
  tokenOutput: number;
  costUsd: string;
  latencyMs: number;
  error: string | null;
  ts: Date;
  completedAt: Date | null;
}

export type MockAlertSeverity = 'OPS' | 'DRIFT' | 'TEAM';

export interface MockAlert {
  id: string;
  organisationId: string;
  userId: string | null;
  ts: Date;
  severity: MockAlertSeverity;
  title: string;
  body: string;
  read: boolean;
}

export interface MockWeeklyReport {
  id: string;
  organisationId: string;
  weekStart: Date;
  weekEnd: Date;
  hoursSaved: string;
  costReducedUsd: string;
  pipelinesJson: Record<string, unknown>;
  createdAt: Date;
}

export interface MockSession {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
}

function cuid(): string {
  const segment = () => Math.random().toString(36).slice(2, 10);
  return `cl${segment()}${segment()}${segment()}`;
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

export function createUser(overrides: Partial<MockUser> = {}): MockUser {
  const id = overrides.id ?? cuid();
  return {
    id,
    email: overrides.email ?? `user-${id.slice(0, 8)}@example.com`,
    emailVerified: overrides.emailVerified ?? new Date(),
    name: overrides.name ?? 'Test User',
    image: overrides.image ?? null,
    deletedAt: overrides.deletedAt ?? null,
    createdAt: overrides.createdAt ?? daysAgo(30),
    updatedAt: overrides.updatedAt ?? new Date(),
    ...overrides,
  };
}

export function createOrganisation(overrides: Partial<MockOrganisation> = {}): MockOrganisation {
  const id = overrides.id ?? cuid();
  return {
    id,
    name: overrides.name ?? 'Test Organisation',
    slug: overrides.slug ?? `test-org-${id.slice(0, 8)}`,
    plan: overrides.plan ?? 'spark',
    createdAt: overrides.createdAt ?? daysAgo(60),
    updatedAt: overrides.updatedAt ?? new Date(),
    ...overrides,
  };
}

export function createMembership(overrides: Partial<MockMembership> = {}): MockMembership {
  const userId = overrides.userId ?? createUser().id;
  const organisationId = overrides.organisationId ?? createOrganisation().id;
  return {
    id: overrides.id ?? cuid(),
    userId,
    organisationId,
    role: overrides.role ?? 'MEMBER',
    createdAt: overrides.createdAt ?? daysAgo(30),
    ...overrides,
  };
}

export function createAgent(overrides: Partial<MockAgent> = {}): MockAgent {
  const id = overrides.id ?? cuid();
  const organisationId = overrides.organisationId ?? createOrganisation().id;
  return {
    id,
    organisationId,
    slug: overrides.slug ?? `test-agent-${id.slice(0, 8)}`,
    name: overrides.name ?? 'Test Agent',
    description: overrides.description ?? 'An agent for testing purposes',
    kind: overrides.kind ?? 'CUSTOM',
    status: overrides.status ?? 'RUNNING',
    systemPrompt: overrides.systemPrompt ?? null,
    modelConfig: overrides.modelConfig ?? null,
    scheduleJson: overrides.scheduleJson ?? null,
    toolsJson: overrides.toolsJson ?? null,
    workflowId: overrides.workflowId ?? null,
    deletedAt: overrides.deletedAt ?? null,
    createdAt: overrides.createdAt ?? daysAgo(14),
    updatedAt: overrides.updatedAt ?? new Date(),
    ...overrides,
  };
}

export function createAgentRun(overrides: Partial<MockAgentRun> = {}): MockAgentRun {
  const id = overrides.id ?? cuid();
  const agentId = overrides.agentId ?? createAgent().id;
  const organisationId = overrides.organisationId ?? createOrganisation().id;
  return {
    id,
    agentId,
    organisationId,
    trigger: overrides.trigger ?? 'manual',
    status: overrides.status ?? 'success',
    inputJson: overrides.inputJson ?? null,
    outputJson: overrides.outputJson ?? null,
    tokenInput: overrides.tokenInput ?? 120,
    tokenOutput: overrides.tokenOutput ?? 450,
    costUsd: overrides.costUsd ?? '0.001200',
    latencyMs: overrides.latencyMs ?? 2300,
    error: overrides.error ?? null,
    ts: overrides.ts ?? daysAgo(1),
    completedAt: overrides.completedAt ?? new Date(),
    ...overrides,
  };
}

export function createAlert(overrides: Partial<MockAlert> = {}): MockAlert {
  const id = overrides.id ?? cuid();
  const organisationId = overrides.organisationId ?? createOrganisation().id;
  return {
    id,
    organisationId,
    userId: overrides.userId ?? null,
    ts: overrides.ts ?? new Date(),
    severity: overrides.severity ?? 'OPS',
    title: overrides.title ?? 'Test Alert',
    body: overrides.body ?? 'This is a test alert body.',
    read: overrides.read ?? false,
    ...overrides,
  };
}

export function createWeeklyReport(overrides: Partial<MockWeeklyReport> = {}): MockWeeklyReport {
  const id = overrides.id ?? cuid();
  const organisationId = overrides.organisationId ?? createOrganisation().id;
  const weekStart = overrides.weekStart ?? daysAgo(7);
  const weekEnd = overrides.weekEnd ?? new Date();
  return {
    id,
    organisationId,
    weekStart,
    weekEnd,
    hoursSaved: overrides.hoursSaved ?? '22.50',
    costReducedUsd: overrides.costReducedUsd ?? '1850.00',
    pipelinesJson: overrides.pipelinesJson ?? {
      pipelines: [
        { name: 'Inbox Triage', hoursSaved: 12.5, tasks: 340, successRate: 0.98 },
        { name: 'Doc Extraction', hoursSaved: 10.0, tasks: 180, successRate: 0.95 },
      ],
    },
    createdAt: overrides.createdAt ?? new Date(),
    ...overrides,
  };
}

export function createSession(overrides: Partial<MockSession> = {}): MockSession {
  const id = overrides.id ?? cuid();
  const userId = overrides.userId ?? createUser().id;
  const expires = new Date();
  expires.setDate(expires.getDate() + 30);
  return {
    id,
    sessionToken: overrides.sessionToken ?? `st_${cuid()}`,
    userId,
    expires: overrides.expires ?? expires,
    ...overrides,
  };
}
