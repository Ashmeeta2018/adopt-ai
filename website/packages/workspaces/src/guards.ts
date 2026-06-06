import type { PrismaClient, Role } from "@adopt-ai/db";
import { InsufficientPermissionsError } from "./errors";

type RoleChecker = (role: Role) => boolean;

export function requireRole(roles: Role | Role[]): RoleChecker {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (role: Role) => allowed.includes(role);
}

export async function requireOwner(
  prisma: PrismaClient,
  organisationId: string,
  userId: string,
): Promise<void> {
  const membership = await prisma.membership.findUnique({
    where: { userId_organisationId: { userId, organisationId } },
  });
  if (!membership || membership.role !== "OWNER") {
    throw new InsufficientPermissionsError(userId, organisationId, "owner-only action");
  }
}

export async function requireAdmin(
  prisma: PrismaClient,
  organisationId: string,
  userId: string,
): Promise<void> {
  const membership = await prisma.membership.findUnique({
    where: { userId_organisationId: { userId, organisationId } },
  });
  if (!membership || (membership.role !== "OWNER" && membership.role !== "ADMIN")) {
    throw new InsufficientPermissionsError(userId, organisationId, "admin-only action");
  }
}

export async function requireMember(
  prisma: PrismaClient,
  organisationId: string,
  userId: string,
): Promise<void> {
  const membership = await prisma.membership.findUnique({
    where: { userId_organisationId: { userId, organisationId } },
  });
  if (!membership) {
    throw new InsufficientPermissionsError(userId, organisationId, "member-only action");
  }
}

export async function canAccessAgent(
  prisma: PrismaClient,
  organisationId: string,
  userId: string,
  agentId: string,
): Promise<boolean> {
  const [membership, agent] = await Promise.all([
    prisma.membership.findUnique({
      where: { userId_organisationId: { userId, organisationId } },
    }),
    prisma.agent.findUnique({
      where: { id: agentId },
      select: { organisationId: true },
    }),
  ]);

  if (!membership || !agent) {
    return false;
  }

  return agent.organisationId === organisationId;
}
