import { z } from 'zod';
import type {
  WorkflowDefinition,
  WorkflowExecution,
  NodeExecution,
  NodeExecutor,
  ExecutionContext,
} from './types';
import { ExecutionStatus } from './types';
import { validateDAG, getExecutionBatches } from './dag';

type EngineState = 'idle' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';

export class WorkflowEngine {
  private readonly definition: WorkflowDefinition;
  private readonly nodeMap = new Map<string, WorkflowDefinition['nodes'][number]>();
  private readonly edgeMap = new Map<string, WorkflowDefinition['edges'][number][]>();

  private state: EngineState = 'idle';
  private currentExecution: WorkflowExecution | null = null;
  private abortController: AbortController | null = null;
  private pauseRequested = false;

  constructor(definition: WorkflowDefinition) {
    const validation = validateDAG(definition.nodes, definition.edges);
    if (!validation.valid) {
      throw new WorkflowEngineError(`Invalid workflow DAG: ${validation.errors.join('; ')}`);
    }

    this.definition = definition;

    for (const node of definition.nodes) {
      this.nodeMap.set(node.id, node);
    }

    for (const edge of definition.edges) {
      const list = this.edgeMap.get(edge.source) ?? [];
      list.push(edge);
      this.edgeMap.set(edge.source, list);
    }
  }

  async execute(
    input: Record<string, unknown>,
    executor: NodeExecutor,
    inputSchema?: z.ZodType,
  ): Promise<WorkflowExecution> {
    if (this.state === 'running') {
      throw new WorkflowEngineError('Workflow is already running');
    }

    if (inputSchema) {
      const result = inputSchema.safeParse(input);
      if (!result.success) {
        throw new WorkflowEngineError(
          `Input validation failed: ${result.error.issues.map((i) => i.message).join(', ')}`,
        );
      }
    }

    const executionId = crypto.randomUUID();
    const abortController = new AbortController();
    this.abortController = abortController;
    this.pauseRequested = false;
    this.state = 'running';

    const context = new ExecutionContext(
      this.definition.id,
      executionId,
      abortController.signal,
      abortController,
    );

    const startedAt = new Date().toISOString();

    const nodeExecutions = new Map<string, NodeExecution>();
    for (const node of this.definition.nodes) {
      nodeExecutions.set(node.id, {
        nodeId: node.id,
        status: 'pending',
        startedAt,
        input: undefined,
        output: undefined,
      });
    }

    this.currentExecution = {
      id: executionId,
      workflowId: this.definition.id,
      status: 'running',
      trigger: this.definition.trigger,
      nodes: [...nodeExecutions.values()],
      startedAt,
    };

    const batches = getExecutionBatches(this.definition.nodes, this.definition.edges);

    try {
      for (const batch of batches) {
        if (abortController.signal.aborted) {
          this.state = 'cancelled';
          break;
        }

        if (this.pauseRequested) {
          this.state = 'paused';
          break;
        }

        const settled = await Promise.allSettled(
          batch.map((nodeId) =>
            this.executeNode(
              nodeId,
              input,
              executor,
              context,
              nodeExecutions,
            ),
          ),
        );

        for (const result of settled) {
          if (result.status === 'rejected') {
            this.state = 'failed';
            break;
          }
        }

        if (this.state === 'failed') break;
      }
    } catch {
      this.state = 'failed';
    }

    const completedAt = new Date().toISOString();
    const durationMs = new Date(completedAt).getTime() - new Date(startedAt).getTime();

    if (this.state === 'running') {
      this.state = 'completed';
    }

    const finalStatus = mapStateToStatus(this.state);

    this.currentExecution = {
      ...this.currentExecution,
      status: finalStatus,
      nodes: [...nodeExecutions.values()],
      completedAt,
      durationMs,
    };

    return this.currentExecution;
  }

  getExecutionStatus(): WorkflowExecution | null {
    return this.currentExecution;
  }

