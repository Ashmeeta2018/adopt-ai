import type { ChatMessage } from './types';

const CHARS_PER_TOKEN = 4;

const ROLE_OVERHEAD_TOKENS: Record<ChatMessage['role'], number> = {
  system: 4,
  user: 4,
  assistant: 4,
  tool: 6,
};

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

export function truncateToTokenLimit(text: string, limit: number): string {
  const maxChars = limit * CHARS_PER_TOKEN;
  if (text.length <= maxChars) {
    return text;
  }
  return text.slice(0, maxChars);
}

export function countMessagesTokens(messages: ChatMessage[]): number {
  let total = 0;
  for (const message of messages) {
    total += ROLE_OVERHEAD_TOKENS[message.role];

    if (typeof message.content === 'string') {
      total += estimateTokens(message.content);
    }

    if (message.role === 'user' && message.images) {
      total += message.images.length * 85;
    }

    if (message.role === 'assistant' && message.toolCalls) {
      for (const tc of message.toolCalls) {
        total += estimateTokens(tc.name) + estimateTokens(JSON.stringify(tc.arguments)) + 4;
      }
    }

    if (message.role === 'tool') {
      total += estimateTokens(message.toolCallId);
    }
  }

  total += 2;
  return total;
}
