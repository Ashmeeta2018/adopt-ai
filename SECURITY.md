# Security Policy

We take the security of Adopt AI products and our customers' data seriously.

## Reporting a vulnerability

Email **security@adoptai.com** with:

- A description of the issue and where you found it (URL, endpoint, screen)
- Steps to reproduce
- The impact you believe it could have
- Any proof-of-concept code or screenshots

**Please do not** open a public GitHub issue for security reports.

### Our commitment

- We acknowledge receipt within **two business days**.
- We aim to provide a status update within **seven calendar days**.
- We follow a **90-day coordinated disclosure** window from the date of acknowledgement.
- We credit reporters in our release notes unless you request otherwise.

We do not currently run a paid bug-bounty programme. We will, however, send swag and a sincere
thank-you for any valid report.

## Scope

In scope:

- `adoptai.com` and all subdomains
- The Adopt AI mobile apps (iOS and Android)
- The `/api/*` endpoints
- Any code in this repository

Out of scope:

- Social engineering of Adopt AI staff or customers
- Physical attacks against our offices or staff
- DoS / volumetric attacks
- Reports relying solely on outdated browsers (≥ 2 major versions behind)
- Reports of missing security headers without a demonstrable impact
- Vulnerabilities in third-party dependencies that we cannot patch directly (please report
  those upstream)

## Security posture

- **TLS:** HTTPS-only, HSTS preloaded, TLS 1.3 minimum.
- **Headers:** strict Content-Security-Policy (script nonces, no `unsafe-inline`),
  X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- **Auth:** Auth.js v5 with HTTP-only `__Secure-` cookies (SameSite=Lax). Magic-link tokens
  are single-use, ten-minute TTL, hashed at rest. Okta OIDC for enterprise SSO.
- **Mobile:** biometric gate via `expo-local-authentication`. Cert pinning on production host.
- **Input validation:** every API endpoint validates input with a Zod schema.
- **Rate limiting:** Upstash Ratelimit on auth and contact endpoints (token bucket, IP+email).
- **Dependencies:** Renovate for weekly updates; `pnpm audit --prod` in CI.
- **Secrets:** never committed; pre-commit `gitleaks` hook; secrets live in Vercel / EAS Secret
  managers.
- **OWASP:** parameterised queries (Prisma), strict CSP (XSS), Auth.js CSRF, allowlisted return
  URLs (open redirect), session + tenant-scope checks on every portal route (broken access
  control).
- **PII:** customer email and phone encrypted at rest (Postgres `pgcrypto`). Audit log records
  reads of any PII row.
- **Logging:** `pino` configured to redact secret keys; no PII or credentials in logs.

## Compliance posture

We are building to **SOC 2 Type II**, **ISO 27001**, and **HIPAA** controls. Formal certification
is a process workstream tracked separately from this repository.
