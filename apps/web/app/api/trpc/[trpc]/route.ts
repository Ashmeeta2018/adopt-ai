import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { createContext } from '@/lib/trpc/context';
import { appRouter } from '@/lib/trpc/router';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError({ error, path }) {
      console.error(`[trpc] ${path ?? '<no-path>'}`, error.message);
    },
  });

export { handler as GET, handler as POST };
