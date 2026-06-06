import type { ToolDefinition } from '@adopt-ai/model-wrapper/tool-def';
import type {
  ChatMessage,
  CompletionResponse,
  ModelConfig,
  ToolCall,
} from '@adopt-ai/model-wrapper/types';
import type { ClaudeProvider } from './provider;

export interface ClaudeTool {
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
}

export interface ToolUseBlock {
  id: string;
  name: string;
  input: Record<string, unknown>;
  type: 'tool_use';
}

export interface ToolResultBlock {
  type: 'tool_result';
  tool_use_id: string;
  content: string;
  is_error?: boolean;
}

export type ToolExecutorFn = (args: Record<string, unknown>) => Promise<unknown>;

export function claudeTool(
  name: string,
  description: string,
  inputSchema: Record<string, unknown>,
): ClaudeTool {
  return {
    name,
    description,
    input_schema: {
      type: 'object',
      ...inputSchema,
    },
  };
}

export function toolFromDefinition(def: ToolDefinition): ClaudeTool {
  return claudeTool(def.name, def.description, def.parameters);
}

export async function executeToolUse(
  toolUse: ToolUseBlock,
  executor: ToolExecutorFn,
): Promise<ToolResultBlock> {
  try {
    const result = await executor(toolUse.input);
    return {
      type: 'tool_result',
      tool_use_id: toolUse.id,
      content: typeof result === 'string' ? result : JSON.stringify(result),
    };
  } catch (error) {
    return {
      type: 'tool_result',
      tool_use_id: toolUse.id,
      content: error instanceof Error ? error.message : 'Tool execution failed',
      is_error: true,
    };
  }
}

export interface ToolUseLoopOptions {
  provider: ClaudeProvider;
  messages: ChatMessage[];
  tools: ClaudeTool[];
  executors: Map<string, ToolExecutorFn>;
  config: Partial<ModelConfig>;
  maxTurns: number;
}

export interface ToolUseLoopResult {
  messages: ChatMessage[];
  finalResponse: CompletionResponse;
  toolCallCount: number;
  turns: number;
}

export async function toolUseLoop(options: ToolUseLoopOptions): Promise<ToolUseLoopResult> {
  const { provider, tools, executors, maxTurns } = options;
  const messages: ChatMessage[] = [...options.messages];
  let toolCallCount = 0;

  const baseConfig: ModelConfig = {
    model: options.config.model ?? 'claude-sonnet-4-6-20250514',
    maxTokens: options.config.maxTokens ?? 4096,
    temperature: options.config.temperature ?? 0,
    topP: options.config.topP,
    stopSequences: options.config.stopSequences,
    systemPrompt: options.config.systemPrompt,
  };

  for (let turn = 0; turn < maxTurns; turn++) {
    const response = await provider.complete(messages, baseConfig);

    const assistantContent = response.content;
    const assistantToolCalls = response.toolCalls;

    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: assistantContent || undefined,
      toolCalls: assistantToolCalls.length > 0 ? assistantToolCalls : undefined,
    };
    messages.push(assistantMessage);

    if (assistantToolCalls.length === 0) {
      return { messages, finalResponse: response, toolCallCount, turns: turn + 1 };
    }

    toolCallCount += assistantToolCalls.length;

    for (const tc of assistantToolCalls) {
      const executor = executors.get(tc.name);
      if (!executor) {
        const errorMsg: ChatMessage = {
          role: 'tool',
          content: `No executor found for tool: ${tc.name}`,
          toolCallId: tc.id,
          isError: true,
        };
        messages.push(errorMsg);
        continue;
      }

      const toolUseBlock: ToolUseBlock = {
        id: tc.id,
        name: tc.name,
        input: tc.arguments,
        type: 'tool_use',
      };

      const result = await executeToolUse(toolUseBlock, executor);
      const toolMessage: ChatMessage = {
        role: 'tool',
        content: result.content,
        toolCallId: result.tool_use_id,
        isError: result.is_error,
      };
      messages.push(toolMessage);
    }
  }

  const lastResponse = await provider.complete(messages, baseConfig);
  return { messages, finalResponse: lastResponse, toolCallCount, turns: maxTurns };
}
