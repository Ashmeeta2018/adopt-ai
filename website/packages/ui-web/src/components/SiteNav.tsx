'use client';

import { useState } from 'react';
import Link from 'next/link';

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

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="6" y1="18" x2="18" y2="6" />
    </svg>
  );
}

export function SiteNav({
  dark = false,
  current = null,
  sticky = true,
  glass = false,
}: SiteNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        'z-50 flex items-center justify-between px-6 py-4 md:px-14 md:py-6',
        sticky ? 'sticky top-0' : 'relative',
        glass
          ? cn(
              'backdrop-blur-md backdrop-saturate-140 border-b',
              dark
                ? 'bg-[rgba(15,8,5,0.55)] border-hairline-dark'
                : 'bg-[rgba(248,244,238,0.65)] border-hairline',
            )
          : sticky
            ? cn(
                'border-b',
                dark ? 'bg-void border-hairline-dark' : 'bg-cream border-hairline',
              )
            : '',
      )}
    >
      <Link href="/" aria-label="Adopt AI home">
        <BrandMark size={144} stacked dark={dark} withType={true} />
      </Link>

      {/* Desktop nav */}
      <nav
        className={cn(
          'hidden items-center gap-7 font-body text-[14px] md:flex',
          dark ? 'text-cream/65' : 'text-ink/65',
        )}
        aria-label="Main navigation"
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
          className={cn('hidden font-body text-[15px] md:inline', dark ? 'text-cream/65' : 'text-ink/65')}
        >
          Sign in
        </Link>
        <Link
          href="/book"
          className={cn(
            'hidden md:inline-flex items-center gap-2 rounded-full font-display font-medium',
            'px-[18px] py-[12px] text-[14px] tracking-tight',
            'transition-[transform,box-shadow] duration-150 ease-out',
            'bg-ember-cta text-[#FFF8F0] shadow-cta',
            'hover:scale-[1.02] active:scale-[0.99]',
          )}
        >
          Book a call <span className="ml-0.5">→</span>
        </Link>

        {/* Mobile hamburger */}
        <button
          type="button"
          className={cn('flex items-center justify-center md:hidden', dark ? 'text-cream' : 'text-ink')}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav
          className={cn(
            'absolute inset-x-0 top-full border-b px-6 pb-6 pt-4 md:hidden',
            dark ? 'bg-void border-hairline-dark' : 'bg-cream border-hairline',
          )}
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-4">
            {items.map((it) => {
              const active = it.label.toLowerCase() === current;
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'font-body text-[16px]',
                    dark ? 'text-cream/65' : 'text-ink/65',
                    active && (dark ? 'text-cream' : 'text-ink'),
                    active && 'font-semibold',
                  )}
                >
                  {it.label}
                </Link>
              );
            })}
            <div className={cn('mt-2 flex flex-col gap-3 border-t pt-4', dark ? 'border-hairline-dark' : 'border-hairline')}>
              <Link
                href="/portal"
                onClick={() => setMenuOpen(false)}
                className={cn('font-body text-[16px]', dark ? 'text-cream/65' : 'text-ink/65')}
              >
                Sign in
              </Link>
              <Link
                href="/book"
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'inline-flex w-full items-center justify-center gap-2 rounded-full font-display font-medium',
                  'px-[18px] py-[12px] text-[14px] tracking-tight',
                  'transition-[transform,box-shadow] duration-150 ease-out',
                  'bg-ember-cta text-[#FFF8F0] shadow-cta',
                  'hover:scale-[1.02] active:scale-[0.99]',
                )}
              >
                Book a call <span className="ml-0.5">→</span>
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
