/**
 * Ambient typings for the optionally-installed analytics SDKs.
 *
 * These packages are loaded via dynamic import() and every entry point
 * degrades to a no-op when the module is absent, so they are deliberately
 * not dependencies of this package. Only the surface we actually call is
 * declared here.
 */

interface OptionalSentryScope {
  setTag(key: string, value: string): void;
  setExtra(key: string, value: unknown): void;
  setUser(user: Record<string, string>): void;
}

interface OptionalSentryInitOptions {
  dsn?: string;
  environment?: string;
  tracesSampleRate?: number;
  beforeSend?(event: Record<string, unknown>): Record<string, unknown> | null;
}

declare module '@sentry/node' {
  export function init(options: OptionalSentryInitOptions): void;
  export function captureException(err: Error): string;
  export function withScope(fn: (scope: OptionalSentryScope) => void): void;
  export function addEventProcessor(
    fn: (event: Record<string, unknown>) => Record<string, unknown>,
  ): void;
}

declare module '@sentry/browser' {
  export function init(options: OptionalSentryInitOptions): void;
  export function captureException(err: Error): string;
  export function withScope(fn: (scope: OptionalSentryScope) => void): void;
}

declare module '@sentry/react-native' {
  export function init(options: OptionalSentryInitOptions): void;
  export function captureException(err: Error): string;
  export function withScope(fn: (scope: OptionalSentryScope) => void): void;
}

declare module '@vercel/analytics' {
  export function track(name: string, data?: Record<string, unknown>): void;
}
