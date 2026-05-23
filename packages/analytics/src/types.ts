export interface AnalyticsEvent {
  name: string;
  properties: Record<string, string | number | boolean>;
  timestamp?: Date;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  tags?: Record<string, string>;
}

export interface ErrorContext {
  error: Error;
  componentStack?: string;
  userId?: string;
  organisationId?: string;
  extras?: Record<string, unknown>;
}
