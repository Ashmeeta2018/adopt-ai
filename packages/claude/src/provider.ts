import { ModelError, RateLimitError, TokenLimitError } from '@adopt-ai/model-wrapper/errors';
import {
  APICallError,
  generateText,
  jsonSchema,
  streamText,
  tool,
  type JSONSchema7,
  type LanguageModel,
  type LanguageModelUsage,
  type ModelMessage,
  type ToolSet,
} from 'ai';
import { z } from 'zod';

import { getClaudeEnv, type ClaudeEnv } from './env';

import type { ModelProvider, ModelInfo } from '@adopt-ai/model-wrapper/provider';
import type {
  ChatMessage,
  CompletionResponse,
  ModelConfig,
  StreamChunk,
  TokenUsage,
  ToolCall,
} from '@adopt-ai/model-wrapper/types';

// Model ids are Vercel AI Gateway ids ("provider/model").
const MODEL_INFO: Record<string, ModelInfo> = {
  'anthropic/claude-sonnet-5': {
    name: 'anthropic/claude-sonnet-5',
    provider: 'anthropic',
    contextWindow: 1_000_000,
    maxOutput: 128_000,
    supportsToolUse: true,
    supportsVision: true,
    supportsStreaming: true,
    supportsCaching: true,
  },
  'anthropic/claude-sonnet-4.6': {
    name: 'anthropic/claude-sonnet-4.6',
    provider: 'anthropic',
    contextWindow: 1_000_000,
    maxOutput: 128_000,
    supportsToolUse: true,
    supportsVision: true,
    supportsStreaming: true,
    supportsCaching: true,
  },
  'anthropic/claude-haiku-4.5': {
    name: 'anthropic/claude-haiku-4.5',
    provider: 'anthropic',
    contextWindow: 200_000,
    maxOutput: 64_000,
    supportsToolUse: true,
    supportsVision: true,
    supportsStreaming: true,
    supportsCaching: true,
  },
  'anthropic/claude-opus-4.8': {
    name: 'anthropic/claude-opus-4.8',
    provider: 'anthropic',
    contextWindow: 1_000_000,
    maxOutput: 128_000,
    supportsToolUse: true,
    supportsVision: true,
    supportsStreaming: true,
    supportsCaching: true,
  },
};

const PRICING_PER_MILLION: Record<
  string,
  { input: number; output: number; cacheRead: number; cacheWrite: number }
> = {
  'anthropic/claude-sonnet-5': { input: 3, output: 15, cacheRead: 0.3, cacheWrite: 3.75 },
  'anthropic/claude-sonnet-4.6': { input: 3, output: 15, cacheRead: 0.3, cacheWrite: 3.75 },
  'anthropic/claude-haiku-4.5': { input: 1, output: 5, cacheRead: 0.1, cacheWrite: 1.25 },
  'anthropic/claude-opus-4.8': { input: 5, output: 25, cacheRead: 0.5, cacheWrite: 6.25 },
};

const DEFAULT_MODEL = 'anthropic/claude-sonnet-5';

const toolArgsSchema = z.record(z.string(), z.unknown());

function toJsonSchema7(schema: Record<string, unknown>): JSONSchema7 {
  // ClaudeTool.input_schema is already a JSON Schema object at runtime;
  // JSONSchema7's fields are all optional, so widening is safe.
  const result: JSONSchema7 = {};
  Object.assign(result, schema);
  return result;
}

/** Tools are declared without `execute` — the caller's loop runs them. */
function buildToolSet(tools: ModelConfig['tools']): ToolSet | undefined {
  if (!tools || tools.length === 0) return undefined;
  const set: ToolSet = {};
  for (const t of tools) {
    set[t.name] = tool({
      description: t.description,
      inputSchema: jsonSchema(toJsonSchema7(t.inputSchema)),
    });
  }
  return set;
}

function mapToolCall(tc: { toolCallId: string; toolName: string; input: unknown }): ToolCall {
  const parsed = toolArgsSchema.safeParse(tc.input);
  return {
    id: tc.toolCallId,
    name: tc.toolName,
    arguments: parsed.success ? parsed.data : {},
  };
}

