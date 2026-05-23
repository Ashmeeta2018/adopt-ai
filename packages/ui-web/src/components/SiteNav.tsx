'use client';

import Link from 'next/link';

import { Button } from './Button';
import { BrandMark } from './BrandMark';
import { cn } from '../utils/cn';

type NavCurrent =
  | 'home'
  | 'services'
  | 'work'
  | 'resources'
  | 'blog'
  | 'about'
  | 'pricing'
  | null;

interface SiteNavProps {
  dark?: boolean;
  current?: NavCurrent;
  sticky?: boolean;
  glass?: boolean;
}

const items = [
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/work/apex-regional-logistics' },
  { label: 'Resources', href: '/resources' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Pricing', href: '/pricing' },
] as const;

export function SiteNav({
  dark = false,
  current = null,
  sticky = true,
  glass = false,
}: SiteNavProps) {
  return (
    <header
      className={cn(
        'z-50 flex items-center justify-between px-14 py-5',
        sticky ? 'sticky top-0' : 'relative',
        glass
          ? cn(
              'backdrop-blur-md backdrop-saturate-140 border-b',
              dark
                ? 'bg-[rgba(15,8,5,0.55)] border-hairline-dark'
                : 'bg-[rgba(248,244,238,0.65)] border-hairline',
            )
          : '',
      )}
    >
      <Link href="/" aria-label="Adopt AI home">
        <BrandMark size={30} dark={dark} withType={true} />
      </Link>
      <nav
        className={cn(
          'hidden items-center gap-7 font-body text-[14px] md:flex',
          dark ? 'text-cream/65' : 'text-ink/65',
        )}
      >
        {items.map((it) => {
          const active = it.label.toLowerCase() === current;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                active && (dark ? 'text-cream' : 'text-ink'),
                active && 'font-semibold',
              )}
            >
              {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center gap-3">
        <Link
          href="/portal"
          className={cn('font-body text-[14px]', dark ? 'text-cream/65' : 'text-ink/65')}
        >
          Sign in
        </Link>
        <Button size="sm" variant={dark ? 'primary' : 'dark'}>
          Book a call
        </Button>
      </div>
    </header>
  );
}
