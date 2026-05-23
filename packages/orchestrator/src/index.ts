import type { AgentConfig, DateRange, HealthStatus, IncomingTask, OrchestratorConfig, AgentMetrics, CostBreakdown, AgentRunRecord, PaginatedResult } from './types;
import { AgentNotFoundError } from './errors;
import { Scheduler } from './scheduler;
import { AgentExecutor } from './executor;
import { TaskRouter } from './router;
import { HealthMonitor } from './health;
import { RunHistory } from './history;

export class Orchestrator {
  private readonly scheduler: Scheduler;
  private readonly executor: AgentExecutor;
  private readonly router: TaskRouter;
  private readonly health: HealthMonitor;
  private readonly history: RunHistory;
  private readonly agents = new Map<string, AgentConfig>();
  private readonly tickIntervalMs: number;
  private readonly defaultTimeoutMs: number;
  private tickTimer: ReturnType<typeof setInterval> | null = null;

  constructor(config: OrchestratorConfig) {
    this.tickIntervalMs = config.tickIntervalMs ?? 60_000;
    this.defaultTimeoutMs = config.defaultTimeoutMs ?? 30_000;

    this.scheduler = new Scheduler();
    this.executor = new AgentExecutor({
      modelClient: config.modelClient,
      workflowEngine: config.workflowEngine,
      defaultTimeoutMs: this.defaultTimeoutMs,
    });
    this.router = new TaskRouter();
    this.health = new HealthMonitor();
    this.history = new RunHistory();

    this.executor.onComplete((run) => {
      this.history.record(run);
      this.health.update(run);
      const status = this.health.getStatus(run.agentId);
      if (status) {
        this.router.updateHealth(run.agentId, status.status);
      }
    });

    this.executor.onError((run) => {
      this.history.record(run);
      this.health.update(run);
      const status = this.health.getStatus(run.agentId);
      if (status) {
        this.router.updateHealth(run.agentId, status.status);
      }
    });
  }

  registerAgent(config: AgentConfig): void {
    this.agents.set(config.id, config);
    this.router.registerAgent(config, 'healthy');

    if (config.schedule) {
      this.scheduler.register(config.id, config.schedule);
    }
  }

  async runAgent(agentId: string, input: unknown, trigger: 'manual' | 'schedule' | 'webhook' | 'event' = 'manual'): Promise<AgentRunRecord> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new AgentNotFoundError(agentId);
    }
    return this.executor.executeWithTimeout(agent, input, this.defaultTimeoutMs, trigger);
  }

  async runTask(task: IncomingTask): Promise<AgentRunRecord> {
    const agentId = this.router.route(task);
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new AgentNotFoundError(agentId);
    }

    const trigger = task.preferredAgentId ? 'manual' : 'event';
    return this.executor.executeWithTimeout(agent, task.payload, this.defaultTimeoutMs, trigger);
  }

  getAgentHealth(agentId: string): HealthStatus | null {
    return this.health.getStatus(agentId);
  }

  getAgentHistory(agentId: string, limit?: number, cursor?: string): PaginatedResult<AgentRunRecord> {
    return this.history.getByAgent(agentId, limit, cursor);
  }

  getOrgMetrics(organisationId: string, range: DateRange): AgentMetrics {
    const agents = Array.from(this.agents.values()).filter(
      (a) => a.organisationId === organisationId,
    );

    if (agents.length === 0) {
      return {
        totalRuns: 0,
        successRate: 0,
        avgLatencyMs: 0,
        totalTokens: 0,
        totalCostUsd: 0,
        hourlyBreakdown: [],
      };
    }

    const perAgent = agents.map((a) => this.history.getMetrics(a.id, range));

    const totalRuns = perAgent.reduce((s, m) => s + m.totalRuns, 0);
    if (totalRuns === 0) {
      return {
        totalRuns: 0,
        successRate: 0,
        avgLatencyMs: 0,
        totalTokens: 0,
        totalCostUsd: 0,
        hourlyBreakdown: [],
      };
    }

    const successRate =
      perAgent.reduce((s, m) => s + m.successRate * m.totalRuns, 0) / totalRuns;
    const avgLatencyMs =
      perAgent.reduce((s, m) => s + m.avgLatencyMs * m.totalRuns, 0) / totalRuns;
    const totalTokens = perAgent.reduce((s, m) => s + m.totalTokens, 0);
    const totalCostUsd = perAgent.reduce((s, m) => s + m.totalCostUsd, 0);

    const hourlyMap = new Map<string, { runs: number; successSum: number; latencySum: number }>();
    for (const m of perAgent) {
      for (const h of m.hourlyBreakdown) {
        const bucket = hourlyMap.get(h.hour) ?? { runs: 0, successSum: 0, latencySum: 0 };
        bucket.runs += h.runs;
        bucket.successSum += h.successRate * h.runs;
        bucket.latencySum += h.avgLatencyMs * h.runs;
        hourlyMap.set(h.hour, bucket);
      }
    }

    const hourlyBreakdown = Array.from(hourlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([hour, data]) => ({
        hour,
        runs: data.runs,
        successRate: data.runs > 0 ? data.successSum / data.runs : 0,
        avgLatencyMs: data.runs > 0 ? data.latencySum / data.runs : 0,
      }));

    return {
      totalRuns,
      successRate,
      avgLatencyMs,
      totalTokens,
      totalCostUsd,
      hourlyBreakdown,
    };
  }

  getOrgCostBreakdown(organisationId: string, range?: DateRange): CostBreakdown[] {
    const breakdown = this.history.getCostByOrg(organisationId, range);
    return breakdown.map((entry) => {
      const agent = this.agents.get(entry.agentId);
      return {
        ...entry,
        agentName: agent?.name ?? 'Unknown',
      };
    });
  }

  start(): void {
    if (this.tickTimer !== null) return;

    this.tickTimer = setInterval(() => {
      const due = this.scheduler.tick();
      for (const item of due) {
        const agent = this.agents.get(item.agentId);
        if (!agent || agent.status !== 'active') continue;

        this.executor.executeWithTimeout(agent, null, this.defaultTimeoutMs, 'schedule').catch(() => {
          // Errors are already recorded inside executeWithTimeout.
        });
      }
    }, this.tickIntervalMs);
  }

  stop(): void {
    if (this.tickTimer !== null) {
      clearInterval(this.tickTimer);
      this.tickTimer = null;
    }
  }
}

export function createOrchestrator(config: OrchestratorConfig): Orchestrator {
  return new Orchestrator(config);
}

// Re-export all public types and modules
export type { OrchestratorConfig } from './types;
export type { AgentConfig, AgentKind, AgentRunRecord, AgentRunStatus, AgentStatus } from './types;
export type { ScheduleConfig, HealthGrade, HealthStatus } from './types;
export type { IncomingTask, RunTrigger } from './types;
export type { DateRange, AgentMetrics, CostBreakdown, PaginatedResult } from './types;
export type { ModelClient, ModelConfig, ModelResponse, WorkflowEngine } from './types;
export type { TokenUsage, ToolDefinition, ToolCall, ToolResult } from './types;

export { AgentKind, AgentRunStatus, AgentStatus, HealthGrade, RunTrigger, ScheduleConfig } from './types;

export { AgentNotFoundError, AgentUnavailableError, ExecutionTimeoutError, WorkflowExecutionError } from './errors;

export { Scheduler } from './scheduler;
export { AgentExecutor } from './executor;
export { TaskRouter } from './router;
export { HealthMonitor } from './health;
export { RunHistory } from './history;
export type { RunStore } from './history;
