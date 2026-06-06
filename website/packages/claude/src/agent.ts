import type { ChatMessage, ModelConfig, TokenUsage } from '@adopt-ai/model-wrapper/types';
import type { ClaudeProvider } from './provider;
import type { ClaudeTool, ToolExecutorFn } from './tools;
import { toolUseLoop } from './tools;

export interface AgentConfig {
  systemPrompt: string;
  tools?: ClaudeTool[];
  executors?: Map<string, ToolExecutorFn>;
  model?: string;
  maxTurns?: number;
  temperature?: number;
  maxTokens?: number;
}

export type AgentStatus = 'idle' | 'running' | 'completed' | 'error' | 'aborted';

export interface AgentState {
  messages: ChatMessage[];
  turnCount: number;
  status: AgentStatus;
  totalUsage: TokenUsage | null;
  lastError: string | null;
}

export type AgentEvent =
  | { type: 'thinking'; content: string }
  | { type: 'tool_call'; name: string; args: Record<string, unknown> }
  | { type: 'tool_result'; name: string; result: string }
  | { type: 'response'; content: string }
  | { type: 'error'; error: string };

export interface Agent {
  run(input: string): Promise<string>;
  runStreaming(input: string): AsyncIterable<AgentEvent>;
  getState(): AgentState;
  abort(): void;
}

export function createAgent(provider: ClaudeProvider, config: AgentConfig): Agent {
  const state: AgentState = {
    messages: [],
    turnCount: 0,
    status: 'idle',
    totalUsage: null,
    lastError: null,
  };

  let abortController: AbortController | null = null;

  const modelConfig: Partial<ModelConfig> = {
    model: config.model ?? 'claude-sonnet-4-6-20250514',
    temperature: config.temperature ?? 0,
    maxTokens: config.maxTokens ?? 4096,
    systemPrompt: config.systemPrompt,
  };

  return {
    async run(input: string): Promise<string> {
      state.status = 'running';
      state.lastError = null;
      abortController = new AbortController();

      const userMessage: ChatMessage = { role: 'user', content: input };
      state.messages.push(userMessage);

      try {
        if (config.tools && config.tools.length > 0 && config.executors && config.executors.size > 0) {
          const result = await toolUseLoop({
            provider,
            messages: state.messages,
            tools: config.tools,
            executors: config.executors,
            config: modelConfig,
            maxTurns: config.maxTurns ?? 10,
          });

          state.messages = result.messages;
          state.turnCount = result.turns;

          if (state.totalUsage && result.finalResponse.usage) {
            state.totalUsage = mergeUsage(state.totalUsage, result.finalResponse.usage);
          } else {
            state.totalUsage = result.finalResponse.usage;
          }

          state.status = 'completed';
          return result.finalResponse.content;
        }

        const response = await provider.complete(state.messages, {
          model: modelConfig.model ?? 'claude-sonnet-4-6-20250514',
          maxTokens: modelConfig.maxTokens ?? 4096,
          temperature: modelConfig.temperature ?? 0,
          systemPrompt: modelConfig.systemPrompt,
        });

        state.messages.push({
          role: 'assistant',
          content: response.content,
          toolCalls: response.toolCalls.length > 0 ? response.toolCalls : undefined,
        });

        state.totalUsage = response.usage;
        state.turnCount = 1;
        state.status = 'completed';
        return response.content;
      } catch (error) {
        state.status = 'error';
        state.lastError = error instanceof Error ? error.message : 'Unknown error';
        throw error;
      }
    },

    async *runStreaming(input: string): AsyncIterable<AgentEvent> {
      state.status = 'running';
      state.lastError = null;
      abortController = new AbortController();

      const userMessage: ChatMessage = { role: 'user', content: input };
      state.messages.push(userMessage);

      try {
        if (config.tools && config.tools.length > 0 && config.executors && config.executors.size > 0) {
          const result = await toolUseLoop({
            provider,
            messages: state.messages,
            tools: config.tools,
            executors: config.executors,
            config: modelConfig,
            maxTurns: config.maxTurns ?? 10,
          });

          state.messages = result.messages;
          state.turnCount = result.turns;
          state.totalUsage = result.finalResponse.usage;
          state.status = 'completed';

          yield { type: 'response', content: result.finalResponse.content };
          return;
        }

        const stream = provider.stream(state.messages, {
          model: modelConfig.model ?? 'claude-sonnet-4-6-20250514',
          maxTokens: modelConfig.maxTokens ?? 4096,
          temperature: modelConfig.temperature ?? 0,
          systemPrompt: modelConfig.systemPrompt,
        });

        let content = '';
        for await (const chunk of stream) {
          if (abortController?.signal.aborted) {
            state.status = 'aborted';
            return;
          }

          switch (chunk.type) {
            case 'content_delta':
              content += chunk.delta;
              yield { type: 'thinking', content: chunk.delta };
              break;
            case 'tool_call':
              yield { type: 'tool_call', name: chunk.toolCall.name, args: chunk.toolCall.arguments };
              break;
            case 'usage':
              state.totalUsage = chunk.usage;
              break;
            case 'done':
              break;
          }
        }

        state.messages.push({ role: 'assistant', content });
        state.turnCount = 1;
        state.status = 'completed';

        yield { type: 'response', content };
      } catch (error) {
        state.status = 'error';
        const msg = error instanceof Error ? error.message : 'Unknown error';
        state.lastError = msg;
        yield { type: 'error', error: msg };
      }
    },

    getState(): AgentState {
      return { ...state };
    },

    abort(): void {
      if (abortController) {
        abortController.abort();
      }
      state.status = 'aborted';
    },
  };
}

function mergeUsage(a: TokenUsage, b: TokenUsage): TokenUsage {
  return {
    inputTokens: a.inputTokens + b.inputTokens,
    outputTokens: a.outputTokens + b.outputTokens,
    cacheReadTokens: (a.cacheReadTokens ?? 0) + (b.cacheReadTokens ?? 0) || undefined,
    cacheCreationTokens: (a.cacheCreationTokens ?? 0) + (b.cacheCreationTokens ?? 0) || undefined,
  };
}
