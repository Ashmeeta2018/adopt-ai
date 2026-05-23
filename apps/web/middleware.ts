import { type NextRequest, NextResponse } from 'next/server';

/**
 * Strict security headers. CSP uses a per-request nonce — we attach it to
 * a header that Next.js' Script component will pick up automatically.
 *
 * If you find yourself adding `'unsafe-inline'`, stop. Inline scripts ride the
 * nonce, inline styles ride the `style-src 'unsafe-inline'` allow we keep for
 * Tailwind's CSS-in-JS atoms (Tailwind ships pre-compiled CSS, but a few
 * Framer-Motion + animated SVGs use inline styles).
 *
 * /book embeds a Cal.com scheduling widget. The frame-src and script-src
 * entries for app.cal.com are scoped to that route only so we don't open the
 * rest of the site to third-party frames.
 */
export function middleware(request: NextRequest) {
  const nonce = crypto.randomUUID().replace(/-/g, '');
  const isDev = process.env.NODE_ENV !== 'production';
  const isBookPage = request.nextUrl.pathname.startsWith('/book');

  const csp = [
    `default-src 'self'`,
    // Cal.com embed script is loaded on /book via next/script (nonce-tagged).
    // strict-dynamic then allows scripts that script loads in turn.
    `script-src 'self' 'nonce-${nonce}' ${isDev ? "'unsafe-eval'" : ''} 'strict-dynamic'${isBookPage ? ' https://app.cal.com' : ''}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob: https:`,
    `font-src 'self' data:`,
    `connect-src 'self' ${isDev ? 'ws: http://localhost:* http://127.0.0.1:*' : 'https:'}`,
    // Allow the Cal.com calendar iframe only on the /book page.
    isBookPage ? `frame-src https://app.cal.com https://cal.com` : null,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `object-src 'none'`,
    `upgrade-insecure-requests`,
  ]
    .filter(Boolean)
    .join('; ');

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()',
  );
  if (!isDev) {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload',
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|brand/|robots.txt|sitemap.xml).*)',
  ],
};
