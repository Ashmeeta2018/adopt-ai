export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => { setTimeout(resolve, ms); });
}

export interface MockFetchResponse {
  ok: boolean;
  status: number;
  json(): Promise<unknown>;
  text(): Promise<string>;
  headers: { get(name: string): string | null };
}

export function mockFetch(responses: MockFetchResponse[]): () => void {
  let callIndex = 0;
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (() => {
    const response = responses[callIndex] ?? responses[responses.length - 1];
    callIndex += 1;
    return Promise.resolve(response as unknown as Response);
  }) as typeof fetch;

  return () => {
    globalThis.fetch = originalFetch;
  };
}

type ConsoleMethod = 'log' | 'warn' | 'error' | 'info' | 'debug';

export function mockConsole(methods: ConsoleMethod[] = ['log', 'warn', 'error']): () => void {
  const original: Partial<Record<ConsoleMethod, typeof console.log>> = {};

  for (const method of methods) {
    original[method] = console[method];
    console[method] = () => {};
  }

  return () => {
    for (const method of methods) {
      const fn = original[method];
      if (fn) {
        console[method] = fn;
      }
    }
  };
}

interface MockRequestInit {
  method?: string;
  url?: string;
  headers?: Record<string, string>;
  body?: unknown;
  json?: () => Promise<unknown>;
}

export function createMockRequest(overrides: MockRequestInit = {}): Request {
  const url = overrides.url ?? 'http://localhost:3000/api/test';
  const headers = new Headers(overrides.headers ?? { 'content-type': 'application/json' });

  const body = overrides.body
    ? JSON.stringify(overrides.body)
    : undefined;

  return new Request(url, {
    method: overrides.method ?? 'GET',
    headers,
    body,
  });
}

export interface MockTrpcContext {
  session: {
    user: {
      id: string;
      email: string;
      name: string | null;
    };
    expires: string;
  } | null;
  prisma: Record<string, unknown>;
  ip: string;
}

export function createMockContext(
  overrides: Partial<MockTrpcContext> = {},
): MockTrpcContext {
  return {
    session: overrides.session ?? {
      user: {
        id: 'cltestuser00000001',
        email: 'test@example.com',
        name: 'Test User',
      },
      expires: new Date(Date.now() + 86400000 * 30).toISOString(),
    },
    prisma: overrides.prisma ?? {},
    ip: overrides.ip ?? '127.0.0.1',
  };
}
