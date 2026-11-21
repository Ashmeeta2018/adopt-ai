'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { ReactNode } from 'react';

const NAV_ITEMS = [
  { href: '/portal/dashboard', label: 'Dashboard', icon: '◼' },
  { href: '/portal/agents', label: 'Agents', icon: '◉' },
  { href: '/portal/workflows', label: 'Workflows', icon: '⑂' },
  { href: '/portal/reports', label: 'Reports', icon: '▤' },
  { href: '/portal/alerts', label: 'Alerts', icon: '◆' },
] as const;

export function PortalShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="bg-void text-cream flex min-h-screen">
      {/* Sidebar */}
      <aside className="border-hairline-dark bg-void sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r">
        <div className="border-hairline-dark flex items-center gap-3 border-b px-5 py-5">
          <div className="bg-cream/10 flex h-9 w-9 items-center justify-center rounded-lg">
            <span className="font-display text-cream text-sm font-semibold">A</span>
          </div>
          <div className="min-w-0">
            <p className="font-display text-cream truncate text-sm font-semibold">Adopt AI</p>
            <p className="text-cream/50 truncate font-mono text-[11px] uppercase tracking-wider">
              Portal
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'font-body flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                  isActive
                    ? 'bg-cream/10 text-cream font-medium'
                    : 'text-cream/60 hover:bg-cream/5 hover:text-cream',
                ].join(' ')}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-hairline-dark border-t px-3 py-4">
          <Link
            href="/portal/settings"
            className={[
              'font-body flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
              pathname === '/portal/settings'
                ? 'bg-cream/10 text-cream font-medium'
                : 'text-cream/60 hover:bg-cream/5 hover:text-cream',
            ].join(' ')}
          >
            <span className="text-base">⚙</span>
            Settings
          </Link>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="font-body text-cream/40 hover:bg-cream/5 hover:text-cream flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors"
            >
              <span className="text-base">←</span>
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1200px] px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
