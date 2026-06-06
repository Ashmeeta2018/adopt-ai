import type {
  AgentConfig,
  AgentRunRecord,
  AgentRunStatus,
  ModelClient,
  RunTrigger,
  TokenUsage,
  ToolResult,
  WorkflowEngine,
} from './types;
import { ExecutionTimeoutError } from './errors;

const MAX_TOOL_ITERATIONS = 20;

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function emptyTokenUsage(): TokenUsage {
  return { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
}

function addTokenUsage(a: TokenUsage, b: TokenUsage): TokenUsage {
  return {
    promptTokens: a.promptTokens + b.promptTokens,
    completionTokens: a.completionTokens + b.completionTokens,
    totalTokens: a.totalTokens + b.totalTokens,
  };
}

function createRunRecord(
  agent: AgentConfig,
  trigger: RunTrigger,
  input: unknown,
  status: AgentRunStatus,
): AgentRunRecord {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    agentId: agent.id,
    organisationId: agent.organisationId,
    status,
    trigger,
    input,
    output: null,
    tokenUsage: emptyTokenUsage(),
    costUsd: 0,
    latencyMs: 0,
    startedAt: now,
    createdAt: now,
  };
}

type StartHandler = (run: AgentRunRecord) => void;
type CompleteHandler = (run: AgentRunRecord) => void;
type ErrorHandler = (run: AgentRunRecord, err: Error) => void;

export class AgentExecutor {
  private readonly modelClient: ModelClient;
  private readonly workflowEngine?: WorkflowEngine;
  private readonly handlers: {
    'run:start': Set<StartHandler>;
    'run:complete': Set<CompleteHandler>;
    'run:error': Set<ErrorHandler>;
  };
  private readonly defaultTimeoutMs: number;

  constructor(options: {
    modelClient: ModelClient;
    workflowEngine?: WorkflowEngine;
    defaultTimeoutMs?: number;
  }) {
    this.modelClient = options.modelClient;
    this.workflowEngine = options.workflowEngine;
    this.defaultTimeoutMs = options.defaultTimeoutMs ?? 30_000;
    this.handlers = {
      'run:start': new Set(),
      'run:complete': new Set(),
      'run:error': new Set(),
    };
  }

  onStart(handler: StartHandler): void {
    this.handlers['run:start'].add(handler);
  }

  onComplete(handler: CompleteHandler): void {
    this.handlers['run:complete'].add(handler);
  }

  onError(handler: ErrorHandler): void {
    this.handlers['run:error'].add(handler);
  }

  offStart(handler: StartHandler): void {
    this.handlers['run:start'].delete(handler);
  }

  offComplete(handler: CompleteHandler): void {
    this.handlers['run:complete'].delete(handler);
  }

  offError(handler: ErrorHandler): void {
    this.handlers['run:error'].delete(handler);
  }

  private emitStart(run: AgentRunRecord): void {
    for (const handler of this.handlers['run:start']) {
      try { handler(run); } catch { /* Subscriber errors must not break execution. */ }
    }
  }

  private emitComplete(run: AgentRunRecord): void {
    for (const handler of this.handlers['run:complete']) {
      try { handler(run); } catch { /* Subscriber errors must not break execution. */ }
    }
  }

  private emitError(run: AgentRunRecord, err: Error): void {
    for (const handler of this.handlers['run:error']) {
      try { handler(run, err); } catch { /* Subscriber errors must not break execution. */ }
    }
  }

