import type { AgentConfig, AgentKind, HealthGrade, IncomingTask } from './types;
import { AgentNotFoundError, AgentUnavailableError } from './errors;

interface RoutingEntry {
  agent: AgentConfig;
  healthStatus: HealthGrade;
}

export class TaskRouter {
  private readonly agents = new Map<string, RoutingEntry>();
  private readonly kindCounters = new Map<string, number>();

  registerAgent(agent: AgentConfig, healthStatus: HealthGrade = 'healthy'): void {
    this.agents.set(agent.id, {
      agent,
      healthStatus,
    });
  }

  unregisterAgent(agentId: string): void {
    this.agents.delete(agentId);
  }

  updateHealth(agentId: string, status: HealthGrade): void {
    const entry = this.agents.get(agentId);
    if (entry) {
      entry.healthStatus = status;
    }
  }

  route(task: IncomingTask): string {
    if (task.preferredAgentId) {
      return this.resolvePreferred(task.preferredAgentId);
    }
    return this.resolveBestMatch(task.organisationId, task.kind);
  }

  getAvailableAgents(organisationId: string, kind?: AgentKind): AgentConfig[] {
    return Array.from(this.agents.values())
      .filter((entry) => {
        if (entry.agent.organisationId !== organisationId) return false;
        if (entry.agent.status !== 'active') return false;
        if (entry.healthStatus === 'unhealthy') return false;
        if (kind !== undefined && entry.agent.kind !== kind) return false;
        return true;
      })
      .map((entry) => entry.agent);
  }

  private resolvePreferred(agentId: string): string {
    const entry = this.agents.get(agentId);
    if (!entry) {
      throw new AgentNotFoundError(agentId);
    }
    if (entry.agent.status !== 'active') {
      throw new AgentUnavailableError(agentId, `agent status is "${entry.agent.status}"`);
    }
    if (entry.healthStatus === 'unhealthy') {
      throw new AgentUnavailableError(agentId, 'agent health is "unhealthy"');
    }
    return agentId;
  }

  private resolveBestMatch(organisationId: string, kind: AgentKind): string {
    const candidates = Array.from(this.agents.values()).filter((entry) => {
      if (entry.agent.organisationId !== organisationId) return false;
      if (entry.agent.kind !== kind) return false;
      if (entry.agent.status !== 'active') return false;
      if (entry.healthStatus === 'unhealthy') return false;
      return true;
    });

    if (candidates.length === 0) {
      throw new AgentUnavailableError(
        'none',
        `no healthy ${kind} agent found for organisation ${organisationId}`,
      );
    }

    const healthy = candidates.filter((c) => c.healthStatus === 'healthy');
    const pool = healthy.length > 0 ? healthy : candidates;

    const key = `${organisationId}:${kind}`;
    const counter = this.kindCounters.get(key) ?? 0;
    const index = counter % pool.length;
    this.kindCounters.set(key, counter + 1);

    return pool[index].agent.id;
  }
}
