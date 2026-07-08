'use client';

import { useEffect, useState } from 'react';

const COOKIE_NAME = 'adopt-consent';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function getConsent(): string | null {
  if (typeof document === 'undefined') return null;
  const match = new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`).exec(document.cookie);
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
    <div className="border-hairline bg-paper fixed inset-x-0 bottom-0 z-50 border-t px-6 py-4">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-body text-ink/70 text-sm">
          We use essential cookies to run this site and analytics cookies to improve it.
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={() => accept('essential')}
            className="border-hairline font-body text-ink/70 hover:bg-cream rounded-full border px-4 py-2 text-sm transition-colors"
          >
            Essential only
          </button>
          <button
            onClick={() => accept('all')}
            className="bg-ink font-body text-cream hover:bg-ink/80 rounded-full px-4 py-2 text-sm transition-colors"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
