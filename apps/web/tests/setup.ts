/// <reference types="vitest/globals" />
import '@testing-library/jest-dom/vitest';

vi.mock('next/headers', () => ({
  headers: () => new Headers(),
  cookies: () => ({
    get: () => undefined,
    set: () => {},
  }),
}));

vi.mock('next/navigation', () => ({
  redirect: (path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`);
  },
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));
