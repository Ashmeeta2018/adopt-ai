import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import Constants from 'expo-constants';
import superjson from 'superjson';

import type { AppRouter } from '@adopt-ai/api-contract';

// AppRouter is a contract interface, not a runtime Router instance.
// tRPC requires `extends AnyRouter` but the contract-only type can't satisfy that.
// Runtime works fine — the client only needs the procedure shape for type inference.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error AppRouter is a contract interface, not a concrete Router
export const trpc = createTRPCReact<AppRouter>();

const apiUrl =
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ??
  'http://localhost:3000/api';

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${apiUrl}/trpc`,
      transformer: superjson,
    }),
  ],
});
