import Link from 'next/link';

import { BrandMark } from './BrandMark';
import { cn } from '../utils/cn';

const columns = [
  {
    title: 'Services',
    links: [
      ['Workflow agents', '/services'],
      ['Support routing', '/services'],
      ['Document intelligence', '/services'],
      ['Custom fine-tuning', '/services'],
      ['Integration', '/services'],
    ],
  },
  {
    title: 'Company',
    links: [
      ['About', '/about'],
      ['Careers', '/about'],
      ['Press', '/contact'],
      ['Contact', '/contact'],
      ['Client portal', '/portal'],
    ],
  },
  {
    title: 'Resources',
    links: [
      ['Whitepapers', '/resources'],
      ['Blog', '/blog'],
      ['Playbooks', '/resources'],
      ['Pricing', '/pricing'],
      ['Security', '/security'],
    ],
  },
] as const;

interface SiteFooterProps {
  dark?: boolean;
}

export function SiteFooter({ dark = true }: SiteFooterProps) {
  const soft = dark ? 'text-cream/60' : 'text-ink/60';
  const faint = dark ? 'text-cream/40' : 'text-ink/40';
  const line = dark ? 'border-hairline-dark' : 'border-hairline';
  return (
    <footer
      className={cn(
        'border-t px-14 pb-9 pt-20 font-body',
        dark ? 'bg-void text-cream' : 'bg-cream text-ink',
        line,
      )}
    >
      <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <BrandMark size={36} dark={dark} />
          <p className={cn('mt-5 max-w-[320px] text-[14px] leading-[1.55]', soft)}>
            Turn AI into your competitive advantage. We design, ship, and run
            production-grade automation systems for enterprise teams.
          </p>
          <p
            className={cn(
              'mt-7 font-mono text-eyebrow uppercase tracking-[0.12em]',
              faint,
            )}
          >
            500 Enterprise Way, Suite 100 · Orlando, FL 32801
          </p>
          <p
            className={cn(
              'mt-1.5 font-mono text-eyebrow uppercase tracking-[0.12em]',
              faint,
            )}
          >
            hello@adoptai.com · +1 (555) 382-3830
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <div
              className={cn(
                'mb-4.5 font-mono text-eyebrow uppercase tracking-[0.18em]',
                dark ? 'text-cream' : 'text-ink',
              )}
            >
              {col.title}
            </div>
            <ul className="flex flex-col gap-2.5">
              {col.links.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className={cn('text-[14px]', soft)}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div
        className={cn(
          'mt-16 flex flex-wrap justify-between gap-4 border-t pt-6 font-mono text-eyebrow uppercase tracking-[0.12em]',
          faint,
          line,
        )}
      >
        <div>© 2026 Adopt AI Agency Ltd. · Master kit v1.0</div>
        <div className="flex gap-7">
          <Link href="/legal/terms">Terms</Link>
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/security">Security</Link>
          <span>SOC 2 Type II</span>
        </div>
      </div>
    </footer>
  );
}
