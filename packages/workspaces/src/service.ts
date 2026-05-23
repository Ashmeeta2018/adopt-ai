import type { PrismaClient, Role } from "@adopt-ai/db";
import {
  type PlanTier,
  type WorkspaceDashboard,
  type WorkspaceLimits,
  type WorkspaceMember,
  type WorkspaceSettings,
  type UsageSnapshot,
  type UsageTrendPoint,
  type PlanDetails,
  type UpgradeImpact,
} from "./types";
import { PlanTier as PlanTierValues, PlanTierSchema } from "./types";
import {
  getPlanLimits,
  getPlanFeatures,
  canPerformAction,
} from "./limits";
import {
  WorkspaceNotFoundError,
  InsufficientPermissionsError,
  MemberAlreadyExistsError,
} from "./errors";

const PLAN_NAMES: Record<PlanTier, string> = {
  [PlanTierValues.SPARK]: "Spark",
  [PlanTierValues.LIFT]: "Lift",
  [PlanTierValues.SCALE]: "Scale",
};

const PLAN_PRICES: Record<PlanTier, number> = {
  [PlanTierValues.SPARK]: 0,
  [PlanTierValues.LIFT]: 49,
  [PlanTierValues.SCALE]: 199,
};

const PLAN_ORDER: PlanTier[] = [
  PlanTierValues.SPARK,
  PlanTierValues.LIFT,
  PlanTierValues.SCALE,
];

function toWorkspaceMember(m: {
  userId: string;
  user: { email: string; name: string | null; image: string | null };
  role: Role;
  createdAt: Date;
}): WorkspaceMember {
  return {
    userId: m.userId,
    email: m.user.email,
    name: m.user.name,
    role: m.role,
    avatarUrl: m.user.image,
    joinedAt: m.createdAt,
  };
}

export class WorkspaceService {
  private readonly db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async getWorkspace(
    organisationId: string,
    currentUserId: string,
  ): Promise<WorkspaceDashboard> {
    const [org, membership] = await Promise.all([
      this.db.organisation.findUnique({
        where: { id: organisationId },
      }),
      this.db.membership.findUnique({
        where: {
          userId_organisationId: {
            userId: currentUserId,
            organisationId,
          },
        },
        include: { user: true },
      }),
    ]);

    if (!org) {
      throw new WorkspaceNotFoundError(organisationId);
    }
    if (!membership) {
      throw new InsufficientPermissionsError(
        currentUserId,
        organisationId,
        "view workspace",
      );
    }

    const plan = PlanTierSchema.parse(org.plan);
    const limits = getPlanLimits(plan);

    const [activeAgents, memberCount, runsThisMonth] = await Promise.all([
      this.db.agent.count({
        where: { organisationId, deletedAt: null, status: "RUNNING" },
      }),
      this.db.membership.count({ where: { organisationId } }),
      this.db.agentRun.count({
        where: {
          agent: { organisationId },
          ts: { gte: startOfMonth() },
        },
      }),
    ]);

    return {
      org: { id: org.id, name: org.name, slug: org.slug, plan },
      limits,
      usage: { agentsActive: activeAgents, members: memberCount, runsThisMonth },
      member: toWorkspaceMember(membership),
    };
  }

  async updateSettings(
    organisationId: string,
    settings: Partial<WorkspaceSettings>,
  ): Promise<void> {
    const org = await this.db.organisation.findUnique({
      where: { id: organisationId },
    });
    if (!org) {
      throw new WorkspaceNotFoundError(organisationId);
    }

    await this.db.organisation.update({
      where: { id: organisationId },
      data: { updatedAt: new Date() },
    });
  }

  async getLimits(organisationId: string): Promise<{
    plan: PlanTier;
    limits: WorkspaceLimits;
    usage: { agentsActive: number; members: number; runsThisMonth: number };
  }> {
    const org = await this.db.organisation.findUnique({
      where: { id: organisationId },
    });
    if (!org) {
      throw new WorkspaceNotFoundError(organisationId);
    }

    const plan = PlanTierSchema.parse(org.plan);
    const [agentsActive, members, runsThisMonth] = await Promise.all([
      this.db.agent.count({
        where: { organisationId, deletedAt: null, status: "RUNNING" },
      }),
      this.db.membership.count({ where: { organisationId } }),
      this.db.agentRun.count({
        where: {
          agent: { organisationId },
          ts: { gte: startOfMonth() },
        },
      }),
    ]);

    return {
      plan,
      limits: getPlanLimits(plan),
      usage: { agentsActive, members, runsThisMonth },
    };
  }

