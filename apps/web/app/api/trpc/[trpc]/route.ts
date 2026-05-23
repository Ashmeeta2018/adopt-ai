import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { appRouter } from '@/lib/trpc/router';
import { createContext } from '@/lib/trpc/context';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError({ error, path }) {
      // eslint-disable-next-line no-console
      console.error(`[trpc] ${path ?? '<no-path>'}`, error.message);
    },
  });

export { handler as GET, handler as POST };
