import Anthropic from '@anthropic-ai/sdk';
import type {
  ModelProvider,
  ModelInfo,
} from '@adopt-ai/model-wrapper/provider';
import type {
  ChatMessage,
  CompletionResponse,
  ModelConfig,
  StreamChunk,
  TokenUsage,
  ToolCall,
} from '@adopt-ai/model-wrapper/types';
import {
  ModelError,
  RateLimitError,
  TokenLimitError,
} from '@adopt-ai/model-wrapper/errors';
import { getClaudeEnv, type ClaudeEnv } from './env;

const MODEL_INFO: Record<string, ModelInfo> = {
  'claude-sonnet-4-6-20250514': {
    name: 'claude-sonnet-4-6-20250514',
    provider: 'anthropic',
    contextWindow: 200_000,
    maxOutput: 16_384,
    supportsToolUse: true,
    supportsVision: true,
    supportsStreaming: true,
    supportsCaching: true,
  },
  'claude-haiku-4-5-20250514': {
    name: 'claude-haiku-4-5-20250514',
    provider: 'anthropic',
    contextWindow: 200_000,
    maxOutput: 8_192,
    supportsToolUse: true,
    supportsVision: true,
    supportsStreaming: true,
    supportsCaching: true,
  },
  'claude-opus-4-20250514': {
    name: 'claude-opus-4-20250514',
    provider: 'anthropic',
    contextWindow: 200_000,
    maxOutput: 16_384,
    supportsToolUse: true,
    supportsVision: true,
    supportsStreaming: true,
    supportsCaching: true,
  },
};

const PRICING_PER_MILLION: Record<string, { input: number; output: number; cacheRead: number; cacheWrite: number }> = {
  'claude-sonnet-4-6-20250514': { input: 3, output: 15, cacheRead: 0.30, cacheWrite: 3.75 },
  'claude-haiku-4-5-20250514': { input: 0.80, output: 4, cacheRead: 0.08, cacheWrite: 1 },
  'claude-opus-4-20250514': { input: 15, output: 75, cacheRead: 1.50, cacheWrite: 18.75 },
};

const DEFAULT_MODEL = 'claude-sonnet-4-6-20250514';