function mapUsage(usage: LanguageModelUsage): TokenUsage {
  return {
    inputTokens: usage.inputTokens ?? 0,
    outputTokens: usage.outputTokens ?? 0,
    cacheReadTokens: usage.inputTokenDetails.cacheReadTokens,
    cacheCreationTokens: usage.inputTokenDetails.cacheWriteTokens,
  };
}

function convertMessages(messages: ChatMessage[]): ModelMessage[] {
  const result: ModelMessage[] = [];
  // Tool-result parts need the tool's name; recover it from earlier tool calls.
  const toolNameById = new Map<string, string>();

  for (const msg of messages) {
    switch (msg.role) {
      case 'system':
        result.push({ role: 'system', content: msg.content });
        break;

      case 'user': {
        if (msg.images && msg.images.length > 0) {
          result.push({
            role: 'user',
            content: [
              { type: 'text', text: msg.content },
              ...msg.images.map((img) => ({
                type: 'image' as const,
                image: new URL(img.url),
                mediaType: img.mediaType,
              })),
            ],
          });
        } else {
          result.push({ role: 'user', content: msg.content });
        }
        break;
      }

      case 'assistant': {
        const content: Exclude<Extract<ModelMessage, { role: 'assistant' }>['content'], string> =
          [];
        if (msg.content) {
          content.push({ type: 'text', text: msg.content });
        }
        for (const tc of msg.toolCalls ?? []) {
          toolNameById.set(tc.id, tc.name);
          content.push({
            type: 'tool-call',
            toolCallId: tc.id,
            toolName: tc.name,
            input: tc.arguments,
          });
        }
        result.push({ role: 'assistant', content });
        break;
      }

      case 'tool': {
        const toolName = toolNameById.get(msg.toolCallId) ?? 'unknown';
        result.push({
          role: 'tool',
          content: [
            {
              type: 'tool-result',
              toolCallId: msg.toolCallId,
              toolName,
              output: msg.isError
                ? { type: 'error-text', value: msg.content }
                : { type: 'text', value: msg.content },
            },
          ],
        });
        break;
      }
    }
  }

  return result;
}

function extractSystemPrompt(messages: ChatMessage[]): {
  systemPrompt: string | undefined;
  nonSystemMessages: ChatMessage[];
} {
  const systemMsgs = messages.filter((m) => m.role === 'system');
  const nonSystem = messages.filter((m) => m.role !== 'system');
  const combined = systemMsgs.map((m) => m.content).join('\n\n');
  return {
    systemPrompt: combined.length > 0 ? combined : undefined,
    nonSystemMessages: nonSystem,
  };
}

function mapProviderError(error: unknown, model: string): never {
  if (APICallError.isInstance(error)) {
    if (error.statusCode === 429) {
      const retryAfterSec = Number(error.responseHeaders?.['retry-after']);
      const retryMs = Number.isFinite(retryAfterSec) ? retryAfterSec * 1000 : 60_000;
      throw new RateLimitError('anthropic', model, retryMs);
    }
    if (error.statusCode === 400 && error.message.toLowerCase().includes('token')) {
      throw new TokenLimitError('anthropic', model, 0, 0);
    }
    throw new ModelError('anthropic', model, error.message, error);
  }

  throw new ModelError(
    'anthropic',
    model,
    error instanceof Error ? error.message : 'Unknown error',
    error,
  );
}

/**
 * Claude via the Vercel AI SDK, routed through the AI Gateway.
 *
 * Credentials come from the gateway provider itself (AI_GATEWAY_API_KEY
 * locally, OIDC on Vercel) — nothing is passed here.
 */
export class ClaudeProvider implements ModelProvider {
  private readonly modelName: string;
  private readonly defaultMaxTokens: number;
  private readonly defaultTemperature: number | undefined;
  /** Test seam — lets unit tests inject a MockLanguageModelV4. */
  private readonly modelOverride: LanguageModel | undefined;

  constructor(env?: ClaudeEnv, modelOverride?: LanguageModel) {
    const resolvedEnv = env ?? getClaudeEnv();
    this.modelName = resolvedEnv.CLAUDE_MODEL;
    this.defaultMaxTokens = resolvedEnv.CLAUDE_MAX_TOKENS;
    this.defaultTemperature = resolvedEnv.CLAUDE_TEMPERATURE;
    this.modelOverride = modelOverride;
  }

