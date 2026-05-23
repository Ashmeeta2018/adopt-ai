/**
 * Router *types* live here. The runtime implementation lives in apps/web/lib/trpc/router.ts.
 *
 * Why split: this package is imported by apps/mobile (no server dependencies). The router
 * implementation would pull Prisma, Auth.js, Pino — none of which belong in a mobile binary.
 *
 * The implementation file imports these types and asserts compatibility.
 */

import type { z } from 'zod';

import type {
  // portal
  agentDetailInput,
  agentDetailOutput,
  dashboardOutput,
  feedEvent,
  listAlertsInput,
  listAlertsOutput,
  markAlertReadInput,
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
import type { contactSubmitInput, contactSubmitOutput } from './schemas/marketing';
import type { streamFeedInput } from './schemas/portal';

/**
 * Shape of the AppRouter.
 *
 * Mobile derives its tRPC client types from this interface — it never imports
 * the runtime implementation in apps/web/lib/trpc/router.ts.
 *
 * Rules for adding entries here:
 *   - Input types come from a named `*Input` export in packages/api-contract/src/schemas/*.
 *   - Output types come from a named `*Output` or `*Item` export in the same location.
 *   - `void` is used for procedures that take no input.
 *   - `null` is included in output unions when the procedure can return nothing
 *     (e.g. `agentsRouter.get` returns null when the agent is not found).
 */
export interface AppRouterContract {
  // ── Marketing ──────────────────────────────────────────────
  marketing: {
    contact: {
      submit: {
        input: z.infer<typeof contactSubmitInput>;
        output: z.infer<typeof contactSubmitOutput>;
      };
    };
  };

  // ── Auth ───────────────────────────────────────────────────
  auth: {
    requestMagicLink: {
      input: z.infer<typeof requestMagicLinkInput>;
      output: z.infer<typeof requestMagicLinkOutput>;
    };
  };

  // ── Portal (dashboard, agent detail, weekly report, alerts) ─
  portal: {
    getDashboard: {
      input: void;
      output: z.infer<typeof dashboardOutput>;
    };
    getAgent: {
      input: z.infer<typeof agentDetailInput>;
      output: z.infer<typeof agentDetailOutput>;
    };
    streamFeed: {
      input: z.infer<typeof streamFeedInput>;
      output: AsyncIterable<z.infer<typeof feedEvent>>;
    };
    getWeeklyReport: {
      input: z.infer<typeof weeklyReportInput>;
      output: z.infer<typeof weeklyReportOutput>;
    };
    listAlerts: {
      input: z.infer<typeof listAlertsInput>;
      output: z.infer<typeof listAlertsOutput>;
    };
    markAlertRead: {
      input: z.infer<typeof markAlertReadInput>;
      output: { ok: true };
    };
  };

  // ── Agents ─────────────────────────────────────────────────
  agents: {
    /** List all non-deleted agents for the caller's organisation. */
    list: {
      input: void;
      output: z.infer<typeof agentListItem>[];
    };
    /** Get a single agent by ID (includes last 10 runs + workflow graph). */
    get: {
      input: z.infer<typeof agentIdInput>;
      output: z.infer<typeof agentGetOutput> | null;
    };
    /** Cursor-paginated run history for a single agent (50/page). */
    runs: {
      input: z.infer<typeof agentRunsInput>;
      output: z.infer<typeof paginatedRunsOutput>;
    };
    /** Pause or resume an agent — requires OWNER or ADMIN role. */
    togglePause: {
      input: z.infer<typeof togglePauseInput>;
      output: z.infer<typeof agentListItem>;
    };
  };

  // ── Workflows ──────────────────────────────────────────────
  workflows: {
    /** List all non-deleted workflows for the caller's organisation. */
    list: {
      input: void;
      output: z.infer<typeof workflowListItem>[];
    };
    /** Get a single workflow by ID (includes agents + last 10 executions). */
    get: {
      input: z.infer<typeof workflowIdInput>;
      output: z.infer<typeof workflowGetOutput> | null;
    };
    /** Cursor-paginated execution history for a single workflow (50/page). */
    executions: {
      input: z.infer<typeof workflowExecutionsInput>;
      output: z.infer<typeof paginatedExecutionsOutput>;
    };
  };
}

/**
 * Web side imports AppRouter from apps/web/lib/trpc/router.ts.
 * Mobile imports this type to type the tRPC client.
 */
export type AppRouter = AppRouterContract;
