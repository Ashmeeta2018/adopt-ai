import type { ReactNode } from 'react';

import type { AnalyticsEnv } from './env';
import type { AnalyticsEvent, ErrorContext } from './types';

interface SentryBrowserSdk {
  captureException: (err: Error) => string;
  withScope(fn: (scope: SentryBrowserScope) => void): void;
}

interface SentryBrowserScope {
  setTag(key: string, value: string): void;
  setExtra(key: string, value: unknown): void;
}

interface VercelAnalyticsApi {
  track(name: string, data?: Record<string, unknown>): void;
}

let browserSdk: SentryBrowserSdk | null = null;
let vercelAnalytics: VercelAnalyticsApi | null = null;

export async function initWebAnalytics(env: AnalyticsEnv): Promise<void> {
  const sentryDsn = env.NEXT_PUBLIC_SENTRY_DSN ?? env.SENTRY_DSN;

  if (sentryDsn) {
    try {
      const sentryModule = await import('@sentry/browser');
      sentryModule.init({
        dsn: sentryDsn,
        environment: env.SENTRY_ENVIRONMENT,
        tracesSampleRate: env.SENTRY_TRACES_SAMPLE_RATE,
      });
      browserSdk = sentryModule;
    } catch {
      // @sentry/browser not installed
    }
  }

  if (env.VERCEL_ANALYTICS_ID) {
    try {
      const va = await import('@vercel/analytics');
      vercelAnalytics = va;
    } catch {
      // @vercel/analytics not installed
    }
  }
}

export function captureWebError(context: ErrorContext): void {
  if (!browserSdk) return;

  browserSdk.withScope((scope) => {
    if (context.userId) scope.setTag('userId', context.userId);
    if (context.organisationId) scope.setTag('organisationId', context.organisationId);
    if (context.componentStack) scope.setExtra('componentStack', context.componentStack);
    if (context.extras) {
      for (const [key, value] of Object.entries(context.extras)) {
        scope.setExtra(key, value);
      }
    }
    browserSdk!.captureException(context.error);
  });
}

export function trackWebEvent(event: AnalyticsEvent): void {
  vercelAnalytics?.track(event.name, {
    ...event.properties,
    timestamp: (event.timestamp ?? new Date()).toISOString(),
  });
}

export function trackPageView(path: string): void {
  vercelAnalytics?.track('page_view', { path });
}

export function WebAnalyticsProvider({ children }: { children: ReactNode }): ReactNode {
  return children;
}
