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
    <div className="flex min-h-screen bg-cream text-ink">
      {/* Sidebar */}
      <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-hairline bg-paper">
        <div className="flex items-center gap-3 border-b border-hairline px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-void">
            <span className="font-display text-sm font-semibold text-cream">A</span>
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold text-ink">Adopt AI</p>
            <p className="truncate font-mono text-[11px] uppercase tracking-wider text-ink/50">Portal</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 font-body text-sm transition-colors',
                  isActive
                    ? 'bg-cream font-medium text-ink'
                    : 'text-ink/70 hover:bg-cream hover:text-ink',
                ].join(' ')}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-hairline px-3 py-4">
          <Link
            href="/portal/settings"
            className={[
              'flex items-center gap-3 rounded-lg px-3 py-2.5 font-body text-sm transition-colors',
              pathname === '/portal/settings'
                ? 'bg-cream font-medium text-ink'
                : 'text-ink/70 hover:bg-cream hover:text-ink',
            ].join(' ')}
          >
            <span className="text-base">⚙</span>
            Settings
          </Link>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 font-body text-sm text-ink/50 transition-colors hover:bg-cream hover:text-ink"
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
