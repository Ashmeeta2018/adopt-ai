/**
 * Contract router — type-level twin of the runtime router in apps/web/lib/trpc/router.ts.
 *
 * Why split: this package is imported by apps/mobile (no server dependencies). The router
 * implementation would pull Prisma, Auth.js, Pino — none of which belong in a mobile binary.
 *
 * This is a *real* tRPC router so `createTRPCReact<AppRouter>` gets full inference on
 * stable tRPC v11 (hand-written contract interfaces no longer decorate). Every resolver
 * throws — the runtime implementation lives in apps/web, and mobile only ever does
 * `import type { AppRouter }`, which is erased at compile time.
 *
 * Rules for adding entries here:
 *   - Mirror the procedure kind (query/mutation/subscription) of the web implementation.
 *   - Input and output schemas come from packages/api-contract/src/schemas/*.
 *   - `.output()` is mandatory — it is what gives the client its return types.
 */

import { initTRPC } from '@trpc/server';
import superjson from 'superjson';

import {
  // portal
  agentDetailInput,
  agentDetailOutput,
  dashboardOutput,
  type feedEvent,
  listAlertsInput,
  listAlertsOutput,
  markAlertReadInput,
  markAlertReadOutput,
  settingsOutput,
  weeklyReportInput,
  weeklyReportOutput,
  // auth
  requestMagicLinkInput,
  requestMagicLinkOutput,
  // agents + workflows
  agentIdInput,
  agentRunsInput,
  agentListItem,
  agentGetOutput,
  paginatedRunsOutput,
  togglePauseInput,
  workflowIdInput,
  workflowExecutionsInput,
  workflowListItem,
  workflowGetOutput,
  paginatedExecutionsOutput,
} from './schemas';
import { contactSubmitInput, contactSubmitOutput } from './schemas/marketing';
import { streamFeedInput } from './schemas/portal';

import type { z } from 'zod';

const t = initTRPC.create({ transformer: superjson });

function contractOnly(): never {
  throw new Error(
    'Contract-only router — the runtime implementation lives in apps/web/lib/trpc/router.ts.',
  );
}

export const appRouterContract = t.router({
  // ── Marketing ──────────────────────────────────────────────
  marketing: t.router({
    contact: t.router({
      submit: t.procedure
        .input(contactSubmitInput)
        .output(contactSubmitOutput)
        .mutation(contractOnly),
    }),
  }),

  // ── Auth ───────────────────────────────────────────────────
  auth: t.router({
    requestMagicLink: t.procedure
      .input(requestMagicLinkInput)
      .output(requestMagicLinkOutput)
      .mutation(contractOnly),
  }),

  // ── Portal (dashboard, agent detail, weekly report, alerts) ─
  portal: t.router({
    getDashboard: t.procedure.output(dashboardOutput).query(contractOnly),
    getAgent: t.procedure.input(agentDetailInput).output(agentDetailOutput).query(contractOnly),
    streamFeed: t.procedure.input(streamFeedInput).subscription(
      // Contract stub — throws before yielding or awaiting anything.
      // eslint-disable-next-line require-yield, @typescript-eslint/require-await
      async function* (): AsyncGenerator<z.infer<typeof feedEvent>> {
        contractOnly();
      },
    ),
    getWeeklyReport: t.procedure
      .input(weeklyReportInput)
      .output(weeklyReportOutput)
      .query(contractOnly),
    listAlerts: t.procedure.input(listAlertsInput).output(listAlertsOutput).query(contractOnly),
    markAlertRead: t.procedure
      .input(markAlertReadInput)
      .output(markAlertReadOutput)
      .mutation(contractOnly),
    getSettings: t.procedure.output(settingsOutput).query(contractOnly),
  }),

  // ── Agents ─────────────────────────────────────────────────
  agents: t.router({
    /** List all non-deleted agents for the caller's organisation. */
    list: t.procedure.output(agentListItem.array()).query(contractOnly),
    /** Get a single agent by ID (includes last 10 runs + workflow graph). */
    get: t.procedure.input(agentIdInput).output(agentGetOutput.nullable()).query(contractOnly),
    /** Cursor-paginated run history for a single agent (50/page). */
    runs: t.procedure.input(agentRunsInput).output(paginatedRunsOutput).query(contractOnly),
    /** Pause or resume an agent — requires OWNER or ADMIN role. */
    togglePause: t.procedure.input(togglePauseInput).output(agentListItem).mutation(contractOnly),
  }),

  // ── Workflows ──────────────────────────────────────────────
  workflows: t.router({
    /** List all non-deleted workflows for the caller's organisation. */
    list: t.procedure.output(workflowListItem.array()).query(contractOnly),
    /** Get a single workflow by ID (includes agents + last 10 executions). */
    get: t.procedure
      .input(workflowIdInput)
      .output(workflowGetOutput.nullable())
      .query(contractOnly),
    /** Cursor-paginated execution history for a single workflow (50/page). */
    executions: t.procedure
      .input(workflowExecutionsInput)
      .output(paginatedExecutionsOutput)
      .query(contractOnly),
  }),
});

/**
 * Web side implements this contract in apps/web/lib/trpc/router.ts.
 * Mobile imports this type (type-only — erased at compile time) to type its client.
 */
export type AppRouter = typeof appRouterContract;

/** @deprecated superseded by the real router type above; kept for existing imports. */
export type AppRouterContract = AppRouter;
