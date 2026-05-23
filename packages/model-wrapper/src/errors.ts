export class ModelError extends Error {
  public readonly provider: string;
  public readonly model: string;
  public readonly cause: unknown;

  constructor(provider: string, model: string, message: string, cause?: unknown) {
    super(message);
    this.name = 'ModelError';
    this.provider = provider;
    this.model = model;
    this.cause = cause;
  }
}

export class RateLimitError extends ModelError {
  public readonly retryAfterMs: number;

  constructor(provider: string, model: string, retryAfterMs: number) {
    super(provider, model, `Rate limit exceeded for ${model}. Retry after ${retryAfterMs}ms.`);
    this.name = 'RateLimitError';
    this.retryAfterMs = retryAfterMs;
  }
}

export class TokenLimitError extends ModelError {
  public readonly requestedTokens: number;
  public readonly maxTokens: number;

  constructor(provider: string, model: string, requestedTokens: number, maxTokens: number) {
    super(
      provider,
      model,
      `Token limit exceeded: requested ${requestedTokens} but model supports ${maxTokens}.`,
    );
    this.name = 'TokenLimitError';
    this.requestedTokens = requestedTokens;
    this.maxTokens = maxTokens;
  }
}

export class BudgetExceededError extends Error {
  public readonly spent: number;
  public readonly limit: number;

  constructor(spent: number, limit: number) {
    super(`Budget exceeded: $${spent.toFixed(4)} spent of $${limit.toFixed(2)} limit.`);
    this.name = 'BudgetExceededError';
    this.spent = spent;
    this.limit = limit;
  }
}
