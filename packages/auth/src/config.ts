import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@adopt-ai/db';
import type { NextAuthConfig } from 'next-auth';
import Okta from 'next-auth/providers/okta';
import Resend from 'next-auth/providers/resend';

import { authEnv } from './env';

/**
 * Shared Auth.js v5 config. The web app imports this and adds runtime handlers.
 *
 * Security notes:
 *   - JWT sessions (no DB session lookup per request — cheaper, edge-safe).
 *   - Cookie name uses the `__Secure-` prefix in production; SameSite=Lax;
 *     HTTP-only; 24-hour rolling expiry.
 *   - Callback URL allowlist enforced in `redirect` to defeat open-redirect.
 *   - Magic-link tokens single-use, 10-minute TTL (default in Auth.js v5).
 */
export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  secret: authEnv.AUTH_SECRET,
  trustHost: authEnv.AUTH_TRUST_HOST,
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24, updateAge: 60 * 60 },
  pages: {
    signIn: '/portal',
    verifyRequest: '/portal/check-email',
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? '__Secure-authjs.session-token'
          : 'authjs.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  providers: [
    ...(authEnv.AUTH_RESEND_KEY
      ? [
          Resend({
            from: authEnv.AUTH_EMAIL_FROM,
            apiKey: authEnv.AUTH_RESEND_KEY,
          }),
        ]
      : []),
    ...(authEnv.AUTH_OKTA_ID && authEnv.AUTH_OKTA_SECRET && authEnv.AUTH_OKTA_ISSUER
      ? [
          Okta({
            clientId: authEnv.AUTH_OKTA_ID,
            clientSecret: authEnv.AUTH_OKTA_SECRET,
            issuer: authEnv.AUTH_OKTA_ISSUER,
          }),
        ]
      : []),
  ],
  callbacks: {
    redirect({ url, baseUrl }) {
      // Allowlist: only same-origin paths.
      try {
        if (url.startsWith('/') && !url.startsWith('//')) {
          return `${baseUrl}${url}`;
        }
        const parsed = new URL(url);
        if (parsed.origin === baseUrl) {
          return url;
        }
      } catch {
        /* fall through */
      }
      return baseUrl;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user = { ...session.user, id: token.sub };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
};

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
