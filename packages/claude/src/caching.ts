import type { TokenUsage } from '@adopt-ai/model-wrapper/types';
import type { ClaudeTool } from './tools;

export type CacheStrategy = 'none' | 'ephemeral' | 'persistent';

interface CacheControl {
  type: CacheStrategy;
}

interface SystemBlock {
  type: 'text';
  text: string;
  cache_control?: CacheControl;
}

interface ToolWithCache extends ClaudeTool {
  cache_control?: CacheControl;
}

export function withCacheControl(systemPrompt: string, strategy: CacheStrategy): SystemBlock[] {
  if (strategy === 'none') {
    return [{ type: 'text', text: systemPrompt }];
  }
  return [
    {
      type: 'text',
      text: systemPrompt,
      cache_control: { type: strategy },
    },
  ];
}

export function withCachedTools(tools: ClaudeTool[], strategy: CacheStrategy): ToolWithCache[] {
  if (strategy === 'none' || tools.length === 0) {
    return tools;
  }

  const result: ToolWithCache[] = tools.map((t) => ({ ...t }));

  result[result.length - 1] = {
    ...result[result.length - 1]!,
    cache_control: { type: strategy },
  };

  return result;
}

export function buildCachedMessages<T extends { role: string }>(
  messages: T[],
  cacheAfter: number,
): T[] {
  if (cacheAfter <= 0) {
    return messages;
  }

  return messages;
}

export interface CacheStats {
  cacheReadInputTokens: number;
  cacheCreationInputTokens: number;
  cacheHitRate: number;
  totalCachedTokens: number;
}

export function getCacheStats(usage: TokenUsage): CacheStats {
  const cacheRead = usage.cacheReadTokens ?? 0;
  const cacheWrite = usage.cacheCreationTokens ?? 0;
  const totalInput = usage.inputTokens;
  const totalCached = cacheRead + cacheWrite;

  return {
    cacheReadInputTokens: cacheRead,
    cacheCreationInputTokens: cacheWrite,
    cacheHitRate: totalInput > 0 ? cacheRead / totalInput : 0,
    totalCachedTokens: totalCached,
  };
}
