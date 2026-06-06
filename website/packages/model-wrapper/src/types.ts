import { z } from 'zod';

export const ModelProviderSchema = z.enum(['anthropic', 'openai', 'google', 'local']);
export type ModelProvider = z.infer<typeof ModelProviderSchema>;

export const MessageRoleSchema = z.enum(['system', 'user', 'assistant', 'tool']);
export type MessageRole = z.infer<typeof MessageRoleSchema>;

export const ToolCallSchema = z.object({
  id: z.string(),
  name: z.string(),
  arguments: z.record(z.unknown()),
});
export type ToolCall = z.infer<typeof ToolCallSchema>;

export const ToolResultSchema = z.object({
  toolCallId: z.string(),
  result: z.unknown(),
  isError: z.boolean(),
});
export type ToolResult = z.infer<typeof ToolResultSchema>;

export const SystemMessageSchema = z.object({
  role: z.literal('system'),
  content: z.string(),
});

export const UserMessageSchema = z.object({
  role: z.literal('user'),
  content: z.string(),
  images: z
    .array(
      z.object({
        url: z.string(),
        mediaType: z.string(),
      }),
    )
    .optional(),
});

export const AssistantMessageSchema = z.object({
  role: z.literal('assistant'),
  content: z.string().optional(),
  toolCalls: z.array(ToolCallSchema).optional(),
});

export const ToolMessageSchema = z.object({
  role: z.literal('tool'),
  content: z.string(),
  toolCallId: z.string(),
  isError: z.boolean().optional(),
});

export const ChatMessageSchema = z.discriminatedUnion('role', [
  SystemMessageSchema,
  UserMessageSchema,
  AssistantMessageSchema,
  ToolMessageSchema,
]);

export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type SystemMessage = z.infer<typeof SystemMessageSchema>;
export type UserMessage = z.infer<typeof UserMessageSchema>;
export type AssistantMessage = z.infer<typeof AssistantMessageSchema>;
export type ToolMessage = z.infer<typeof ToolMessageSchema>;

export const ModelConfigSchema = z.object({
  model: z.string(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().positive(),
  topP: z.number().min(0).max(1).optional(),
  stopSequences: z.array(z.string()).optional(),
  systemPrompt: z.string().optional(),
});
export type ModelConfig = z.infer<typeof ModelConfigSchema>;

export const TokenUsageSchema = z.object({
  inputTokens: z.number().int().nonnegative(),
  outputTokens: z.number().int().nonnegative(),
  cacheReadTokens: z.number().int().nonnegative().optional(),
  cacheCreationTokens: z.number().int().nonnegative().optional(),
});
export type TokenUsage = z.infer<typeof TokenUsageSchema>;

export const CostConfigSchema = z.object({
  inputPer1k: z.number().nonnegative(),
  outputPer1k: z.number().nonnegative(),
  cacheReadPer1k: z.number().nonnegative().optional(),
  cacheWritePer1k: z.number().nonnegative().optional(),
});
export type CostConfig = z.infer<typeof CostConfigSchema>;

export const CompletionResponseSchema = z.object({
  content: z.string(),
  toolCalls: z.array(ToolCallSchema),
  usage: TokenUsageSchema,
  model: z.string(),
  stopReason: z.string(),
  id: z.string(),
});
export type CompletionResponse = z.infer<typeof CompletionResponseSchema>;

export const ContentDeltaChunkSchema = z.object({
  type: z.literal('content_delta'),
  delta: z.string(),
});

export const ToolCallChunkSchema = z.object({
  type: z.literal('tool_call'),
  toolCall: ToolCallSchema,
});

export const UsageChunkSchema = z.object({
  type: z.literal('usage'),
  usage: TokenUsageSchema,
});

export const DoneChunkSchema = z.object({
  type: z.literal('done'),
  response: CompletionResponseSchema,
});

export const StreamChunkSchema = z.discriminatedUnion('type', [
  ContentDeltaChunkSchema,
  ToolCallChunkSchema,
  UsageChunkSchema,
  DoneChunkSchema,
]);
export type StreamChunk = z.infer<typeof StreamChunkSchema>;
export type ContentDeltaChunk = z.infer<typeof ContentDeltaChunkSchema>;
export type ToolCallChunk = z.infer<typeof ToolCallChunkSchema>;
export type UsageChunk = z.infer<typeof UsageChunkSchema>;
export type DoneChunk = z.infer<typeof DoneChunkSchema>;
