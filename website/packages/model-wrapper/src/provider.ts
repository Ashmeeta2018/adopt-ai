import type { ModelProvider as ProviderType } from './types;
import type {
  ChatMessage,
  CompletionResponse,
  ModelConfig,
  StreamChunk,
  TokenUsage,
} from './types;

export interface ModelInfo {
  name: string;
  provider: ProviderType;
  contextWindow: number;
  maxOutput: number;
  supportsToolUse: boolean;
  supportsVision: boolean;
  supportsStreaming: boolean;
  supportsCaching: boolean;
}

export interface ModelProvider {
  complete(messages: ChatMessage[], config: ModelConfig): Promise<CompletionResponse>;
  stream(messages: ChatMessage[], config: ModelConfig): AsyncIterable<StreamChunk>;
  countTokens(text: string): Promise<number>;
  getModelInfo(): ModelInfo;
  estimateCost(usage: TokenUsage, model: string): number;
}
