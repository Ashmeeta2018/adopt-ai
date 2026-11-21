import { simulateReadableStream } from 'ai';
import { MockLanguageModelV4 } from 'ai/test';
import { describe, expect, it } from 'vitest';

import { ClaudeProvider } from './provider';
import { claudeTool, toolUseLoop } from './tools';

import type { ChatMessage, StreamChunk } from '@adopt-ai/model-wrapper/types';

const TEST_ENV = {
  AI_GATEWAY_API_KEY: 'test-key',
  CLAUDE_MODEL: 'anthropic/claude-sonnet-5',
  CLAUDE_MAX_TOKENS: 4096,
  CLAUDE_TEMPERATURE: undefined,
};

const USAGE = {
  inputTokens: {
    total: 10,
    noCache: 8,
    cacheRead: 2,
    cacheWrite: undefined,
  },
  outputTokens: {
    total: 20,
    text: 20,
    reasoning: undefined,
  },
};

type DoGenerateOptions = Parameters<MockLanguageModelV4['doGenerate']>[0];

describe('ClaudeProvider.complete', () => {
  it('maps text, usage, and finish reason', async () => {
    const provider = new ClaudeProvider(
      TEST_ENV,
      new MockLanguageModelV4({
        doGenerate: () =>
          Promise.resolve({
            content: [{ type: 'text', text: 'Hello, world!' }],
            finishReason: { unified: 'stop' as const, raw: undefined },
            usage: USAGE,
            warnings: [],
          }),
      }),
    );

    const result = await provider.complete([{ role: 'user', content: 'Hi' }], {
      model: 'anthropic/claude-sonnet-5',
      maxTokens: 1024,
    });

    expect(result.content).toBe('Hello, world!');
    expect(result.usage).toEqual({
      inputTokens: 10,
      outputTokens: 20,
      cacheReadTokens: 2,
      cacheCreationTokens: undefined,
    });
    expect(result.stopReason).toBe('stop');
  });

  it('sends tool definitions and maps returned tool calls', async () => {
    let seenOptions: DoGenerateOptions | undefined;

    const provider = new ClaudeProvider(
      TEST_ENV,
      new MockLanguageModelV4({
        doGenerate: (options) => {
          seenOptions = options;
          return Promise.resolve({
            content: [
              {
                type: 'tool-call' as const,
                toolCallId: 'call-1',
                toolName: 'lookup_shipment',
                input: JSON.stringify({ bol: 'BOL-123' }),
              },
            ],
            finishReason: { unified: 'tool-calls' as const, raw: undefined },
            usage: USAGE,
            warnings: [],
          });
        },
      }),
    );

    const result = await provider.complete([{ role: 'user', content: 'Find BOL-123' }], {
      model: 'anthropic/claude-sonnet-5',
      maxTokens: 1024,
      tools: [
        {
          name: 'lookup_shipment',
          description: 'Look up a shipment by BOL number',
          inputSchema: {
            type: 'object',
            properties: { bol: { type: 'string' } },
            required: ['bol'],
          },
        },
      ],
    });

    expect(seenOptions?.tools).toHaveLength(1);
    expect(seenOptions?.tools?.[0]).toMatchObject({ name: 'lookup_shipment' });

    expect(result.toolCalls).toEqual([
      { id: 'call-1', name: 'lookup_shipment', arguments: { bol: 'BOL-123' } },
    ]);
  });

  it('recovers the tool name for tool-result messages', async () => {
    let seenOptions: DoGenerateOptions | undefined;

    const provider = new ClaudeProvider(
      TEST_ENV,
      new MockLanguageModelV4({
        doGenerate: (options) => {
          seenOptions = options;
          return Promise.resolve({
            content: [{ type: 'text' as const, text: 'Shipment is in transit.' }],
            finishReason: { unified: 'stop' as const, raw: undefined },
            usage: USAGE,
            warnings: [],
          });
        },
      }),
    );

    const conversation: ChatMessage[] = [
      { role: 'user', content: 'Find BOL-123' },
      {
        role: 'assistant',
        content: undefined,
        toolCalls: [{ id: 'call-1', name: 'lookup_shipment', arguments: { bol: 'BOL-123' } }],
      },
      { role: 'tool', content: '{"status":"in_transit"}', toolCallId: 'call-1' },
    ];

    await provider.complete(conversation, {
      model: 'anthropic/claude-sonnet-5',
      maxTokens: 1024,
    });

    const toolMessage = seenOptions?.prompt.find((m) => m.role === 'tool');
    expect(toolMessage).toBeDefined();
    expect(toolMessage?.content[0]).toMatchObject({
      type: 'tool-result',
      toolCallId: 'call-1',
      toolName: 'lookup_shipment',
    });
  });
});

