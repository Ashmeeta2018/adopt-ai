import { z } from 'zod';

const workflowId = z.string().cuid2().or(z.string().uuid()).describe('Unique identifier');

export const WorkflowTrigger = z.enum(['manual', 'webhook', 'schedule', 'event']);
export type WorkflowTrigger = z.infer<typeof WorkflowTrigger>;

export const NodeKind = z.enum([
  'trigger',
  'agent',
  'condition',
  'transform',
  'output',
  'subworkflow',
]);
export type NodeKind = z.infer<typeof NodeKind>;

export const EdgeKind = z.enum(['data', 'control', 'error']);
export type EdgeKind = z.infer<typeof EdgeKind>;

export const WorkflowNode = z.object({
  id: workflowId.describe('Unique node identifier'),
  kind: NodeKind.describe('Discriminator for node behaviour'),
  label: z.string().min(1).describe('Human-readable node name'),
  config: z.record(z.unknown()).default({}).describe('Node-type-specific configuration'),
  position: z
    .object({
      x: z.number(),
      y: z.number(),
    })
    .describe('Coordinates in the visual editor canvas'),
});
export type WorkflowNode = z.infer<typeof WorkflowNode>;

export const WorkflowEdge = z.object({
  id: workflowId.describe('Unique edge identifier'),
  source: workflowId.describe('Source node id'),
  target: workflowId.describe('Target node id'),
  kind: EdgeKind.describe('Edge semantics'),
  condition: z
    .string()
    .optional()
    .describe('Expression evaluated against source node output for conditional routing'),
});
export type WorkflowEdge = z.infer<typeof WorkflowEdge>;

export const WorkflowDefinition = z.object({
  id: workflowId.describe('Unique workflow identifier'),
  name: z.string().min(1).describe('Workflow name'),
  description: z.string().default('').describe('What this workflow does'),
  version: z.number().int().min(1).describe('Monotonically increasing version'),
  trigger: WorkflowTrigger.describe('How this workflow is initiated'),
  nodes: z.array(WorkflowNode).min(1).describe('All nodes in the DAG'),
  edges: z.array(WorkflowEdge).describe('Directed edges connecting nodes'),
  inputSchema: z
    .record(z.unknown())
    .optional()
    .describe('JSON Schema for workflow input validation'),
  outputSchema: z
    .record(z.unknown())
    .optional()
    .describe('JSON Schema for workflow output shape'),
});
export type WorkflowDefinition = z.infer<typeof WorkflowDefinition>;

export const WorkflowStatus = z.enum(['draft', 'active', 'paused', 'archived']);
export type WorkflowStatus = z.infer<typeof WorkflowStatus>;

export const ExecutionStatus = z.enum([
  'running',
  'completed',
  'failed',
  ...WorkflowStatus.options,
]);
export type ExecutionStatus = z.infer<typeof ExecutionStatus>;

export const NodeExecutionStatus = z.enum([
  'pending',
  'running',
  'success',
  'failed',
  'skipped',
]);
export type NodeExecutionStatus = z.infer<typeof NodeExecutionStatus>;

export const NodeExecution = z.object({
  nodeId: workflowId.describe('Reference to the executed node'),
  status: NodeExecutionStatus,
  startedAt: z.string().datetime().describe('ISO-8601 timestamp'),
  completedAt: z.string().datetime().optional().describe('ISO-8601 timestamp'),
  input: z.unknown().describe('Data fed into this node'),
  output: z.unknown().describe('Data produced by this node'),
  error: z.string().optional().describe('Error message if the node failed'),
  durationMs: z.number().nonnegative().optional().describe('Elapsed wall-clock time'),
});
export type NodeExecution = z.infer<typeof NodeExecution>;

export const WorkflowExecution = z.object({
  id: workflowId.describe('Unique execution run identifier'),
  workflowId: workflowId.describe('Which workflow was run'),
  status: ExecutionStatus.describe('Current state of this run'),
  trigger: WorkflowTrigger,
  nodes: z.array(NodeExecution).describe('Per-node execution records'),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
  durationMs: z.number().nonnegative().optional().describe('Total elapsed wall-clock time'),
});
export type WorkflowExecution = z.infer<typeof WorkflowExecution>;

export class ExecutionContext {
  readonly workflowId: string;
  readonly executionId: string;
  readonly abortSignal: AbortSignal;

  private readonly variables = new Map<string, unknown>();
  private readonly nodeOutputs = new Map<string, unknown>();
  private abortController: AbortController | null = null;

  constructor(workflowId: string, executionId: string, abortSignal: AbortSignal, abortController: AbortController | null = null) {
    this.workflowId = workflowId;
    this.executionId = executionId;
    this.abortSignal = abortSignal;
    this.abortController = abortController;
  }

  setVariable(key: string, value: unknown): void {
    this.variables.set(key, value);
  }

  getVariable(key: string): unknown {
    return this.variables.get(key);
  }

  setNodeOutput(nodeId: string, output: unknown): void {
    this.nodeOutputs.set(nodeId, output);
  }

  getNodeOutput(nodeId: string): unknown {
    return this.nodeOutputs.get(nodeId);
  }

  abort(): void {
    this.abortController?.abort();
  }
}

export interface NodeExecutor {
  (
    node: WorkflowNode,
    input: unknown,
    context: ExecutionContext,
  ): Promise<unknown>;
}