  async listMembers(organisationId: string): Promise<WorkspaceMember[]> {
    const org = await this.db.organisation.findUnique({
      where: { id: organisationId },
    });
    if (!org) {
      throw new WorkspaceNotFoundError(organisationId);
    }

    const memberships = await this.db.membership.findMany({
      where: { organisationId },
      include: { user: true },
      orderBy: { createdAt: "asc" },
    });

    return memberships.map(toWorkspaceMember);
  }

  async inviteMember(
    organisationId: string,
    email: string,
    role: Role,
  ): Promise<WorkspaceMember> {
    const org = await this.db.organisation.findUnique({
      where: { id: organisationId },
    });
    if (!org) {
      throw new WorkspaceNotFoundError(organisationId);
    }

    const plan = PlanTierSchema.parse(org.plan);
    const memberCount = await this.db.membership.count({
      where: { organisationId },
    });

    const check = canPerformAction("add_member", plan, { members: memberCount });
    if (!check.allowed) {
      throw new Error(
        check.reason ?? "Team member limit reached",
      );
    }

    const user = await this.db.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error(`No user found with email ${email}`);
    }

    const existing = await this.db.membership.findUnique({
      where: {
        userId_organisationId: { userId: user.id, organisationId },
      },
    });
    if (existing) {
      throw new MemberAlreadyExistsError(user.id, organisationId);
    }

    const membership = await this.db.membership.create({
      data: { userId: user.id, organisationId, role },
      include: { user: true },
    });

