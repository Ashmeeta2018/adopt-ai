/* eslint-disable no-console */
/**
 * Seed script for local development and CI.
 *
 * Strategy:
 *  - Orgs / users / memberships / workflows / agents: upsert (idempotent).
 *  - Runs / executions / alerts / reports: delete-then-create so re-running
 *    the seed always produces a clean, predictable data set.
 */
import {
  AgentKind,
  AgentStatus,
  AlertSeverity,
  PrismaClient,
  Role,
  WorkflowStatus,
  WorkflowTrigger,
} from '@prisma/client';

const prisma = new PrismaClient();

// ── Deterministic pseudo-random helpers ─────────────────────────────────────
// We avoid true Math.random() in the seed so the data set is stable across
// re-runs and the test suite can assert on specific values.

function hash(n: number): number {
  // xorshift32 — simple, fast, deterministic given the same seed
  let x = n ^ 0x12345678;
  x ^= x << 13; x ^= x >> 17; x ^= x << 5;
  return (x >>> 0) / 0xffffffff;
}

function pick<T>(arr: readonly T[], i: number): T {
  return arr[Math.floor(hash(i * 7919) * arr.length)]!;
}

function jitter(base: number, pct: number, i: number): number {
  return Math.max(1, Math.round(base + (hash(i * 3571) - 0.5) * base * pct));
}

/** Spread timestamps over the last `daysBack` days with a recency bias. */
function ago(daysBack: number, fractionFromNow: number): Date {
  return new Date(Date.now() - fractionFromNow * daysBack * 86_400_000);
}

// ── Run factories ────────────────────────────────────────────────────────────

const TRIGGERS = ['event', 'schedule', 'manual', 'webhook'] as const;

function makeRuns(
  agentId: string,
  orgId: string,
  count: number,
  opts: {
    baseLatencyMs: number;
    failRate?: number;
    daysBack?: number;
    triggers?: readonly string[];
    successMessages?: string[];
    failMessages?: string[];
  },
) {
  const {
    baseLatencyMs,
    failRate = 0.04,
    daysBack = 30,
    triggers = TRIGGERS,
    successMessages = ['Completed successfully'],
    failMessages = ['Rate limit — retried', 'Classification timeout', 'Upstream error: 503'],
  } = opts;

  return Array.from({ length: count }, (_, i) => {
    // Recency bias: cube-root distributes more runs closer to now
    const fraction = Math.pow(hash(i * 1009 + agentId.charCodeAt(0)), 0.4);
    const ts = ago(daysBack, fraction);
    const latencyMs = jitter(baseLatencyMs, 0.6, i);

    const h = hash(i * 2017 + agentId.charCodeAt(1));
    const status =
      h < failRate * 0.55 ? 'failed' :
      h < failRate * 0.85 ? 'timed_out' :
      h < failRate        ? 'cancelled' :
      'success';

    const isSuccess = status === 'success';
    const message = isSuccess
      ? pick(successMessages, i)
      : pick(failMessages, i);

    return {
      agentId,
      organisationId: orgId,
      trigger: pick(triggers, i),
      status,
      latencyMs,
      ts,
      completedAt: isSuccess ? new Date(ts.getTime() + latencyMs) : null,
      costUsd: (latencyMs * 0.000012 + hash(i * 6271) * 0.018).toFixed(6),
      tokenInput:  jitter(600,  0.7, i * 3),
      tokenOutput: jitter(280,  0.7, i * 5),
      error: isSuccess ? null : message,
    };
  });
}

