/**
 * API contract schemas for the agents and workflows routers.
 *
 * Design decisions:
 *
 * 1.  ENUM CASING — DB-level enums (AgentStatus, WorkflowStatus, …) are
 *     uppercase in Prisma (`RUNNING`, `DRAFT`, etc.).  The router returns them
 *     verbatim from the ORM, so output schemas here mirror that casing.
 *     The portal.ts "getDashboard / getAgent" normalises to lowercase in its own
 *     response — those are separate schemas in portal.ts and are intentionally
 *     different for the client-facing portal surface.
 *
 * 2.  PAGINATION DEFAULT — the portal alerts cursor uses 20 per page (casual
 *     browsing).  Agents/workflows cursor uses 50 per page (operational data
 *     tables).  We define a dedicated `operationalPagination` rather than
 *     re-using the common `cursorPagination` so the two defaults don't fight.
 *
 * 3.  SENSITIVE FIELDS — `systemPrompt`, `modelConfig`, `toolsJson`,
 *     `scheduleJson`, and workflow graph JSON are included in the output
 *     schema as `z.unknown()` so they remain opaque to clients.  The web
 *     portal can inspect them; mobile should not.  If a future version wants
 *     to expose these, it can refine the schema.
 *
 * 4.  NULLABLE vs OPTIONAL — fields that can be NULL in the DB are `.nullable()`
 *     here (not `.optional()`), matching Prisma's output type where `null` is
 *     returned rather than `undefined`.
 */

import { z } from 'zod';

import { cursorPagination, idSchema } from './common';

// ── Enum schemas (match Prisma uppercase values exactly) ──────

export const agentStatusEnum = z.enum(['RUNNING', 'QUEUED', 'ERROR', 'PAUSED']);
export type AgentStatusEnum = z.infer<typeof agentStatusEnum>;

export const agentKindEnum = z.enum([
  'INBOX_TRIAGE',
  'DOCUMENT_EXTRACTION',
  'SUPPORT_ROUTING',
  'CUSTOM',
]);
export type AgentKindEnum = z.infer<typeof agentKindEnum>;

export const workflowStatusEnum = z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED']);
export type WorkflowStatusEnum = z.infer<typeof workflowStatusEnum>;

export const workflowTriggerEnum = z.enum(['MANUAL', 'WEBHOOK', 'SCHEDULE', 'EVENT']);
export type WorkflowTriggerEnum = z.infer<typeof workflowTriggerEnum>;

// ── Workflow graph element schemas ────────────────────────────
// Used to type `nodesJson` and `edgesJson` when callers need to
// inspect the graph.  When the router returns these as-is from
// Prisma we keep them `z.unknown()` to avoid a deep re-parse.

export const workflowNodeKind = z.enum([
  'trigger',
  'agent',
  'condition',
  'transform',
  'output',
]);
export type WorkflowNodeKind = z.infer<typeof workflowNodeKind>;

export const workflowNode = z.object({
  id: z.string(),
  kind: workflowNodeKind,
  label: z.string(),
  config: z.record(z.unknown()),
  position: z.object({ x: z.number(), y: z.number() }),
});
export type WorkflowNode = z.infer<typeof workflowNode>;

export const workflowEdgeKind = z.enum(['data', 'control']);
export type WorkflowEdgeKind = z.infer<typeof workflowEdgeKind>;

export const workflowEdge = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  kind: workflowEdgeKind,
  condition: z.string().optional(),
});
export type WorkflowEdge = z.infer<typeof workflowEdge>;

// ── Pagination ────────────────────────────────────────────────
// 50-item pages for agent/workflow tables (operational data).
// Separated from the 20-item `cursorPagination` used for alerts.

export const operationalPagination = cursorPagination.extend({
  limit: z.number().int().min(1).max(100).default(50),
});
export type OperationalPagination = z.infer<typeof operationalPagination>;

// ── Input schemas ─────────────────────────────────────────────

/** Single-agent scope. Uses `idSchema` (cuid2 | UUID) — stricter than z.string(). */
export const agentIdInput = z.object({ agentId: idSchema });
export type AgentIdInput = z.infer<typeof agentIdInput>;

/** Single-workflow scope. Uses `idSchema`. */
export const workflowIdInput = z.object({ workflowId: idSchema });
export type WorkflowIdInput = z.infer<typeof workflowIdInput>;

/** Input for `agentsRouter.runs` — agent scope + 50-item cursor pagination. */
export const agentRunsInput = agentIdInput.merge(operationalPagination);
export type AgentRunsInput = z.infer<typeof agentRunsInput>;

/** Input for `agentsRouter.togglePause`. */
export const togglePauseInput = agentIdInput.merge(z.object({ paused: z.boolean() }));
export type TogglePauseInput = z.infer<typeof togglePauseInput>;

/** Input for `workflowsRouter.executions` — workflow scope + 50-item cursor pagination. */
export const workflowExecutionsInput = workflowIdInput.merge(operationalPagination);
export type WorkflowExecutionsInput = z.infer<typeof workflowExecutionsInput>;

// ── Output schemas — agents ───────────────────────────────────

