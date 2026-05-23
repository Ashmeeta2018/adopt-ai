import type { CostConfig, TokenUsage } from './types;
import { BudgetExceededError } from './errors;

interface UsageRecord {
  timestamp: number;
  model: string;
  usage: TokenUsage;
  cost: number;
}

type EventName = 'usage' | 'budget-exceeded';
type EventCallback = (record: UsageRecord) => void;

export class CostTracker {
  private readonly pricing: Map<string, CostConfig>;
  private readonly history: UsageRecord[] = [];
  private readonly listeners: Map<EventName, Set<EventCallback>> = new Map();
  private budgetLimit: number | null = null;

  constructor(pricing: Record<string, CostConfig>) {
    this.pricing = new Map(Object.entries(pricing));
    this.listeners.set('usage', new Set());
    this.listeners.set('budget-exceeded', new Set());
  }

  recordUsage(model: string, usage: TokenUsage): number {
    const config = this.pricing.get(model);
    const cost = config ? this.calculateCost(usage, config) : 0;

    const record: UsageRecord = { timestamp: Date.now(), model, usage, cost };
    this.history.push(record);

    this.emit('usage', record);

    if (this.budgetLimit !== null && this.getTotalCost() > this.budgetLimit) {
      this.emit('budget-exceeded', record);
    }

    return cost;
  }

  getTotalCost(): number {
    return this.history.reduce((sum, r) => sum + r.cost, 0);
  }

  getCostByModel(): Record<string, number> {
    const breakdown: Record<string, number> = {};
    for (const record of this.history) {
      breakdown[record.model] = (breakdown[record.model] ?? 0) + record.cost;
    }
    return breakdown;
  }

  getUsageHistory(): ReadonlyArray<Readonly<UsageRecord>> {
    return this.history;
  }

  reset(): void {
    this.history.length = 0;
  }

  setBudget(limitUsd: number): void {
    this.budgetLimit = limitUsd;
  }

  checkBudget(): { withinBudget: boolean; spent: number; remaining: number } {
    const spent = this.getTotalCost();
    const limit = this.budgetLimit ?? Infinity;
    return {
      withinBudget: spent <= limit,
      spent,
      remaining: limit === Infinity ? Infinity : limit - spent,
    };
  }

  on(event: 'usage' | 'budget-exceeded', callback: EventCallback): () => void {
    const listeners = this.listeners.get(event);
    if (!listeners) {
      return () => {};
    }
    listeners.add(callback);
    return () => {
      listeners.delete(callback);
    };
  }

  private emit(event: EventName, record: UsageRecord): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      for (const cb of listeners) {
        cb(record);
      }
    }
  }

  private calculateCost(usage: TokenUsage, config: CostConfig): number {
    const inputCost = (usage.inputTokens / 1000) * config.inputPer1k;
    const outputCost = (usage.outputTokens / 1000) * config.outputPer1k;
    const cacheReadCost = usage.cacheReadTokens
      ? (usage.cacheReadTokens / 1000) * (config.cacheReadPer1k ?? 0)
      : 0;
    const cacheWriteCost = usage.cacheCreationTokens
      ? (usage.cacheCreationTokens / 1000) * (config.cacheWritePer1k ?? 0)
      : 0;
    return inputCost + outputCost + cacheReadCost + cacheWriteCost;
  }
}

export function assertWithinBudget(tracker: CostTracker): void {
  const status = tracker.checkBudget();
  if (!status.withinBudget) {
    throw new BudgetExceededError(status.spent, status.spent - status.remaining);
  }
}
