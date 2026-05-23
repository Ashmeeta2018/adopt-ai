import type { AnalyticsEnv } from './env';
import type { AnalyticsEvent, ErrorContext, PerformanceMetric } from './types';

interface SentryCapture {
  (err: Error): string;
}

interface SentryScope {
  setTag(key: string, value: string): void;
  setExtra(key: string, value: unknown): void;
  setUser(user: Record<string, string>): void;
}

interface SentrySdk {
  captureException: SentryCapture;
  withScope(fn: (scope: SentryScope) => void): void;
  addEventProcessor(fn: (event: Record<string, unknown>) => Record<string, unknown>): void;
}

let serverSdk: SentrySdk | null = null;

const PII_FIELDS = [
  'email', 'password', 'token', 'ip_address', 'phone', 'name',
  'authorization', 'cookie', 'session',
] as const;

function stripPiiFromObject(obj: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const lower = key.toLowerCase();
    const isPii = PII_FIELDS.some((field) => lower.includes(field));
    if (isPii) {
      cleaned[key] = '[Filtered]';
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      cleaned[key] = stripPiiFromObject(value as Record<string, unknown>);
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

export async function initServerAnalytics(env: AnalyticsEnv): Promise<void> {
  if (!env.SENTRY_DSN) return;

  try {
    const sentryModule = await import('@sentry/node');
    sentryModule.init({
      dsn: env.SENTRY_DSN,
      environment: env.SENTRY_ENVIRONMENT,
      tracesSampleRate: env.SENTRY_TRACES_SAMPLE_RATE,
      beforeSend(event) {
        return stripPiiFromObject(event) as typeof event;
      },
    });
    serverSdk = sentryModule;
  } catch {
    // @sentry/node not installed — analytics is a no-op
  }
}

export function captureServerError(context: ErrorContext): void {
  if (!serverSdk) return;

  serverSdk.withScope((scope) => {
    if (context.userId) scope.setTag('userId', context.userId);
    if (context.organisationId) scope.setTag('organisationId', context.organisationId);
    if (context.componentStack) scope.setExtra('componentStack', context.componentStack);
    if (context.extras) {
      for (const [key, value] of Object.entries(context.extras)) {
        scope.setExtra(key, value);
      }
    }
    serverSdk!.captureException(context.error);
  });
}

export function trackServerEvent(event: AnalyticsEvent): void {
  const timestamp = event.timestamp ?? new Date();

  if (serverSdk) {
    serverSdk.addEventProcessor((sentryEvent) => {
      const breadcrumbs = (sentryEvent.breadcrumbs ?? []) as Record<string, unknown>[];
      breadcrumbs.push({
        type: 'info',
        category: 'analytics',
        message: event.name,
        data: event.properties,
        timestamp: timestamp.getTime() / 1000,
      });
      return { ...sentryEvent, breadcrumbs };
    });
  }
}

export function trackPerformance(metric: PerformanceMetric): void {
  if (!serverSdk) return;

  serverSdk.withScope((scope) => {
    scope.setTag('metric_unit', metric.unit);
    if (metric.tags) {
      for (const [key, value] of Object.entries(metric.tags)) {
        scope.setTag(key, value);
      }
    }
    scope.setExtra('metric_value', metric.value);
    serverSdk!.captureException(new Error(`[perf] ${metric.name}`));
  });
}

export function serverAnalyticsMiddleware(
  handler: (req: unknown, res: unknown) => unknown | Promise<unknown>,
) {
  return async (req: unknown, res: unknown): Promise<unknown> => {
    if (!serverSdk) return handler(req, res);

    return serverSdk.withScope(() => handler(req, res));
  };
}
