import { z } from 'zod';

// ---------------------------------------------------------------------------
// Re-exported contracts from peer packages (defined locally until the peer
// packages publish their own public types).  These mirror the interfaces that
// @adopt-ai/model-wrapper and @adopt-ai/workflow will expose.
// ---------------------------------------------------------------------------

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface ModelConfig {
  provider: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

export interface ModelResponse {
  content: string;
  toolCalls?: ToolCall[];
  usage: TokenUsage;
  finishReason: string;
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface ToolResult {
  toolCallId: string;
  output: unknown;
}

export interface ModelClient {
  chat(options: {
    model: string;
    messages: Array<{ role: 'system' | 'user' | 'assistant' | 'tool'; content: string }>;
    tools?: ToolDefinition[];
    toolResults?: ToolResult[];
    signal?: AbortSignal;
  }): Promise<ModelResponse>;

  estimateCost(usage: TokenUsage): number;
}

export interface WorkflowEngine {
  execute(
    workflowId: string,
    input: unknown,
    signal?: AbortSignal,
  ): Promise<{ output: unknown; usage: TokenUsage }>;
}

// ---------------------------------------------------------------------------
// Agent kinds
// ---------------------------------------------------------------------------

export const AgentKind = z.enum([
  'inbox_triage',
  'document_extraction',
  'support_routing',
  'custom',
]);
export type AgentKind = z.infer<typeof AgentKind>;

// ---------------------------------------------------------------------------
// Agent configuration
// ---------------------------------------------------------------------------

export const ScheduleConfig = z.object({
  cron: z.string().min(1),
  timezone: z.string().default('UTC'),
  enabled: z.boolean().default(true),
  retryPolicy: z
    .object({
      maxRetries: z.number().int().min(0).default(3),
      backoffMs: z.number().int().min(0).default(1000),
    })
    .default({ maxRetries: 3, backoffMs: 1000 }),
});
export type ScheduleConfig = z.infer<typeof ScheduleConfig>;

export const AgentStatus = z.enum(['active', 'paused', 'archived']);
export type AgentStatus = z.infer<typeof AgentStatus>;

export interface AgentConfig {
  id: string;
  organisationId: string;
  kind: AgentKind;
  name: string;
  description: string;
  modelConfig: ModelConfig;
  workflowId?: string;
  schedule?: ScheduleConfig;
  tools: ToolDefinition[];
  systemPrompt: string;
  status: AgentStatus;
}

// ---------------------------------------------------------------------------
// Run tracking
// ---------------------------------------------------------------------------

export const AgentRunStatus = z.enum([
  'queued',
  'running',
  'success',
  'failed',
  'cancelled',
  'timed_out',
]);
export type AgentRunStatus = z.infer<typeof AgentRunStatus>;

export const RunTrigger = z.enum(['manual', 'schedule', 'webhook', 'event']);
export type RunTrigger = z.infer<typeof RunTrigger>;

export interface AgentRunRecord {
  id: string;
  agentId: string;
  organisationId: string;
  status: AgentRunStatus;
  trigger: RunTrigger;
  input: unknown;
  output: unknown;
  tokenUsage: TokenUsage;
  costUsd: number;
  latencyMs: number;
  error?: string;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Health
// ---------------------------------------------------------------------------

export const HealthGrade = z.enum(['healthy', 'degraded', 'unhealthy']);
export type HealthGrade = z.infer<typeof HealthGrade>;

export interface HealthStatus {
  agentId: string;
  status: HealthGrade;
  lastRunAt?: string;
  lastSuccessAt?: string;
  consecutiveFailures: number;
  avgLatencyMs: number;
  successRate: number;
}

// ---------------------------------------------------------------------------
// Task routing
// ---------------------------------------------------------------------------

export interface IncomingTask {
  organisationId: string;
  kind: AgentKind;
  payload: unknown;
  priority?: number;
  preferredAgentId?: string;
}

// ---------------------------------------------------------------------------
// History queries
// ---------------------------------------------------------------------------

export interface PaginatedResult<T> {
  items: T[];
  nextCursor?: string;
}

export interface DateRange {
  from: string;
  to: string;
}

export interface AgentMetrics {
  totalRuns: number;
  successRate: number;
  avgLatencyMs: number;
  totalTokens: number;
  totalCostUsd: number;
  hourlyBreakdown: Array<{ hour: string; runs: number; successRate: number; avgLatencyMs: number }>;
}

export interface CostBreakdown {
  agentId: string;
  agentName: string;
  totalCostUsd: number;
  totalRuns: number;
}

// ---------------------------------------------------------------------------
// Orchestrator config
// ---------------------------------------------------------------------------

export interface OrchestratorConfig {
  modelClient: ModelClient;
  workflowEngine?: WorkflowEngine;
  tickIntervalMs?: number;
  maxConcurrency?: number;
  defaultTimeoutMs?: number;
}