  requestPause(): void {
    if (this.state === 'running') {
      this.pauseRequested = true;
    }
  }

  cancel(): void {
    this.abortController?.abort();
  }

  private async executeNode(
    nodeId: string,
    workflowInput: Record<string, unknown>,
    executor: NodeExecutor,
    context: ExecutionContext,
    nodeExecutions: Map<string, NodeExecution>,
  ): Promise<void> {
    const node = this.nodeMap.get(nodeId);
    if (!node) return;

    const nodeInput = this.resolveNodeInput(nodeId, workflowInput, context);

    const execution: NodeExecution = {
      nodeId,
      status: 'running',
      startedAt: new Date().toISOString(),
      input: nodeInput,
      output: undefined,
    };
    nodeExecutions.set(nodeId, execution);

    try {
      const output = await executor(node, nodeInput, context);
      const completedAt = new Date().toISOString();
      const durationMs =
        new Date(completedAt).getTime() - new Date(execution.startedAt).getTime();

      execution.status = 'success';
      execution.output = output;
      execution.completedAt = completedAt;
      execution.durationMs = durationMs;

      context.setNodeOutput(nodeId, output);
    } catch (err) {
      const completedAt = new Date().toISOString();
      const durationMs =
        new Date(completedAt).getTime() - new Date(execution.startedAt).getTime();

      execution.status = 'failed';
      execution.error = err instanceof Error ? err.message : String(err);
      execution.completedAt = completedAt;
      execution.durationMs = durationMs;

      this.skipDescendants(nodeId, nodeExecutions);
      throw err;
    }
  }

  private resolveNodeInput(
    nodeId: string,
    workflowInput: Record<string, unknown>,
    context: ExecutionContext,
  ): unknown {
    const incomingEdges = this.definition.edges.filter((e) => e.target === nodeId);

    if (incomingEdges.length === 0) {
      return workflowInput;
    }

    const predecessorOutputs: Record<string, unknown> = {};
    for (const edge of incomingEdges) {
      const sourceOutput = context.getNodeOutput(edge.source);

      if (edge.condition) {
        if (!evaluateCondition(edge.condition, sourceOutput)) {
          continue;
        }
      }

      predecessorOutputs[edge.source] = sourceOutput;
    }

    if (Object.keys(predecessorOutputs).length === 0) {
      return workflowInput;
    }

    return predecessorOutputs;
  }

  private skipDescendants(
    failedNodeId: string,
    nodeExecutions: Map<string, NodeExecution>,
  ): void {
    const visited = new Set<string>();
    const stack: string[] = [];

    const outgoing = this.edgeMap.get(failedNodeId) ?? [];
    for (const edge of outgoing) {
      if (edge.kind !== 'error') {
        stack.push(edge.target);
      }
    }

    while (stack.length > 0) {
      const current = stack.pop()!;
      if (visited.has(current)) continue;
      visited.add(current);

      const exec = nodeExecutions.get(current);
      if (exec && exec.status === 'pending') {
        exec.status = 'skipped';
        exec.completedAt = new Date().toISOString();
      }

      const children = this.edgeMap.get(current) ?? [];
      for (const edge of children) {
        if (!visited.has(edge.target)) {
          stack.push(edge.target);
        }
      }
    }
  }
}

function evaluateCondition(condition: string, output: unknown): boolean {
  if (output === null || output === undefined) return false;

  if (typeof output === 'object') {
    for (const [key, val] of Object.entries(output)) {
      if (key === condition) return Boolean(val);
    }
  }

  return false;
}

function mapStateToStatus(state: EngineState): ExecutionStatus {
  const table: Record<EngineState, ExecutionStatus> = {
    idle: 'draft',
    running: 'running',
    paused: 'paused',
    completed: 'completed',
    failed: 'failed',
    cancelled: 'failed',
  };
  return table[state];
}

export class WorkflowEngineError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WorkflowEngineError';
  }
}