/** Minimal workflow reference embedded inside agent list rows. */
export const workflowRef = z.object({
  id: idSchema,
  name: z.string(),
  status: workflowStatusEnum,
});
export type WorkflowRef = z.infer<typeof workflowRef>;

/**
 * Single row returned by `agentsRouter.list`.
 * Includes `_count` (total run count) and a lightweight workflow reference.
 * Sensitive fields (systemPrompt, modelConfig, toolsJson) are excluded.
 */
export const agentListItem = z.object({
  id: idSchema,
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  kind: agentKindEnum,
  status: agentStatusEnum,
  organisationId: idSchema,
  workflowId: idSchema.nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({ runs: z.number().int().nonnegative() }),
  workflow: workflowRef.nullable(),
});
export type AgentListItem = z.infer<typeof agentListItem>;

/**
 * Single run row returned by `agentsRouter.runs`.
 * `costUsd` is a Prisma `Decimal` — comes back as a Decimal object whose
 * `.toString()` produces the string representation.  We accept both.
 */
export const agentRunItem = z.object({
  id: idSchema,
  agentId: idSchema,
  organisationId: idSchema,
  trigger: z.string(),
  status: z.string(), // queued | running | success | failed | cancelled | timed_out
  tokenInput: z.number().int().nonnegative(),
  tokenOutput: z.number().int().nonnegative(),
  costUsd: z.union([z.number(), z.string()]), // Decimal → serialised string or number
  latencyMs: z.number().int().nonnegative(),
  error: z.string().nullable(),
  ts: z.date(),
  completedAt: z.date().nullable(),
});
export type AgentRunItem = z.infer<typeof agentRunItem>;

/** Cursor-paginated run list returned by `agentsRouter.runs`. */
export const paginatedRunsOutput = z.object({
  items: agentRunItem.array(),
  nextCursor: z.string().nullable(),
});
export type PaginatedRunsOutput = z.infer<typeof paginatedRunsOutput>;

/**
 * Full agent returned by `agentsRouter.get`.
 * Extends `agentListItem` without `_count`, adds the last 10 runs and
 * the full workflow graph (nodes/edges remain opaque `z.unknown()`).
 */
export const agentGetOutput = agentListItem
  .omit({ _count: true })
  .extend({
    systemPrompt: z.string().nullable(),
    modelConfig: z.unknown(),
    scheduleJson: z.unknown(),
    toolsJson: z.unknown(),
    workflow: workflowRef
      .extend({ nodesJson: z.unknown(), edgesJson: z.unknown() })
      .nullable(),
    runs: agentRunItem.array(),
  });
export type AgentGetOutput = z.infer<typeof agentGetOutput>;

// ── Output schemas — workflows ────────────────────────────────

/**
 * Single row returned by `workflowsRouter.list`.
 * Includes `_count` for agent and execution totals.
 * `nodesJson` / `edgesJson` are `z.unknown()` — use `workflowGetOutput`
 * when you need to inspect the graph.
 */
export const workflowListItem = z.object({
  id: idSchema,
  organisationId: idSchema,
  name: z.string(),
  description: z.string().nullable(),
  version: z.number().int().nonnegative(),
  status: workflowStatusEnum,
  trigger: workflowTriggerEnum,
  nodesJson: z.unknown(),
  edgesJson: z.unknown(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    agents: z.number().int().nonnegative(),
    executions: z.number().int().nonnegative(),
  }),
});
export type WorkflowListItem = z.infer<typeof workflowListItem>;

/** Single execution row returned by `workflowsRouter.executions`. */
export const workflowExecutionItem = z.object({
  id: idSchema,
  workflowId: idSchema,
  status: z.string(), // running | completed | failed | cancelled
  trigger: z.string(),
  durationMs: z.number().int().nonnegative(),
  error: z.string().nullable(),
  startedAt: z.date(),
  completedAt: z.date().nullable(),
});
export type WorkflowExecutionItem = z.infer<typeof workflowExecutionItem>;

/** Cursor-paginated execution list returned by `workflowsRouter.executions`. */
export const paginatedExecutionsOutput = z.object({
  items: workflowExecutionItem.array(),
  nextCursor: z.string().nullable(),
});
export type PaginatedExecutionsOutput = z.infer<typeof paginatedExecutionsOutput>;

/**
 * Full workflow returned by `workflowsRouter.get`.
 * Includes the graph fields typed via the `workflowNode` / `workflowEdge`
 * schemas rather than `z.unknown()` — this is the only endpoint where
 * a client legitimately needs to parse the graph.
 */
export const workflowGetOutput = workflowListItem
  .omit({ _count: true })
  .extend({
    inputSchema: z.unknown(),
    outputSchema: z.unknown(),
    nodesJson: workflowNode.array(), // refined from z.unknown()
    edgesJson: workflowEdge.array(), // refined from z.unknown()
    agents: z
      .object({ id: idSchema, name: z.string(), status: agentStatusEnum })
      .array(),
    executions: workflowExecutionItem.array(),
  });
export type WorkflowGetOutput = z.infer<typeof workflowGetOutput>;