describe('ClaudeProvider.stream', () => {
  it('yields content deltas, usage, and a done chunk', async () => {
    const provider = new ClaudeProvider(
      TEST_ENV,
      new MockLanguageModelV4({
        doStream: () =>
          Promise.resolve({
            stream: simulateReadableStream({
              chunks: [
                { type: 'text-start' as const, id: 'text-1' },
                { type: 'text-delta' as const, id: 'text-1', delta: 'Hello' },
                { type: 'text-delta' as const, id: 'text-1', delta: ', world!' },
                { type: 'text-end' as const, id: 'text-1' },
                {
                  type: 'finish' as const,
                  finishReason: { unified: 'stop' as const, raw: undefined },
                  usage: USAGE,
                },
              ],
            }),
          }),
      }),
    );

    const chunks: StreamChunk[] = [];
    for await (const chunk of provider.stream([{ role: 'user', content: 'Hi' }], {
      model: 'anthropic/claude-sonnet-5',
      maxTokens: 1024,
    })) {
      chunks.push(chunk);
    }

    const deltas = chunks.filter((c) => c.type === 'content_delta');
    expect(deltas.map((d) => d.delta).join('')).toBe('Hello, world!');

    const done = chunks.find((c) => c.type === 'done');
    expect(done?.response.content).toBe('Hello, world!');
    expect(done?.response.usage.inputTokens).toBe(10);
  });
});

describe('toolUseLoop', () => {
  it('executes returned tool calls and feeds results back', async () => {
    let call = 0;
    const executed: unknown[] = [];

    const provider = new ClaudeProvider(
      TEST_ENV,
      new MockLanguageModelV4({
        doGenerate: () => {
          call += 1;
          if (call === 1) {
            return Promise.resolve({
              content: [
                {
                  type: 'tool-call' as const,
                  toolCallId: 'call-1',
                  toolName: 'lookup_shipment',
                  input: JSON.stringify({ bol: 'BOL-123' }),
                },
              ],
              finishReason: { unified: 'tool-calls' as const, raw: undefined },
              usage: USAGE,
              warnings: [],
            });
          }
          return Promise.resolve({
            content: [{ type: 'text' as const, text: 'It is in transit.' }],
            finishReason: { unified: 'stop' as const, raw: undefined },
            usage: USAGE,
            warnings: [],
          });
        },
      }),
    );

    const result = await toolUseLoop({
      provider,
      messages: [{ role: 'user', content: 'Where is BOL-123?' }],
      tools: [
        claudeTool('lookup_shipment', 'Look up a shipment by BOL number', {
          properties: { bol: { type: 'string' } },
          required: ['bol'],
        }),
      ],
      executors: new Map([
        [
          'lookup_shipment',
          (args: Record<string, unknown>) => {
            executed.push(args);
            return Promise.resolve({ status: 'in_transit' });
          },
        ],
      ]),
      config: { model: 'anthropic/claude-sonnet-5', maxTokens: 1024 },
      maxTurns: 5,
    });

    expect(executed).toEqual([{ bol: 'BOL-123' }]);
    expect(result.toolCallCount).toBe(1);
    expect(result.turns).toBe(2);
    expect(result.finalResponse.content).toBe('It is in transit.');
  });
});
