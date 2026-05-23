import {
  type PlanTier,
  type WorkspaceLimits,
  type WorkspaceAction,
  type ActionCheckResult,
  PlanTier as PlanTierValues,
} from "./types";

const UNLIMITED = null;

export const PLAN_LIMITS: Record<PlanTier, WorkspaceLimits> = {
  [PlanTierValues.SPARK]: {
    maxAgents: 1,
    maxTeamMembers: 2,
    maxWorkflowsPerAgent: 3,
    maxMonthlyRuns: 100,
  },
  [PlanTierValues.LIFT]: {
    maxAgents: 5,
    maxTeamMembers: 10,
    maxWorkflowsPerAgent: 10,
    maxMonthlyRuns: 1_000,
  },
  [PlanTierValues.SCALE]: {
    maxAgents: UNLIMITED,
    maxTeamMembers: 50,
    maxWorkflowsPerAgent: UNLIMITED,
    maxMonthlyRuns: UNLIMITED,
  },
};

interface UsageCounts {
  agents?: number;
  members?: number;
  workflows?: number;
  runsThisMonth?: number;
}

const ACTION_LIMIT_KEY: Record<
  WorkspaceAction,
  keyof Pick<WorkspaceLimits, "maxAgents" | "maxTeamMembers" | "maxWorkflowsPerAgent" | "maxMonthlyRuns">
> = {
  create_agent: "maxAgents",
  add_member: "maxTeamMembers",
  create_workflow: "maxWorkflowsPerAgent",
  run_workflow: "maxMonthlyRuns",
};

const ACTION_USAGE_KEY: Record<
  WorkspaceAction,
  keyof UsageCounts
> = {
  create_agent: "agents",
  add_member: "members",
  create_workflow: "workflows",
  run_workflow: "runsThisMonth",
};

const ACTION_LABEL: Record<WorkspaceAction, string> = {
  create_agent: "agents",
  add_member: "team members",
  create_workflow: "workflows per agent",
  run_workflow: "monthly runs",
};

export function getPlanLimits(plan: PlanTier): WorkspaceLimits {
  return PLAN_LIMITS[plan];
}

export function canPerformAction(
  action: WorkspaceAction,
  plan: PlanTier,
  currentUsage: UsageCounts,
): ActionCheckResult {
  const limits = PLAN_LIMITS[plan];
  const limitKey = ACTION_LIMIT_KEY[action];
  const usageKey = ACTION_USAGE_KEY[action];
  const limit = limits[limitKey];
  const current = currentUsage[usageKey] ?? 0;

  if (limit === UNLIMITED) {
    return { allowed: true };
  }

  if (current >= limit) {
    return {
      allowed: false,
      reason: `${ACTION_LABEL[action]} limit reached (${limit})`,
      limit,
      current,
    };
  }

  return { allowed: true, limit, current };
}

export function getPlanFeatures(plan: PlanTier): Record<string, boolean> {
  const spark = {
    basicAgents: true,
    emailSupport: true,
    dailyReports: true,
    customWorkflows: false,
    prioritySupport: false,
    realtimeFeed: false,
    oktaSso: false,
    customFineTuning: false,
    dedicatedArchitect: false,
    slaGuarantees: false,
    apiAccess: false,
  };

  const lift: Record<string, boolean> = {
    ...spark,
    customWorkflows: true,
    prioritySupport: true,
    realtimeFeed: true,
    oktaSso: true,
  };

  const scale: Record<string, boolean> = {
    ...lift,
    customFineTuning: true,
    dedicatedArchitect: true,
    slaGuarantees: true,
    apiAccess: true,
  };

  const FEATURES: Record<PlanTier, Record<string, boolean>> = {
    [PlanTierValues.SPARK]: spark,
    [PlanTierValues.LIFT]: lift,
    [PlanTierValues.SCALE]: scale,
  };

  return FEATURES[plan];
}
