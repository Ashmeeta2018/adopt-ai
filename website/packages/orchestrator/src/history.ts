import type {
  AgentRunRecord,
  AgentMetrics,
  CostBreakdown,
  DateRange,
  PaginatedResult,
} from './types;

export interface RunStore {
  save(run: AgentRunRecord): void;
  findByAgent(agentId: string, limit: number, cursor?: string): PaginatedResult<AgentRunRecord>;
  findByOrg(organisationId: string, limit: number, cursor?: string): PaginatedResult<AgentRunRecord>;
  findByAgentInRange(agentId: string, range: DateRange): AgentRunRecord[];
  findByOrgInRange(organisationId: string, range?: DateRange): AgentRunRecord[];
}

class InMemoryRunStore implements RunStore {
  private readonly runs: AgentRunRecord[] = [];

  save(run: AgentRunRecord): void {
    this.runs.push(run);
  }

  findByAgent(agentId: string, limit: number, cursor?: string): PaginatedResult<AgentRunRecord> {
    const filtered = this.runs
      .filter((r) => r.agentId === agentId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return this.paginate(filtered, limit, cursor);
  }

  findByOrg(organisationId: string, limit: number, cursor?: string): PaginatedResult<AgentRunRecord> {
    const filtered = this.runs
      .filter((r) => r.organisationId === organisationId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return this.paginate(filtered, limit, cursor);
  }

  findByAgentInRange(agentId: string, range: DateRange): AgentRunRecord[] {
    return this.runs.filter((r) => {
      if (r.agentId !== agentId) return false;
      return r.createdAt >= range.from && r.createdAt <= range.to;
    });
  }

  findByOrgInRange(organisationId: string, range?: DateRange): AgentRunRecord[] {
    return this.runs.filter((r) => {
      if (r.organisationId !== organisationId) return false;
      if (range) {
        return r.createdAt >= range.from && r.createdAt <= range.to;
      }
      return true;
    });
  }

  private paginate(
    items: AgentRunRecord[],
    limit: number,
    cursor?: string,
  ): PaginatedResult<AgentRunRecord> {
    let startIndex = 0;
    if (cursor) {
      const idx = items.findIndex((r) => r.id === cursor);
      if (idx !== -1) {
        startIndex = idx;
      }
    }

    const sliced = items.slice(startIndex, startIndex + limit + 1);
    const hasMore = sliced.length > limit;
    const page = hasMore ? sliced.slice(0, limit) : sliced;

    return {
      items: page,
      nextCursor: hasMore && page.length > 0 ? page[page.length - 1].id : undefined,
    };
  }
}

export class RunHistory {
  private readonly store: RunStore;

  constructor(store?: RunStore) {
    this.store = store ?? new InMemoryRunStore();
  }

  record(run: AgentRunRecord): void {
    this.store.save(run);
  }

  getByAgent(agentId: string, limit = 50, cursor?: string): PaginatedResult<AgentRunRecord> {
    return this.store.findByAgent(agentId, limit, cursor);
  }

  getByOrg(organisationId: string, limit = 50, cursor?: string): PaginatedResult<AgentRunRecord> {
    return this.store.findByOrg(organisationId, limit, cursor);
  }

  getMetrics(agentId: string, range: DateRange): AgentMetrics {
    const runs = this.store.findByAgentInRange(agentId, range);

    if (runs.length === 0) {
      return {
        totalRuns: 0,
        successRate: 0,
        avgLatencyMs: 0,
        totalTokens: 0,
        totalCostUsd: 0,
        hourlyBreakdown: [],
      };
    }

    const successCount = runs.filter((r) => r.status === 'success').length;
    const totalTokens = runs.reduce((sum, r) => sum + r.tokenUsage.totalTokens, 0);
    const totalCost = runs.reduce((sum, r) => sum + r.costUsd, 0);
    const avgLatency = runs.reduce((sum, r) => sum + r.latencyMs, 0) / runs.length;

    const buckets = new Map<string, { runs: number; successes: number; totalLatency: number }>();
    for (const run of runs) {
      const hour = run.createdAt.slice(0, 13);
      const bucket = buckets.get(hour) ?? { runs: 0, successes: 0, totalLatency: 0 };
      bucket.runs += 1;
      bucket.successes += run.status === 'success' ? 1 : 0;
      bucket.totalLatency += run.latencyMs;
      buckets.set(hour, bucket);
    }

    const hourlyBreakdown = Array.from(buckets.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([hour, data]) => ({
        hour,
        runs: data.runs,
        successRate: data.runs > 0 ? data.successes / data.runs : 0,
        avgLatencyMs: data.runs > 0 ? data.totalLatency / data.runs : 0,
      }));

    return {
      totalRuns: runs.length,
      successRate: successCount / runs.length,
      avgLatencyMs: avgLatency,
      totalTokens,
      totalCostUsd: totalCost,
      hourlyBreakdown,
    };
  }

  getCostByOrg(organisationId: string, range?: DateRange): CostBreakdown[] {
    const runs = this.store.findByOrgInRange(organisationId, range);

    const byAgent = new Map<string, { cost: number; runs: number }>();
    for (const run of runs) {
      const bucket = byAgent.get(run.agentId) ?? { cost: 0, runs: 0 };
      bucket.cost += run.costUsd;
      bucket.runs += 1;
      byAgent.set(run.agentId, bucket);
    }

    return Array.from(byAgent.entries())
      .map(([agentId, data]) => ({
        agentId,
        agentName: '',
        totalCostUsd: data.cost,
        totalRuns: data.runs,
      }))
      .sort((a, b) => b.totalCostUsd - a.totalCostUsd);
  }
}
