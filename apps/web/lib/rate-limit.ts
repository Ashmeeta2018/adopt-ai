import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

import { env } from './env';

/**
 * Edge-friendly token-bucket rate limit. Backed by Upstash Redis in prod,
 * an in-memory map in dev (so dev still works without Redis).
 */
const redisAvailable = !!env.UPSTASH_REDIS_REST_URL && !!env.UPSTASH_REDIS_REST_TOKEN;

const redis = redisAvailable
  ? new Redis({
      url: env.UPSTASH_REDIS_REST_URL!,
      token: env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

interface InMemoryStore {
  hits: Map<string, { count: number; resetAt: number }>;
}

const memStore: InMemoryStore = { hits: new Map() };

function inMemoryLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const entry = memStore.hits.get(key);
  if (!entry || entry.resetAt < now) {
    memStore.hits.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, reset: now + windowMs };
  }
  if (entry.count >= limit) {
    return { success: false, remaining: 0, reset: entry.resetAt };
  }
  entry.count += 1;
  return { success: true, remaining: limit - entry.count, reset: entry.resetAt };
}

export function createRateLimiter(name: string, limit: number, window: `${number} ${'s' | 'm'}`) {
  if (redis) {
    return new Ratelimit({
      redis,
      limiter: Ratelimit.tokenBucket(limit, window, limit),
      prefix: `rl:${name}`,
      analytics: true,
    });
  }
  const ms = window.endsWith('s')
    ? parseInt(window) * 1000
    : parseInt(window) * 60 * 1000;
  return {
    limit: (key: string) => Promise.resolve(inMemoryLimit(`${name}:${key}`, limit, ms)),
  };
}

export const contactLimiter = createRateLimiter('contact', 5, '1 m');
export const authLimiter = createRateLimiter('auth', 10, '5 m');
