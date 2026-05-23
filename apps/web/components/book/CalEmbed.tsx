'use client';

import Cal, { getCalApi } from '@calcom/embed-react';
import { useEffect } from 'react';

/**
 * Set NEXT_PUBLIC_CAL_LINK in .env.local to your Cal.com booking path.
 * Format: "<username>/<event-type-slug>"
 * Example: NEXT_PUBLIC_CAL_LINK=adoptai/30min
 */
const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK ?? 'demo/30min';

export function CalEmbed() {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: 'book' });
      cal('ui', {
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
    })();
  }, []);

  return (
    <Cal
      namespace="book"
      calLink={CAL_LINK}
      style={{ width: '100%', height: '100%', overflow: 'scroll' }}
      config={{ layout: 'month_view' }}
    />
  );
}