    return toWorkspaceMember(membership);
  }

  async removeMember(organisationId: string, userId: string): Promise<void> {
    const org = await this.db.organisation.findUnique({
      where: { id: organisationId },
    });
    if (!org) {
      throw new WorkspaceNotFoundError(organisationId);
    }

    const membership = await this.db.membership.findUnique({
      where: {
        userId_organisationId: { userId, organisationId },
      },
    });
    if (!membership) {
      throw new InsufficientPermissionsError(userId, organisationId, "remove");
    }
    if (membership.role === "OWNER") {
      throw new InsufficientPermissionsError(userId, organisationId, "remove owner");
    }

    await this.db.membership.delete({
      where: { id: membership.id },
    });
  }

  async updateRole(
    organisationId: string,
    userId: string,
    role: Role,
  ): Promise<WorkspaceMember> {
    const org = await this.db.organisation.findUnique({
      where: { id: organisationId },
    });
    if (!org) {
      throw new WorkspaceNotFoundError(organisationId);
    }

    const membership = await this.db.membership.findUnique({
      where: {
        userId_organisationId: { userId, organisationId },
      },
      include: { user: true },
    });
    if (!membership) {
      throw new InsufficientPermissionsError(userId, organisationId, "update role");
    }
    if (membership.role === "OWNER" && role !== "OWNER") {
      throw new InsufficientPermissionsError(userId, organisationId, "demote owner");
    }

    const updated = await this.db.membership.update({
      where: { id: membership.id },
      data: { role },
      include: { user: true },
    });

    return toWorkspaceMember(updated);
  }

  async getMembership(
    userId: string,
    organisationId: string,
  ): Promise<Role | null> {
    const membership = await this.db.membership.findUnique({
      where: {
        userId_organisationId: { userId, organisationId },
      },
    });
    return membership?.role ?? null;
  }

  async getUsage(organisationId: string): Promise<UsageSnapshot> {
    const org = await this.db.organisation.findUnique({
      where: { id: organisationId },
    });
    if (!org) {
      throw new WorkspaceNotFoundError(organisationId);
    }

    const monthStart = startOfMonth();

    const [agentsActive, members, runs, reports] = await Promise.all([
      this.db.agent.count({
        where: { organisationId, deletedAt: null, status: "RUNNING" },
      }),
      this.db.membership.count({ where: { organisationId } }),
      this.db.agentRun.count({
        where: { agent: { organisationId }, ts: { gte: monthStart } },
      }),
      this.db.weeklyReport.findMany({
        where: { organisationId, weekStart: { gte: monthStart } },
        select: { costReducedUsd: true },
      }),
    ]);

    const costThisMonthUsd = reports.reduce(
      (sum, r) => sum + Number(r.costReducedUsd),
      0,
    );

    return { agentsActive, members, runsThisMonth: runs, costThisMonthUsd };
  }

  async getUsageTrend(
    organisationId: string,
    months: number = 6,
  ): Promise<UsageTrendPoint[]> {
    const org = await this.db.organisation.findUnique({
      where: { id: organisationId },
    });
    if (!org) {
      throw new WorkspaceNotFoundError(organisationId);
    }

    const points: UsageTrendPoint[] = [];

    for (let i = months - 1; i >= 0; i--) {
      const start = startOfMonthNMonthsAgo(i);
      const end = startOfMonthNMonthsAgo(i - 1);
      const label = start.toISOString().slice(0, 7);

      const [agents, memberCount, runs, reports] = await Promise.all([
        this.db.agent.count({
          where: {
            organisationId,
            deletedAt: null,
            status: "RUNNING",
            createdAt: { lt: end },
          },
        }),
        this.db.membership.count({
          where: {
            organisationId,
            createdAt: { lt: end },
          },
        }),
        this.db.agentRun.count({
          where: {
            agent: { organisationId },
            ts: { gte: start, lt: end },
          },
        }),
        this.db.weeklyReport.findMany({
          where: { organisationId, weekStart: { gte: start, lt: end } },
          select: { costReducedUsd: true },
        }),
      ]);

      const costUsd = reports.reduce(
        (sum, r) => sum + Number(r.costReducedUsd),
        0,
      );

      points.push({ month: label, agentsActive: agents, members: memberCount, runs, costUsd });
    }

    return points;
  }

  async getCurrentPlan(organisationId: string): Promise<PlanDetails> {
    const org = await this.db.organisation.findUnique({
      where: { id: organisationId },
    });
    if (!org) {
      throw new WorkspaceNotFoundError(organisationId);
    }

    const tier = PlanTierSchema.parse(org.plan);
    return {
      tier,
      name: PLAN_NAMES[tier],
      priceMonthly: PLAN_PRICES[tier],
      limits: getPlanLimits(tier),
      features: getPlanFeatures(tier),
    };
  }

  async canUpgrade(
    organisationId: string,
    targetPlan: PlanTier,
  ): Promise<boolean> {
    const org = await this.db.organisation.findUnique({
      where: { id: organisationId },
    });
    if (!org) {
      throw new WorkspaceNotFoundError(organisationId);
    }

    const currentIndex = PLAN_ORDER.indexOf(PlanTierSchema.parse(org.plan));
    const targetIndex = PLAN_ORDER.indexOf(targetPlan);

    return targetIndex > currentIndex;
  }

  async getUpgradeImpact(
    organisationId: string,
    targetPlan: PlanTier,
  ): Promise<UpgradeImpact> {
    const org = await this.db.organisation.findUnique({
      where: { id: organisationId },
    });
    if (!org) {
      throw new WorkspaceNotFoundError(organisationId);
    }

    const currentTier = PlanTierSchema.parse(org.plan);
    const currentPlan: PlanDetails = {
      tier: currentTier,
      name: PLAN_NAMES[currentTier],
      priceMonthly: PLAN_PRICES[currentTier],
      limits: getPlanLimits(currentTier),
      features: getPlanFeatures(currentTier),
    };

    const target: PlanDetails = {
      tier: targetPlan,
      name: PLAN_NAMES[targetPlan],
      priceMonthly: PLAN_PRICES[targetPlan],
      limits: getPlanLimits(targetPlan),
      features: getPlanFeatures(targetPlan),
    };

    return {
      currentPlan,
      targetPlan: target,
      newLimits: target.limits,
      newFeatures: target.features,
      priceDifference: target.priceMonthly - currentPlan.priceMonthly,
    };
  }
}

function startOfMonth(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

function startOfMonthNMonthsAgo(monthsAgo: number): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - monthsAgo, 1));
}
