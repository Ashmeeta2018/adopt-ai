import { authConfig } from '@adopt-ai/auth';
import NextAuth from 'next-auth';

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
