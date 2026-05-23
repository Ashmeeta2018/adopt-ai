import type { AgentRunRecord, HealthGrade, HealthStatus } from './types;

const WINDOW_SIZE = 100;
const HEALTHY_SUCCESS_THRESHOLD = 0.95;
const DEGRADED_SUCCESS_THRESHOLD = 0.80;
const HEALTHY_LATENCY_MS = 5_000;
const DEGRADED_LATENCY_MS = 15_000;
const CONSECUTIVE_FAILURE_UNHEALTHY = 3;

interface HealthEntry {
  status: HealthGrade;
  lastRunAt?: string;
  lastSuccessAt?: string;
  consecutiveFailures: number;
  recentRuns: Array<{ success: boolean; latencyMs: number }>;
}

type UnhealthyCallback = (agentId: string, status: HealthStatus) => void;

function computeGrade(entry: HealthEntry): HealthGrade {
  const { recentRuns, consecutiveFailures } = entry;

  if (recentRuns.length === 0) {
    return 'healthy';
  }

  const successRate = recentRuns.filter((r) => r.success).length / recentRuns.length;
  const avgLatencyMs =
    recentRuns.reduce((sum, r) => sum + r.latencyMs, 0) / recentRuns.length;

  if (
    successRate < DEGRADED_SUCCESS_THRESHOLD ||
    consecutiveFailures >= CONSECUTIVE_FAILURE_UNHEALTHY ||
    avgLatencyMs > DEGRADED_LATENCY_MS
  ) {
    return 'unhealthy';
  }

  if (
    successRate < HEALTHY_SUCCESS_THRESHOLD ||
    avgLatencyMs > HEALTHY_LATENCY_MS
  ) {
    return 'degraded';
  }

  return 'healthy';
}

function toPublicStatus(entry: HealthEntry): HealthStatus {
  const successRate =
    entry.recentRuns.length > 0
      ? entry.recentRuns.filter((r) => r.success).length / entry.recentRuns.length
      : 1;
  const avgLatencyMs =
    entry.recentRuns.length > 0
      ? entry.recentRuns.reduce((sum, r) => sum + r.latencyMs, 0) / entry.recentRuns.length
      : 0;

  return {
    agentId: '',
    status: computeGrade(entry),
    lastRunAt: entry.lastRunAt,
    lastSuccessAt: entry.lastSuccessAt,
    consecutiveFailures: entry.consecutiveFailures,
    avgLatencyMs,
    successRate,
  };
}

export class HealthMonitor {
  private readonly entries = new Map<string, HealthEntry>();
  private readonly unhealthyCallbacks = new Set<UnhealthyCallback>();

  onUnhealthy(callback: UnhealthyCallback): void {
    this.unhealthyCallbacks.add(callback);
  }

  update(runRecord: AgentRunRecord): HealthStatus {
    let entry = this.entries.get(runRecord.agentId);
    if (!entry) {
      entry = {
        status: 'healthy',
        consecutiveFailures: 0,
        recentRuns: [],
      };
      this.entries.set(runRecord.agentId, entry);
    }

    const success = runRecord.status === 'success';
    entry.recentRuns.push({ success, latencyMs: runRecord.latencyMs });
    if (entry.recentRuns.length > WINDOW_SIZE) {
      entry.recentRuns.shift();
    }

    entry.lastRunAt = runRecord.completedAt ?? runRecord.startedAt;

    if (success) {
      entry.lastSuccessAt = entry.lastRunAt;
      entry.consecutiveFailures = 0;
    } else {
      entry.consecutiveFailures += 1;
    }

    const previousGrade = entry.status;
    entry.status = computeGrade(entry);

    const status = toPublicStatus(entry);
    status.agentId = runRecord.agentId;

    if (entry.status === 'unhealthy' && previousGrade !== 'unhealthy') {
      for (const cb of this.unhealthyCallbacks) {
        try {
          cb(runRecord.agentId, status);
        } catch {
          // Subscriber errors must not break the update loop.
        }
      }
    }

    return status;
  }

  getStatus(agentId: string): HealthStatus | null {
    const entry = this.entries.get(agentId);
    if (!entry) return null;
    const status = toPublicStatus(entry);
    status.agentId = agentId;
    return status;
  }

  getUnhealthy(): HealthStatus[] {
    const result: HealthStatus[] = [];
    for (const [agentId, entry] of this.entries) {
      if (entry.status !== 'healthy') {
        const status = toPublicStatus(entry);
        status.agentId = agentId;
        result.push(status);
      }
    }
    return result;
  }
}