  async execute(agent: AgentConfig, input: unknown, trigger: RunTrigger = 'manual'): Promise<AgentRunRecord> {
    const run = createRunRecord(agent, trigger, input, 'running');
    this.emitStart(run);

    const startTime = Date.now();

    try {
      let output: unknown;
      let tokenUsage: TokenUsage;

      if (agent.workflowId && this.workflowEngine) {
        const result = await this.workflowEngine.execute(agent.workflowId, input);
        output = result.output;
        tokenUsage = result.usage;
      } else {
        const result = await this.runDirectModelLoop(agent, input);
        output = result.output;
        tokenUsage = result.tokenUsage;
      }

      const latencyMs = Date.now() - startTime;
      const costUsd = this.modelClient.estimateCost(tokenUsage);

      run.status = 'success';
      run.output = output;
      run.tokenUsage = tokenUsage;
      run.costUsd = costUsd;
      run.latencyMs = latencyMs;
      run.completedAt = new Date().toISOString();

      this.emitComplete(run);
      return run;
    } catch (err) {
      const latencyMs = Date.now() - startTime;
      run.status = 'failed';
      run.latencyMs = latencyMs;
      run.error = err instanceof Error ? err.message : String(err);
      run.completedAt = new Date().toISOString();

      this.emitError(run, err instanceof Error ? err : new Error(String(err)));
      return run;
    }
  }

  async executeWithTimeout(
    agent: AgentConfig,
    input: unknown,
    timeoutMs?: number,
    trigger: RunTrigger = 'manual',
  ): Promise<AgentRunRecord> {
    const timeout = timeoutMs ?? this.defaultTimeoutMs;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeoutPromise = new Promise<AgentRunRecord>((resolve) => {
      timer = setTimeout(() => {
        const run = createRunRecord(agent, trigger, input, 'timed_out');
        run.latencyMs = timeout;
        run.error = new ExecutionTimeoutError(agent.id, timeout).message;
        run.completedAt = new Date().toISOString();
        resolve(run);
      }, timeout);
    });

    try {
      const result = await Promise.race([
        this.execute(agent, input, trigger),
        timeoutPromise,
      ]);
      return result;
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  async executeBatch(
    runs: Array<{ agent: AgentConfig; input: unknown; trigger?: RunTrigger }>,
    concurrency = 5,
  ): Promise<AgentRunRecord[]> {
    const results: AgentRunRecord[] = [];
    const queue = [...runs];
    let slotCount = 0;

    await new Promise<void>((resolve) => {
      const next = (): void => {
        if (queue.length === 0 && slotCount === 0) {
          resolve();
          return;
        }

        while (slotCount < concurrency && queue.length > 0) {
          const item = queue.shift();
          if (!item) break;

          slotCount++;
          this.execute(item.agent, item.input, item.trigger)
            .then((record) => {
              results.push(record);
            })
            .finally(() => {
              slotCount--;
              next();
            });
        }
      };

      next();
    });

    return results;
  }

  private async runDirectModelLoop(
    agent: AgentConfig,
    input: unknown,
  ): Promise<{ output: unknown; tokenUsage: TokenUsage }> {
    const messages: Array<{ role: 'system' | 'user' | 'assistant' | 'tool'; content: string }> = [
      { role: 'system', content: agent.systemPrompt },
      { role: 'user', content: JSON.stringify(input) },
    ];

    let totalUsage = emptyTokenUsage();

    for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
      const response = await this.modelClient.chat({
        model: agent.modelConfig.model,
        messages,
        tools: agent.tools.length > 0 ? agent.tools : undefined,
      });

      totalUsage = addTokenUsage(totalUsage, response.usage);

      if (!response.toolCalls || response.toolCalls.length === 0) {
        return { output: response.content, tokenUsage: totalUsage };
      }

      messages.push({ role: 'assistant', content: response.content });

      const toolResults: ToolResult[] = response.toolCalls.map((tc) => ({
        toolCallId: tc.id,
        output: { acknowledged: true, call: tc.name, args: tc.arguments },
      }));

      for (const tc of response.toolCalls) {
        messages.push({
          role: 'tool',
          content: JSON.stringify(toolResults.find((r) => r.toolCallId === tc.id)?.output),
        });
      }
    }

    return { output: 'Max tool iterations reached', tokenUsage: totalUsage };
  }
}
