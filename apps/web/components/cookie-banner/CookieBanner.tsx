'use client';

import { useEffect, useState } from 'react';

const COOKIE_NAME = 'adopt-consent';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function getConsent(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

function setConsent(value: 'all' | 'essential') {
  const secure = location.protocol === 'https:' ? ';secure' : '';
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(value)};path=/;max-age=${COOKIE_MAX_AGE};samesite=lax${secure}`;
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!getConsent());
  }, []);

  if (!visible) return null;

  const accept = (value: 'all' | 'essential') => {
    setConsent(value);
    setVisible(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-hairline bg-paper px-6 py-4">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-body text-sm text-ink/70">
          We use essential cookies to run this site and analytics cookies to improve it.
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={() => accept('essential')}
            className="rounded-full border border-hairline px-4 py-2 font-body text-sm text-ink/70 transition-colors hover:bg-cream"
          >
            Essential only
          </button>
          <button
            onClick={() => accept('all')}
            className="rounded-full bg-ink px-4 py-2 font-body text-sm text-cream transition-colors hover:bg-ink/80"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
