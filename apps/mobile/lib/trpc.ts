import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import superjson from 'superjson';

import type { AppRouter } from '@adopt-ai/api-contract';

const SESSION_KEY = 'adopt-auth-session';

export const trpc = createTRPCReact<AppRouter>();

const apiUrl =
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ?? 'http://localhost:3000/api';

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${apiUrl}/trpc`,
      transformer: superjson,
      async headers() {
        const token = await SecureStore.getItemAsync(SESSION_KEY);
        return token ? { Authorization: `Bearer ${token}` } : {};
      },
    }),
  ],
});
