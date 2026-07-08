import { agentsRouter, workflowsRouter } from './routers/agents';
import { authRouter } from './routers/auth';
import { marketingRouter } from './routers/marketing';
import { portalRouter } from './routers/portal';
import { router } from './trpc';

export const appRouter = router({
  marketing: marketingRouter,
  auth: authRouter,
  portal: portalRouter,
  agents: agentsRouter,
  workflows: workflowsRouter,
});

export type AppRouter = typeof appRouter;