function convertMessage(msg: ChatMessage): Anthropic.MessageParam {
  switch (msg.role) {
    case 'system':
      return { role: 'user', content: msg.content };
    case 'user': {
      if (msg.images && msg.images.length > 0) {
        const parts: Anthropic.TextBlockParam[] = [{ type: 'text', text: msg.content }];
        const imageParts: Anthropic.ImageBlockParam[] = msg.images.map((img) => ({
          type: 'image' as const,
          source: {
            type: 'url' as const,
            url: img.url,
          },
        }));
        return { role: 'user', content: [...parts, ...imageParts] };
      }
      return { role: 'user', content: msg.content };
    }
    case 'assistant': {
      const content: Anthropic.ContentBlockParam[] = [];
      if (msg.content) {
        content.push({ type: 'text', text: msg.content });
      }
      if (msg.toolCalls) {
        for (const tc of msg.toolCalls) {
          content.push({
            type: 'tool_use',
            id: tc.id,
            name: tc.name,
            input: tc.arguments,
          });
        }
      }
      return { role: 'assistant', content };
    }
    case 'tool': {
      return {
        role: 'user',
        content: [
          {
            type: 'tool_result',
            tool_use_id: msg.toolCallId,
            content: msg.content,
            is_error: msg.isError ?? false,
          },
        ],
      };
    }
  }
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

function mapAnthropicError(error: unknown, model: string): never {
  if (error instanceof Anthropic.RateLimitError) {
    const retryMs = error.retryAfter ? error.retryAfter * 1000 : 60_000;
    throw new RateLimitError('anthropic', model, retryMs);
  }

  if (error instanceof Anthropic.APIError) {
    if (error.status === 400 && error.message.includes('token')) {
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

export class ClaudeProvider implements ModelProvider {
  private readonly client: Anthropic;
  private readonly modelName: string;
  private readonly defaultMaxTokens: number;
  private readonly defaultTemperature: number;

  constructor(client?: Anthropic, env?: ClaudeEnv) {
    const resolvedEnv = env ?? getClaudeEnv();
    this.client = client ?? new Anthropic({ apiKey: resolvedEnv.ANTHROPIC_API_KEY });
    this.modelName = resolvedEnv.CLAUDE_MODEL;
    this.defaultMaxTokens = resolvedEnv.CLAUDE_MAX_TOKENS;
    this.defaultTemperature = resolvedEnv.CLAUDE_TEMPERATURE;
  }

  async complete(messages: ChatMessage[], config: ModelConfig): Promise<CompletionResponse> {
    const model = config.model || this.modelName;
    const { systemPrompt, nonSystemMessages } = extractSystemPrompt(messages);
    const resolvedSystem = config.systemPrompt ?? systemPrompt;

    const anthropicMessages = nonSystemMessages.map(convertMessage);

    const params: Anthropic.MessageCreateParams = {
      model,
      max_tokens: config.maxTokens || this.defaultMaxTokens,
      temperature: config.temperature ?? this.defaultTemperature,
      messages: anthropicMessages,
    };

    if (resolvedSystem) {
      params.system = resolvedSystem;
    }

    if (config.topP !== undefined) {
      params.top_p = config.topP;
    }

    if (config.stopSequences && config.stopSequences.length > 0) {
      params.stop_sequences = config.stopSequences;
    }

    try {
      const response = await this.client.messages.create(params);
      return this.mapResponse(response, model);
    } catch (error) {
      mapAnthropicError(error, model);
    }
  }

  async *stream(messages: ChatMessage[], config: ModelConfig): AsyncIterable<StreamChunk> {
    const model = config.model || this.modelName;
    const { systemPrompt, nonSystemMessages } = extractSystemPrompt(messages);
    const resolvedSystem = config.systemPrompt ?? systemPrompt;

    const anthropicMessages = nonSystemMessages.map(convertMessage);

    const params: Anthropic.MessageCreateParams = {
      model,
      max_tokens: config.maxTokens || this.defaultMaxTokens,
      temperature: config.temperature ?? this.defaultTemperature,
      messages: anthropicMessages,
      stream: true,
    };

    if (resolvedSystem) {
      params.system = resolvedSystem;
    }

    let stream: Anthropic.MessageStream;
    try {
      stream = this.client.messages.stream(params);
    } catch (error) {
      mapAnthropicError(error, model);
      return;
    }

    const toolCallBuffers = new Map<number, { id: string; name: string; inputJson: string }>();
    let accumulatedUsage: TokenUsage = { inputTokens: 0, outputTokens: 0 };

    try {
      for await (const event of stream) {
        switch (event.type) {
          case 'content_block_delta': {
            if (event.delta.type === 'text_delta') {
              yield { type: 'content_delta', delta: event.delta.text };
            } else if (event.delta.type === 'input_json_delta') {
              const existing = toolCallBuffers.get(event.index);
              if (existing) {
                existing.inputJson += event.delta.partial_json;
              }
            }
            break;
          }

          case 'content_block_start': {
            if (event.content_block.type === 'tool_use') {
              toolCallBuffers.set(event.index, {
                id: event.content_block.id,
                name: event.content_block.name,
                inputJson: '',
              });
            }
            break;
          }

          case 'content_block_stop': {
            const toolBuffer = toolCallBuffers.get(event.index);
            if (toolBuffer) {
              let parsedArgs: Record<string, unknown>;
              try {
                parsedArgs = JSON.parse(toolBuffer.inputJson || '{}');
              } catch {
                parsedArgs = {};
              }
              const toolCall: ToolCall = {
                id: toolBuffer.id,
                name: toolBuffer.name,
                arguments: parsedArgs,
              };
              yield { type: 'tool_call', toolCall };
              toolCallBuffers.delete(event.index);
            }
            break;
          }

          case 'message_delta': {
            if (event.usage) {
              accumulatedUsage = {
                ...accumulatedUsage,
                outputTokens: event.usage.output_tokens,
              };
            }
            break;
          }

          case 'message_start': {
            if (event.message.usage) {
              accumulatedUsage = {
                inputTokens: event.message.usage.input_tokens,
                outputTokens: event.message.usage.output_tokens,
                cacheReadTokens: event.message.usage.cache_read_input_tokens ?? undefined,
                cacheCreationTokens: event.message.usage.cache_creation_input_tokens ?? undefined,
              };
            }
            break;
          }

          case 'message_stop': {
            const finalResponse: CompletionResponse = {
              content: '',
              toolCalls: [],
              usage: accumulatedUsage,
              model,
              stopReason: 'end_turn',
              id: '',
            };
            yield { type: 'done', response: finalResponse };
            break;
          }
        }
      }
    } catch (error) {
      mapAnthropicError(error, model);
    }
  }

  async countTokens(text: string): Promise<number> {
    try {
      const response = await this.client.messages.countTokens({
        model: this.modelName,
        messages: [{ role: 'user', content: text }],
      });
      return response.input_tokens;
    } catch {
      return Math.ceil(text.length / 4);
    }
  }

  getModelInfo(): ModelInfo {
    return MODEL_INFO[this.modelName] ?? {
      name: this.modelName,
      provider: 'anthropic',
      contextWindow: 200_000,
      maxOutput: 8_192,
      supportsToolUse: true,
      supportsVision: true,
      supportsStreaming: true,
      supportsCaching: true,
    };
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

  private mapResponse(response: Anthropic.Message, model: string): CompletionResponse {
    const toolCalls: ToolCall[] = [];
    let textContent = '';

    for (const block of response.content) {
      if (block.type === 'text') {
        textContent += block.text;
      } else if (block.type === 'tool_use') {
        toolCalls.push({
          id: block.id,
          name: block.name,
          arguments: block.input as Record<string, unknown>,
        });
      }
    }

    return {
      content: textContent,
      toolCalls,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
        cacheReadTokens: response.usage.cache_read_input_tokens ?? undefined,
        cacheCreationTokens: response.usage.cache_creation_input_tokens ?? undefined,
      },
      model,
      stopReason: response.stop_reason,
      id: response.id,
    };
  }
}
