/**
 * Test helper for mocking tRPC hooks in screen tests.
 *
 * Usage:
 *   mockTrpc({
 *     'portal.getDashboard': { data: createDashboardResponse() },
 *     'portal.listAlerts': { isLoading: true },
 *   });
 */
export function mockTrpc(procedures: Record<string, Partial<QueryResult>>) {
  // Build a proxy that handles router.procedure.useQuery patterns
  const proxy = new Proxy({} as Record<string, unknown>, {
    get(target, prop: string) {
      if (target[prop]) return target[prop];
      // Check if this is a top-level router
      const matchingProcedures = Object.keys(procedures).filter((k) => k.startsWith(prop + '.'));
      if (matchingProcedures.length > 0) {
        const nested = new Proxy({} as Record<string, unknown>, {
          get(_, method: string) {
            // Handle .useQuery() and .useQuery(undefined, opts)
            const path = `${prop}.${method}`;
            if (procedures[path]) {
              return (_input?: unknown, _opts?: unknown) => ({
                data: undefined,
                isLoading: false,
                error: null,
                ...procedures[path],
              });
            }
            return jest.fn();
          },
        });
        target[prop] = nested;
        return nested;
      }
      return jest.fn();
    },
  });

  return proxy;
}

interface QueryResult {
  data: unknown;
  isLoading: boolean;
  error: unknown;
}
