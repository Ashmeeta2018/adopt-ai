import { z } from "zod";
import type { Role } from "@adopt-ai/db";

export const PlanTierSchema = z.enum(["spark", "lift", "scale"]);

export const PlanTier = {
  SPARK: "spark",
  LIFT: "lift",
  SCALE: "scale",
} as const;

export type PlanTier = z.infer<typeof PlanTierSchema>;

export interface WorkspaceLimits {
  maxAgents: number | null;
  maxTeamMembers: number;
  maxWorkflowsPerAgent: number | null;
  maxMonthlyRuns: number | null;
}

export interface WorkspaceSettings {
  timezone: string;
  notificationEmail: string;
  slackWebhook?: string;
  oktaDomain?: string;
  features: Record<string, boolean>;
}

export interface WorkspaceMember {
  userId: string;
  email: string;
  name: string | null;
  role: Role;
  avatarUrl: string | null;
  joinedAt: Date;
}

export interface WorkspaceDashboard {
  org: {
    id: string;
    name: string;
    slug: string;
    plan: PlanTier;
  };
  limits: WorkspaceLimits;
  usage: {
    agentsActive: number;
    members: number;
    runsThisMonth: number;
  };
  member: WorkspaceMember;
}

export type WorkspaceAction =
  | "create_agent"
  | "add_member"
  | "run_workflow"
  | "create_workflow";

export interface ActionCheckResult {
  allowed: boolean;
  reason?: string;
  limit?: number;
  current?: number;
}

export interface UsageSnapshot {
  agentsActive: number;
  members: number;
  runsThisMonth: number;
  costThisMonthUsd: number;
}

export interface UsageTrendPoint {
  month: string;
  agentsActive: number;
  members: number;
  runs: number;
  costUsd: number;
}

export interface PlanDetails {
  tier: PlanTier;
  name: string;
  priceMonthly: number;
  limits: WorkspaceLimits;
  features: Record<string, boolean>;
}

export interface UpgradeImpact {
  currentPlan: PlanDetails;
  targetPlan: PlanDetails;
  newLimits: WorkspaceLimits;
  newFeatures: Record<string, boolean>;
  priceDifference: number;
}
