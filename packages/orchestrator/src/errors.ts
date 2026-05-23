export class AgentNotFoundError extends Error {
  public readonly agentId: string;

  constructor(agentId: string) {
    super(`Agent not found: ${agentId}`);
    this.name = 'AgentNotFoundError';
    this.agentId = agentId;
  }
}

export class AgentUnavailableError extends Error {
  public readonly agentId: string;
  public readonly reason: string;

  constructor(agentId: string, reason: string) {
    super(`Agent ${agentId} is unavailable: ${reason}`);
    this.name = 'AgentUnavailableError';
    this.agentId = agentId;
    this.reason = reason;
  }
}

export class ExecutionTimeoutError extends Error {
  public readonly agentId: string;
  public readonly timeoutMs: number;

  constructor(agentId: string, timeoutMs: number) {
    super(`Execution of agent ${agentId} timed out after ${timeoutMs}ms`);
    this.name = 'ExecutionTimeoutError';
    this.agentId = agentId;
    this.timeoutMs = timeoutMs;
  }
}

export class WorkflowExecutionError extends Error {
  public readonly workflowId: string;
  public readonly cause: unknown;

  constructor(workflowId: string, message: string, cause?: unknown) {
    super(`Workflow ${workflowId} failed: ${message}`);
    this.name = 'WorkflowExecutionError';
    this.workflowId = workflowId;
    this.cause = cause;
  }
}
