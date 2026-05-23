import type { AnalyticsEnv } from './env';
import type { AnalyticsEvent, ErrorContext } from './types';

interface SentryMobileSdk {
  captureException: (err: Error) => string;
  withScope(fn: (scope: SentryMobileScope) => void): void;
}

interface SentryMobileScope {
  setTag(key: string, value: string): void;
  setExtra(key: string, value: unknown): void;
}

let mobileSdk: SentryMobileSdk | null = null;

export async function initMobileAnalytics(env: AnalyticsEnv): Promise<void> {
  if (!env.SENTRY_DSN) return;

  try {
    const sentryModule = await import('@sentry/react-native');
    sentryModule.init({
      dsn: env.SENTRY_DSN,
      environment: env.SENTRY_ENVIRONMENT,
      tracesSampleRate: env.SENTRY_TRACES_SAMPLE_RATE,
    });
    mobileSdk = sentryModule;
  } catch {
    // @sentry/react-native not installed
  }
}

export function captureMobileError(context: ErrorContext): void {
  if (!mobileSdk) return;

  mobileSdk.withScope((scope) => {
    if (context.userId) scope.setTag('userId', context.userId);
    if (context.organisationId) scope.setTag('organisationId', context.organisationId);
    if (context.componentStack) scope.setExtra('componentStack', context.componentStack);
    if (context.extras) {
      for (const [key, value] of Object.entries(context.extras)) {
        scope.setExtra(key, value);
      }
    }
    mobileSdk!.captureException(context.error);
  });
}

export function trackMobileEvent(event: AnalyticsEvent): void {
  const timestamp = event.timestamp ?? new Date();

  if (mobileSdk) {
    mobileSdk.withScope((scope) => {
      scope.setTag('event_name', event.name);
      scope.setExtra('event_properties', event.properties);
      scope.setExtra('event_timestamp', timestamp.toISOString());
      mobileSdk!.captureException(new Error(`[analytics] ${event.name}`));
    });
  }
}
