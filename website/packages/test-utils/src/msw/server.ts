import type { MswRequest } from './handlers';

interface SetupResult {
  handlers: MswRequest[];
  use(overrides: MswRequest[]): void;
  restore(): void;
}

/**
 * Creates a test server setup for use with MSW in consuming apps.
 * The actual MSW setup is deferred — this module provides the handler
 * shape and lifecycle so the consuming app can wire it into `setupServer()`
 * or `setupWorker()` from MSW.
 */
export function createTestServer(handlers: MswRequest[] = []): SetupResult {
  const original = [...handlers];

  return {
    handlers: original,
    use(overrides: MswRequest[]): void {
      handlers.length = 0;
      handlers.push(...original, ...overrides);
    },
    restore(): void {
      handlers.length = 0;
      handlers.push(...original);
    },
  };
}
