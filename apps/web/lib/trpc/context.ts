import { prisma } from '@adopt-ai/db';

import { auth } from '@/lib/auth';

interface Membership {
  organisationId: string;
  role: string;
}

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

/**
 * Validate an Okta access token by calling the userinfo endpoint.
 * Returns the user's email if valid, null otherwise.
 */
async function validateOktaToken(token: string): Promise<string | null> {
  const issuer = process.env.AUTH_OKTA_ISSUER;
  if (!issuer) return null;
  try {
    const res = await fetch(`${issuer}/userinfo`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { email?: string };
    return typeof body.email === 'string' ? body.email : null;
  } catch {
    return null;
  }
}

export async function createContext(req: Request): Promise<TrpcContext> {
  // ── 1. Bearer token (mobile / API clients) ───────────────────────
  const authHeader = req.headers.get('authorization');
  const bearerMatch = authHeader?.match(/^Bearer\s+(.+)$/i);

  if (bearerMatch?.[1]) {
    const email = await validateOktaToken(bearerMatch[1]);
    if (email) {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, name: true, email: true, image: true },
      });
      if (user) {
        const memberships = await prisma.membership.findMany({
          where: { userId: user.id },
          select: { organisationId: true, role: true },
        });
        const forwarded = req.headers.get('x-forwarded-for');
        const ip = forwarded ? (forwarded.split(',')[0]?.trim() ?? null) : null;
        return {
          prisma,
          session: {
            user: { ...user, memberships },
            expires: new Date(Date.now() + 86_400_000).toISOString(),
          },
          ip,
        };
      }
    }
  }

  // ── 2. Cookie-based session (web browser) ─────────────────────────
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