function makeWorkflowExecutions(workflowId: string, count: number, failRate = 0.06) {
  const triggers = ['event', 'manual', 'webhook', 'schedule'] as const;
  return Array.from({ length: count }, (_, i) => {
    const fraction = Math.pow(hash(i * 1301 + workflowId.charCodeAt(0)), 0.4);
    const startedAt = ago(30, fraction);
    const durationMs = jitter(2800, 0.7, i);

    const h = hash(i * 4003);
    const status =
      h < failRate * 0.6 ? 'failed' :
      h < failRate        ? 'cancelled' :
      'completed';

    return {
      workflowId,
      status,
      trigger: pick(triggers, i),
      durationMs,
      nodesJson: [],
      error: status === 'failed' ? pick(['Downstream timeout', 'Invalid payload schema', 'Rate limit exceeded'], i) : null,
      startedAt,
      completedAt: status !== 'failed' ? new Date(startedAt.getTime() + durationMs) : null,
    };
  });
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // ── Org ───────────────────────────────────────────────────────────────────

  const apex = await prisma.organisation.upsert({
    where:  { slug: 'apex-regional-logistics' },
    update: {},
    create: { slug: 'apex-regional-logistics', name: 'Apex Regional Logistics', plan: 'lift' },
  });

  // ── Users & memberships ───────────────────────────────────────────────────

  const maya = await prisma.user.upsert({
    where:  { email: 'maya@apex.example' },
    update: {},
    create: { email: 'maya@apex.example', name: 'Maya Lindqvist', emailVerified: new Date() },
  });

  const tomas = await prisma.user.upsert({
    where:  { email: 'tomas@adoptai.com' },
    update: {},
    create: { email: 'tomas@adoptai.com', name: 'Tomas Costa', emailVerified: new Date() },
  });

  for (const [user, role] of [
    [maya,  Role.OWNER],
    [tomas, Role.ADMIN],
  ] as const) {
    await prisma.membership.upsert({
      where:  { userId_organisationId: { userId: user.id, organisationId: apex.id } },
      update: { role },
      create: { userId: user.id, organisationId: apex.id, role },
    });
  }

  // ── Workflows ─────────────────────────────────────────────────────────────

  const intakeWorkflow = await prisma.workflow.upsert({
    where:  { id: 'wf-intake-coordination' },
    update: {},
    create: {
      id:             'wf-intake-coordination',
      organisationId: apex.id,
      name:           'Inbound Carrier Coordination',
      description:    'Reads carrier emails, classifies intent, extracts shipment data, and routes to TMS.',
      version:        4,
      status:         WorkflowStatus.ACTIVE,
      trigger:        WorkflowTrigger.EVENT,
      nodesJson: [
        { id: 'n1', kind: 'trigger',   label: 'New email arrives',      config: { source: 'imap', folder: 'INBOX' } },
        { id: 'n2', kind: 'agent',     label: 'Classify intent',        config: { prompt: 'Classify: urgent, routine, spam, info-request' } },
        { id: 'n3', kind: 'condition', label: 'Is actionable?',         config: { field: 'intent', operator: 'in', values: ['urgent', 'routine'] } },
        { id: 'n4', kind: 'agent',     label: 'Extract shipment data',  config: { prompt: 'Extract: BOL, PO, carrier, dates, origin, destination' } },
        { id: 'n5', kind: 'output',    label: 'Push to TMS',            config: { target: 'tms', format: 'tms-shipment-v2' } },
        { id: 'n6', kind: 'output',    label: 'Archive & log',          config: { target: 'archive', moveTo: 'Processed' } },
      ],
      edgesJson: [
        { id: 'e1', source: 'n1', target: 'n2', kind: 'data' },
        { id: 'e2', source: 'n2', target: 'n3', kind: 'data' },
        { id: 'e3', source: 'n3', target: 'n4', kind: 'control', condition: 'actionable' },
        { id: 'e4', source: 'n3', target: 'n6', kind: 'control', condition: 'not_actionable' },
        { id: 'e5', source: 'n4', target: 'n5', kind: 'data' },
        { id: 'e6', source: 'n5', target: 'n6', kind: 'data' },
      ],
    },
  });

  const invoiceWorkflow = await prisma.workflow.upsert({
    where:  { id: 'wf-invoice-extraction' },
    update: {},
    create: {
      id:             'wf-invoice-extraction',
      organisationId: apex.id,
      name:           'Invoice Data Extraction',
      description:    'Extracts structured data from PDF invoices and posts to QuickBooks.',
      version:        2,
      status:         WorkflowStatus.ACTIVE,
      trigger:        WorkflowTrigger.EVENT,
      nodesJson: [
        { id: 'n1', kind: 'trigger',   label: 'PDF received',          config: { source: 'email-attachment', extensions: ['pdf'] } },
        { id: 'n2', kind: 'agent',     label: 'Extract invoice fields', config: { prompt: 'Extract: vendor, invoice #, date, line items, total, tax' } },
        { id: 'n3', kind: 'transform', label: 'Map to QB format',      config: { mapping: 'quickbooks-invoice-v3' } },
        { id: 'n4', kind: 'output',    label: 'Post to QuickBooks',    config: { target: 'quickbooks', action: 'create-invoice' } },
      ],
      edgesJson: [
        { id: 'e1', source: 'n1', target: 'n2', kind: 'data' },
        { id: 'e2', source: 'n2', target: 'n3', kind: 'data' },
        { id: 'e3', source: 'n3', target: 'n4', kind: 'data' },
      ],
    },
  });

  const supportWorkflow = await prisma.workflow.upsert({
    where:  { id: 'wf-support-triage' },
    update: {},
    create: {
      id:             'wf-support-triage',
      organisationId: apex.id,
      name:           'Support Ticket Triage',
      description:    'Classifies support requests by severity and routes to the correct team.',
      version:        1,
      status:         WorkflowStatus.ACTIVE,
      trigger:        WorkflowTrigger.EVENT,
      nodesJson: [
        { id: 'n1', kind: 'trigger', label: 'Support request received', config: { source: 'email-form' } },
        { id: 'n2', kind: 'agent',   label: 'Classify severity & topic', config: { prompt: 'Classify: critical, high, medium, low. Topic: billing, technical, general' } },
        { id: 'n3', kind: 'agent',   label: 'Suggest response',          config: { prompt: 'Draft a brief acknowledgment and next steps' } },
        { id: 'n4', kind: 'output',  label: 'Create Zendesk ticket',     config: { target: 'zendesk', priority: '{{severity}}', tags: ['{{topic}}', 'ai-triaged'] } },
      ],
      edgesJson: [
        { id: 'e1', source: 'n1', target: 'n2', kind: 'data' },
        { id: 'e2', source: 'n2', target: 'n3', kind: 'data' },
        { id: 'e3', source: 'n3', target: 'n4', kind: 'data' },
      ],
    },
  });

  // ── Agents ────────────────────────────────────────────────────────────────

  const agentDefs = [
    {
      slug:         'intake-agent-v4',
      name:         'intake-agent-v4',
      description:  'Inbound coordination — reads carrier email and routes to the TMS.',
      kind:         AgentKind.INBOX_TRIAGE,
      status:       AgentStatus.RUNNING,
      systemPrompt: 'You are an inbound logistics coordinator. Read carrier emails, classify intent (urgent, routine, spam, info-request), extract shipment data (BOL, PO, carrier, dates, origin, destination), and route actionable items to the TMS.',
      modelConfig:  { model: 'claude-sonnet-4-6-20250514', temperature: 0, maxTokens: 2048 },
      scheduleJson: { enabled: true, intervalMinutes: 5 },
      toolsJson:    ['imap_read', 'tms_create_shipment', 'email_archive', 'slack_notify'],
      workflowId:   intakeWorkflow.id,
    },
    {
      slug:         'invoice-agent-v2',
      name:         'invoice-agent-v2',
      description:  'Invoice and document extraction — posts to QuickBooks.',
      kind:         AgentKind.DOCUMENT_EXTRACTION,
      status:       AgentStatus.RUNNING,
      systemPrompt: 'You are an invoice processing agent. Extract structured data from PDF invoices and map to QuickBooks invoice format.',
      modelConfig:  { model: 'claude-sonnet-4-6-20250514', temperature: 0, maxTokens: 4096 },
      scheduleJson: { enabled: true, intervalMinutes: 10 },
      toolsJson:    ['pdf_extract', 'quickbooks_create_invoice', 'email_notify'],
      workflowId:   invoiceWorkflow.id,
    },
    {
      slug:         'support-router-v1',
      name:         'support-router-v1',
      description:  'Customer support triage — drops tickets in Zendesk.',
      kind:         AgentKind.SUPPORT_ROUTING,
      status:       AgentStatus.RUNNING,
      systemPrompt: 'You are a support triage agent. Classify incoming requests by severity and topic, draft an acknowledgment, and create a Zendesk ticket.',
      modelConfig:  { model: 'claude-haiku-4-5-20251001', temperature: 0, maxTokens: 1024 },
      scheduleJson: { enabled: true, intervalMinutes: 2 },
      toolsJson:    ['zendesk_create_ticket', 'email_send', 'slack_notify'],
      workflowId:   supportWorkflow.id,
    },
  ];

  for (const a of agentDefs) {
    await prisma.agent.upsert({
      where:  { organisationId_slug: { organisationId: apex.id, slug: a.slug } },
      update: {},
      create: { ...a, organisationId: apex.id },
    });
  }

  const seededAgents = await prisma.agent.findMany({ where: { organisationId: apex.id } });
  const intakeAgent  = seededAgents.find((a) => a.slug === 'intake-agent-v4')!;
  const invoiceAgent = seededAgents.find((a) => a.slug === 'invoice-agent-v2')!;
  const supportAgent = seededAgents.find((a) => a.slug === 'support-router-v1')!;

  // ── Agent runs (delete-then-create for idempotency) ───────────────────────

  await prisma.agentRun.deleteMany({ where: { organisationId: apex.id } });

  const allRuns = [
    ...makeRuns(intakeAgent.id, apex.id, 220, {
      baseLatencyMs:   420,
      failRate:        0.04,
      triggers:        ['event', 'event', 'event', 'schedule'] as const,
      successMessages: [
        'Shipment routed to TMS — BOL acknowledged',
        'Urgent email classified and dispatched',
        'Routine booking extracted and filed',
        'Carrier rate sheet archived',
      ],
      failMessages:    ['TMS write timeout', 'BOL regex failed — escalated to Slack', 'IMAP auth error'],
    }),
    ...makeRuns(invoiceAgent.id, apex.id, 88, {
      baseLatencyMs:   1100,
      failRate:        0.05,
      triggers:        ['event', 'event', 'schedule'] as const,
      successMessages: [
        'Invoice posted to QuickBooks — $2,340.00',
        'PDF extracted: 14 line items, QuickBooks updated',
        'Vendor invoice filed — awaiting approval',
      ],
      failMessages:    ['PDF parse error — unsupported format', 'QuickBooks API 429', 'Amount mismatch flagged'],
    }),
    ...makeRuns(supportAgent.id, apex.id, 55, {
      baseLatencyMs:   210,
      failRate:        0.03,
      triggers:        ['event', 'event', 'webhook'] as const,
      successMessages: [
        'Ticket created in Zendesk — priority: high',
        'Support request triaged: billing / medium',
        'Acknowledgment sent, ticket queued',
      ],
      failMessages:    ['Zendesk API error', 'Classification confidence below threshold'],
    }),
  ];

  await prisma.agentRun.createMany({ data: allRuns });

  // ── Workflow executions (delete-then-create) ──────────────────────────────

  await prisma.workflowExecution.deleteMany({ where: { workflowId: { in: [intakeWorkflow.id, invoiceWorkflow.id, supportWorkflow.id] } } });

  await prisma.workflowExecution.createMany({
    data: [
      ...makeWorkflowExecutions(intakeWorkflow.id,  32, 0.05),
      ...makeWorkflowExecutions(invoiceWorkflow.id, 18, 0.06),
      ...makeWorkflowExecutions(supportWorkflow.id, 10, 0.04),
    ],
  });

  // ── Weekly report ─────────────────────────────────────────────────────────

  const now       = new Date();
  const monday    = new Date(now);
  const dayOfWeek = now.getDay();
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  await prisma.weeklyReport.upsert({
    where:  { organisationId_weekStart: { organisationId: apex.id, weekStart: monday } },
    update: {},
    create: {
      organisationId: apex.id,
      weekStart:      monday,
      weekEnd:        sunday,
      hoursSaved:     22.5,
      costReducedUsd: 900,
      pipelinesJson: [
        { name: 'Inbound Carrier Coordination', hoursSaved: 14.0, tasks: 52,  successRate: 0.971, accent: 'accent' },
        { name: 'Invoice Data Extraction',      hoursSaved:  5.5, tasks: 21,  successRate: 0.952, accent: 'glow'   },
        { name: 'Support Ticket Triage',        hoursSaved:  3.0, tasks: 18,  successRate: 0.983, accent: 'amber'  },
      ],
    },
  });

  // ── Alerts (delete-then-create) ───────────────────────────────────────────

  await prisma.alert.deleteMany({ where: { organisationId: apex.id } });

  await prisma.alert.createMany({
    data: [
      {
        organisationId: apex.id,
        userId:         maya.id,
        severity:       AlertSeverity.OPS,
        title:          'Throughput spike on intake-agent-v4',
        body:           '2.4× baseline for the last hour. All runs still within p95 latency.',
        ts:             ago(1, 0.08),  // ~2 hours ago
        read:           false,
      },
      {
        organisationId: apex.id,
        userId:         maya.id,
        severity:       AlertSeverity.DRIFT,
        title:          'Confidence dipped below threshold on 3 messages',
        body:           'Escalated to #ops-ai-review in Slack. Reviewer acknowledged — no action required.',
        ts:             ago(1, 0.35),  // ~8 hours ago
        read:           false,
      },
      {
        organisationId: apex.id,
        userId:         maya.id,
        severity:       AlertSeverity.OPS,
        title:          'QuickBooks API rate limit hit',
        body:           'Invoice agent queued 4 invoices — will retry at next interval. No data lost.',
        ts:             ago(2, 0.1),   // ~yesterday
        read:           false,
      },
      {
        organisationId: apex.id,
        userId:         maya.id,
        severity:       AlertSeverity.TEAM,
        title:          'Tomas Costa joined the workspace',
        body:           'Tomas accepted the invitation and has Admin access.',
        ts:             ago(3, 0.5),
        read:           true,
      },
      {
        organisationId: apex.id,
        userId:         maya.id,
        severity:       AlertSeverity.DRIFT,
        title:          'Model accuracy recovered after prompt update',
        body:           'Success rate on intake-agent-v4 returned to 97.1% following the Monday prompt adjustment.',
        ts:             ago(5, 0.6),
        read:           true,
      },
      {
        organisationId: apex.id,
        userId:         maya.id,
        severity:       AlertSeverity.OPS,
        title:          'Weekly summary ready',
        body:           '22.5 hrs reallocated this week across 3 pipelines. Report available in the portal.',
        ts:             ago(7, 0.1),
        read:           true,
      },
    ],
  });

  console.log([
    '✓ Organisation: Apex Regional Logistics',
    '✓ Users: Maya Lindqvist (OWNER), Tomas Costa (ADMIN)',
    `✓ Workflows: 3  (${intakeWorkflow.id}, ${invoiceWorkflow.id}, ${supportWorkflow.id})`,
    `✓ Agents: ${seededAgents.length}  (intake ×220 runs, invoice ×88, support ×55)`,
    '✓ Workflow executions: 60  (intake ×32, invoice ×18, support ×10)',
    '✓ Weekly report: current week',
    '✓ Alerts: 6  (3 unread, 3 read)',
  ].join('\n'));
}

main()
  .catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
