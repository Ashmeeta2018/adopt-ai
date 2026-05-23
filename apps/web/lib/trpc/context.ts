import { prisma } from '@adopt-ai/db';

import { auth } from '@/lib/auth';

interface Membership { organisationId: string; role: string }

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  memberships: Membership[];
}

export interface TrpcContext {
  prisma: typeof prisma;
  session: { user: SessionUser; expires: string } | null;
  ip: string | null;
}

export async function createContext(req: Request): Promise<TrpcContext> {
  const session = await auth();
  let enrichedSession: TrpcContext['session'] = null;

  if (session?.user) {
    const memberships = await prisma.membership.findMany({
      where: { userId: session.user.id },
      select: { organisationId: true, role: true },
    });
    enrichedSession = {
      ...session,
      user: { ...session.user, memberships },
    };
  }

  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? (forwarded.split(',')[0]?.trim() ?? null) : null;
  return { prisma, session: enrichedSession, ip };
}
