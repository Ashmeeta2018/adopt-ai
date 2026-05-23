import Anthropic from '@anthropic-ai/sdk';
import type { ChatMessage, CompletionResponse, ModelConfig, StreamChunk, TokenUsage } from '@adopt-ai/model-wrapper/types';
import type { ModelInfo } from '@adopt-ai/model-wrapper/provider';
import type { ClaudeEnv } from './env;
import { getClaudeEnv } from './env;
import { ClaudeProvider } from './provider;
import type { AgentConfig, Agent } from './agent;
import { createAgent } from './agent;

export { getClaudeEnv, type ClaudeEnv } from './env;
export { ClaudeProvider } from './provider;
export type { ClaudeTool, ToolExecutorFn, ToolUseBlock, ToolResultBlock } from './tools;
export { claudeTool, executeToolUse, toolFromDefinition, toolUseLoop } from './tools;
export type { CacheStrategy, CacheStats } from './caching;
export { withCacheControl, withCachedTools, buildCachedMessages, getCacheStats } from './caching;
export type { AgentConfig, AgentState, AgentEvent, Agent } from './agent;
export { createAgent } from './agent;
export {
  inboxTriageSystem,
  documentExtractionSystem,
  supportRoutingSystem,
  workflowAnalysisSystem,
} from './prompt-templates;

export interface ClaudeClient {
  complete(messages: ChatMessage[], config?: Partial<ModelConfig>): Promise<CompletionResponse>;
  stream(messages: ChatMessage[], config?: Partial<ModelConfig>): AsyncIterable<StreamChunk>;
  agent(config: AgentConfig): Agent;
  countTokens(text: string): Promise<number>;
  getModelInfo(): ModelInfo;
  estimateCost(usage: TokenUsage, model?: string): number;
  getProvider(): ClaudeProvider;
}

function toEnvOverrides(env: Partial<ClaudeEnv> | undefined): Partial<Record<string, string | undefined>> {
  if (!env) return {};
  const overrides: Partial<Record<string, string | undefined>> = {};
  if (env.ANTHROPIC_API_KEY !== undefined) overrides.ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY;
  if (env.CLAUDE_MODEL !== undefined) overrides.CLAUDE_MODEL = env.CLAUDE_MODEL;
  if (env.CLAUDE_MAX_TOKENS !== undefined) overrides.CLAUDE_MAX_TOKENS = String(env.CLAUDE_MAX_TOKENS);
  if (env.CLAUDE_TEMPERATURE !== undefined) overrides.CLAUDE_TEMPERATURE = String(env.CLAUDE_TEMPERATURE);
  return overrides;
}

export function createClaudeClient(env?: Partial<ClaudeEnv>): ClaudeClient {
  const resolvedEnv = getClaudeEnv(toEnvOverrides(env));
  const anthropic = new Anthropic({ apiKey: resolvedEnv.ANTHROPIC_API_KEY });
  const provider = new ClaudeProvider(anthropic, resolvedEnv);

  const defaultConfig: ModelConfig = {
    model: resolvedEnv.CLAUDE_MODEL,
    maxTokens: resolvedEnv.CLAUDE_MAX_TOKENS,
    temperature: resolvedEnv.CLAUDE_TEMPERATURE,
  };

  return {
    async complete(
      messages: ChatMessage[],
      config?: Partial<ModelConfig>,
    ): Promise<CompletionResponse> {
      const merged: ModelConfig = { ...defaultConfig, ...config };
      return provider.complete(messages, merged);
    },

    async *stream(
      messages: ChatMessage[],
      config?: Partial<ModelConfig>,
    ): AsyncIterable<StreamChunk> {
      const merged: ModelConfig = { ...defaultConfig, ...config };
      yield* provider.stream(messages, merged);
    },

    agent(config: AgentConfig): Agent {
      return createAgent(provider, config);
    },

    async countTokens(text: string): Promise<number> {
      return provider.countTokens(text);
    },

    getModelInfo(): ModelInfo {
      return provider.getModelInfo();
    },

    estimateCost(usage: TokenUsage, model?: string): number {
      return provider.estimateCost(usage, model ?? resolvedEnv.CLAUDE_MODEL);
    },

    getProvider(): ClaudeProvider {
      return provider;
    },
  };
}
