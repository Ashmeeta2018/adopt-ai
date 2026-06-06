import { describe, expect, it } from 'vitest';
import { estimateTokens, truncateToTokenLimit, countMessagesTokens } from './tokenizer';

describe('estimateTokens', () => {
  it('estimates ~1 token per 4 characters', () => {
    expect(estimateTokens('abcd')).toBe(1);
    expect(estimateTokens('abcdefgh')).toBe(2);
    expect(estimateTokens('')).toBe(0);
  });

  it('rounds up partial tokens', () => {
    expect(estimateTokens('abc')).toBe(1);
    expect(estimateTokens('abcde')).toBe(2);
  });
});

describe('truncateToTokenLimit', () => {
  it('returns text unchanged if under limit', () => {
    const text = 'Hello world';
    expect(truncateToTokenLimit(text, 100)).toBe(text);
  });

  it('truncates to the character equivalent of the token limit', () => {
    const text = 'a'.repeat(100);
    const result = truncateToTokenLimit(text, 10);
    // 10 tokens * 4 chars = 40 chars
    expect(result).toBe('a'.repeat(40));
  });

  it('handles zero-length text', () => {
    expect(truncateToTokenLimit('', 10)).toBe('');
  });
});

describe('countMessagesTokens', () => {
  it('counts tokens for simple text messages', () => {
    const messages = [
      { role: 'system' as const, content: 'You are helpful.' },
      { role: 'user' as const, content: 'Hello there' },
      { role: 'assistant' as const, content: 'Hi! How can I help?' },
    ];

    const total = countMessagesTokens(messages);
    expect(total).toBeGreaterThan(0);

    // Each message adds role overhead (4) + content tokens
    const expected =
      4 + Math.ceil('You are helpful.'.length / 4) +
      4 + Math.ceil('Hello there'.length / 4) +
      4 + Math.ceil('Hi! How can I help?'.length / 4) +
      2; // base overhead
    expect(total).toBe(expected);
  });

  it('counts tokens for messages with images', () => {
    const messages = [
      {
        role: 'user' as const,
        content: 'Describe this',
        images: [{ url: 'https://example.com/img.png', mediaType: 'image/png' }],
      },
    ];

    const total = countMessagesTokens(messages);
    expect(total).toBeGreaterThanOrEqual(4 + 85 + 3 + 2);
  });

  it('counts tokens for assistant messages with tool calls', () => {
    const messages = [
      {
        role: 'assistant' as const,
        content: undefined,
        toolCalls: [
          { id: 'tc1', name: 'search', arguments: { query: 'test' } },
        ],
      },
    ];

    const total = countMessagesTokens(messages);
    expect(total).toBeGreaterThan(0);
  });

  it('counts tokens for tool result messages', () => {
    const messages = [
      {
        role: 'tool' as const,
        content: 'result data here',
        toolCallId: 'tc1',
      },
    ];

    const total = countMessagesTokens(messages);
    expect(total).toBeGreaterThan(0);
  });

  it('returns base overhead for empty message array', () => {
    expect(countMessagesTokens([])).toBe(2);
  });
});
