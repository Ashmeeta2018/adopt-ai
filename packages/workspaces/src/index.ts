import { WorkspaceService } from './service';

import type { PrismaClient } from '@adopt-ai/db';

export { WorkspaceService } from './service';

export {
  WorkspaceNotFoundError,
  InsufficientPermissionsError,
  PlanLimitExceededError,
  MemberAlreadyExistsError,
} from './errors';

export { PlanTier, PlanTierSchema } from './types';

export { getPlanLimits, canPerformAction, getPlanFeatures, PLAN_LIMITS } from './limits';

export { requireRole, requireOwner, requireAdmin, requireMember, canAccessAgent } from './guards';

export type {
  WorkspaceLimits,
  WorkspaceSettings,
  WorkspaceMember,
  WorkspaceDashboard,
  WorkspaceAction,
  ActionCheckResult,
  UsageSnapshot,
  UsageTrendPoint,
  PlanDetails,
  UpgradeImpact,
} from './types';

export function createWorkspaceService(prisma: PrismaClient): WorkspaceService {
  return new WorkspaceService(prisma);
}