  async complete(messages: ChatMessage[], config: ModelConfig): Promise<CompletionResponse> {
    const model = config.model || this.modelName;
    const { systemPrompt, nonSystemMessages } = extractSystemPrompt(messages);
    const resolvedSystem = config.systemPrompt ?? systemPrompt;
    const tools = buildToolSet(config.tools);

    try {
      const result = await generateText({
        model: this.modelOverride ?? model,
        messages: convertMessages(nonSystemMessages),
        instructions: resolvedSystem,
        maxOutputTokens: config.maxTokens || this.defaultMaxTokens,
        temperature: config.temperature ?? this.defaultTemperature,
        topP: config.topP,
        stopSequences: config.stopSequences,
        tools,
      });

      return {
        content: result.text,
        toolCalls: result.toolCalls.map(mapToolCall),
        usage: mapUsage(result.usage),
        model,
        stopReason: result.finishReason,
        id: result.finalStep.response.id,
      };
    } catch (error) {
      mapProviderError(error, model);
    }
  }

  async *stream(messages: ChatMessage[], config: ModelConfig): AsyncIterable<StreamChunk> {
    const model = config.model || this.modelName;
    const { systemPrompt, nonSystemMessages } = extractSystemPrompt(messages);
    const resolvedSystem = config.systemPrompt ?? systemPrompt;
    const tools = buildToolSet(config.tools);

    const result = streamText({
      model: this.modelOverride ?? model,
      messages: convertMessages(nonSystemMessages),
      instructions: resolvedSystem,
      maxOutputTokens: config.maxTokens || this.defaultMaxTokens,
      temperature: config.temperature ?? this.defaultTemperature,
      topP: config.topP,
      stopSequences: config.stopSequences,
      tools,
    });

    let content = '';
    const toolCalls: ToolCall[] = [];

    try {
      for await (const part of result.fullStream) {
        switch (part.type) {
          case 'text-delta': {
            content += part.text;
            yield { type: 'content_delta', delta: part.text };
            break;
          }

          case 'tool-call': {
            const toolCall = mapToolCall(part);
            toolCalls.push(toolCall);
            yield { type: 'tool_call', toolCall };
            break;
          }

          case 'error':
            mapProviderError(part.error, model);
            break;

          case 'finish': {
            const usage = mapUsage(part.totalUsage);
            yield { type: 'usage', usage };
            yield {
              type: 'done',
              response: {
                content,
                toolCalls,
                usage,
                model,
                stopReason: part.finishReason,
                id: '',
              },
            };
            break;
          }

          default:
            break;
        }
      }
    } catch (error) {
      mapProviderError(error, model);
    }
  }

  async countTokens(text: string): Promise<number> {
    // The gateway has no token-counting endpoint; use the shared estimate.
    return Promise.resolve(Math.ceil(text.length / 4));
  }

  getModelInfo(): ModelInfo {
    return (
      MODEL_INFO[this.modelName] ?? {
        name: this.modelName,
        provider: 'anthropic',
        contextWindow: 200_000,
        maxOutput: 64_000,
        supportsToolUse: true,
        supportsVision: true,
        supportsStreaming: true,
        supportsCaching: true,
      }
    );
  }

  estimateCost(usage: TokenUsage, model: string): number {
    const pricing = PRICING_PER_MILLION[model] ?? PRICING_PER_MILLION[DEFAULT_MODEL]!;
    const inputCost = (usage.inputTokens / 1_000_000) * pricing.input;
    const outputCost = (usage.outputTokens / 1_000_000) * pricing.output;
    const cacheReadCost = usage.cacheReadTokens
      ? (usage.cacheReadTokens / 1_000_000) * pricing.cacheRead
      : 0;
    const cacheWriteCost = usage.cacheCreationTokens
      ? (usage.cacheCreationTokens / 1_000_000) * pricing.cacheWrite
      : 0;
    return inputCost + outputCost + cacheReadCost + cacheWriteCost;
  }
}
