import type { ChatMessage, CompletionResponse, ModelConfig, StreamChunk, TokenUsage } from './types;
import { ModelError, RateLimitError } from './errors;
import type { ModelProvider, ModelInfo } from './provider;
import { CostTracker, assertWithinBudget } from './cost-tracker;

export type { ModelProvider, ModelInfo } from './provider;
export type {
  CostConfig,
  CostConfigSchema,
  CompletionResponse,
  CompletionResponseSchema,
  ContentDeltaChunk,
  ModelConfig,
  ModelConfigSchema,
  ModelProvider as ModelProviderType,
  ModelProviderSchema,
  StreamChunk,
  TokenUsage,
  TokenUsageSchema,
  ToolCall,
  ToolCallSchema,
  ToolResult,
  ToolResultSchema,
  ChatMessage,
  SystemMessage,
  UserMessage,
  AssistantMessage,
  ToolMessage,
  MessageRole,
} from './types;
export {
  ModelProviderSchema,
  MessageRoleSchema,
  ToolCallSchema,
  ToolResultSchema,
  ChatMessageSchema,
  ModelConfigSchema,
  TokenUsageSchema,
  CostConfigSchema,
  CompletionResponseSchema,
  StreamChunkSchema,
} from './types;
export { ModelError, RateLimitError, TokenLimitError, BudgetExceededError } from './errors;
export { CostTracker, assertWithinBudget } from './cost-tracker;
export { estimateTokens, truncateToTokenLimit, countMessagesTokens } from './tokenizer;
export { tool, toolkit, type ToolDefinition, type ToolExecutor } from './tool-def;

export interface ProviderConfig {
  provider: ModelProvider;
  costTracker?: CostTracker;
}

export interface ModelClient {
  complete(messages: ChatMessage[], config: ModelConfig): Promise<CompletionResponse>;
  stream(messages: ChatMessage[], config: ModelConfig): AsyncIterable<StreamChunk>;
  streamAndCollect(messages: ChatMessage[], config: ModelConfig): Promise<CompletionResponse>;
  countTokens(text: string): Promise<number>;
  getModelInfo(): ModelInfo;
  estimateCost(usage: TokenUsage, model: string): number;
}

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

function isRetryable(error: unknown): boolean {
  if (error instanceof RateLimitError) return true;
  if (error instanceof ModelError) {
    const message = error.message.toLowerCase();
    return message.includes('rate limit') || message.includes('server error') || message.includes('503') || message.includes('500') || message.includes('overloaded');
  }
  return false;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (!isRetryable(error) || attempt === MAX_RETRIES) {
        throw error;
      }

      let retryMs = BASE_DELAY_MS * Math.pow(2, attempt);
      if (error instanceof RateLimitError) {
        retryMs = error.retryAfterMs;
      }

      await delay(retryMs);
    }
  }
  throw lastError;
}

export function createModelClient(config: ProviderConfig): ModelClient {
  const { provider, costTracker } = config;

  return {
    async complete(messages: ChatMessage[], modelConfig: ModelConfig): Promise<CompletionResponse> {
      if (costTracker) {
        assertWithinBudget(costTracker);
      }

      const response = await withRetry(
        () => provider.complete(messages, modelConfig),
      );

      if (costTracker && modelConfig.model) {
        costTracker.recordUsage(modelConfig.model, response.usage);
      }

      return response;
    },

    async stream(messages: ChatMessage[], modelConfig: ModelConfig): AsyncIterable<StreamChunk> {
      if (costTracker) {
        assertWithinBudget(costTracker);
      }

      const innerStream = provider.stream(messages, modelConfig);

      return (async function* wrapStream() {
        let lastUsage: TokenUsage | null = null;

        for await (const chunk of innerStream) {
          if (chunk.type === 'usage') {
            lastUsage = chunk.usage;
          }
          yield chunk;
        }

        if (costTracker && lastUsage && modelConfig.model) {
          costTracker.recordUsage(modelConfig.model, lastUsage);
        }
      })();
    },

    async streamAndCollect(messages: ChatMessage[], modelConfig: ModelConfig): Promise<CompletionResponse> {
      if (costTracker) {
        assertWithinBudget(costTracker);
      }

      const innerStream = await provider.stream(messages, modelConfig);

      let lastUsage: TokenUsage | null = null;
      let content = '';
      const toolCalls: Array<{ id: string; name: string; arguments: Record<string, unknown> }> = [];
      let finalResponse: CompletionResponse | null = null;

      for await (const chunk of innerStream) {
        switch (chunk.type) {
          case 'content_delta':
            content += chunk.delta;
            break;
          case 'tool_call':
            toolCalls.push(chunk.toolCall);
            break;
          case 'usage':
            lastUsage = chunk.usage;
            break;
          case 'done':
            finalResponse = chunk.response;
            break;
        }
      }

      let response: CompletionResponse;
      if (finalResponse) {
        response = finalResponse;
      } else {
        response = {
          content,
          toolCalls,
          usage: lastUsage ?? { inputTokens: 0, outputTokens: 0 },
          model: modelConfig.model,
          stopReason: 'unknown',
          id: '',
        };
      }

      if (costTracker && response.usage && modelConfig.model) {
        costTracker.recordUsage(modelConfig.model, response.usage);
      }

      return response;
    },

    async countTokens(text: string): Promise<number> {
      return provider.countTokens(text);
    },

    getModelInfo(): ModelInfo {
      return provider.getModelInfo();
    },

    estimateCost(usage: TokenUsage, model: string): number {
      return provider.estimateCost(usage, model);
    },
  };
}
