# Adopt AI — Engineering Conventions

This file overrides the parent CoWork `CLAUDE.md` for everything inside `Adopt-AI/`.

The CoWork doc-management conventions (`_System/Backup/YYYY-MM-DD/`, `_LOGS/change_log.md`,
session notes) are designed for documents and analysis. Inside `Adopt-AI/` we are building a
production software project and the audit trail is **git history**. Do not create
`_System/`, backup copies of files, or markdown change logs inside `Adopt-AI/`.

---

## Stack

- **Monorepo:** pnpm workspaces + Turborepo
- **Language:** TypeScript everywhere (strict mode, no implicit any)
- **Web app:** Next.js 15 (App Router, React 19) — marketing site + portal + API
- **Mobile app:** Expo SDK + React Native + Expo Router (iOS + Android)
- **API:** Next.js Route Handlers + tRPC + Zod
- **DB:** Postgres + Prisma
- **Auth:** Auth.js v5 (email magic-link + Okta OIDC)
- **Styling:** Tailwind CSS v4 (web) / StyleSheet API (mobile), tokens shared via `packages/tokens`
- **Tests:** Vitest + Playwright (web), Jest + RNTL + Maestro (mobile)
- **CI:** GitHub Actions

---

## Directory tree (top-level)

```
Adopt-AI/
├── Design-Docs/        ← canonical design system, do not modify
├── apps/web/           ← Next.js marketing + portal + API
├── apps/mobile/        ← Expo iOS/Android client portal
├── packages/
│   ├── tokens/         ← design tokens (web + mobile)
│   ├── ui-web/         ← shared web atoms
│   ├── ui-mobile/      ← shared RN atoms
│   ├── api-contract/   ← Zod schemas + tRPC router types
│   ├── db/             ← Prisma schema + migrations + seed
│   ├── auth/           ← Auth.js config + helpers
│   ├── analytics/      ← Sentry + Vercel Analytics wrapper
│   ├── config-eslint/  ← shared ESLint configs
│   ├── config-tsconfig/← shared tsconfig bases
│   └── test-utils/     ← shared mocks + MSW handlers
└── .github/workflows/  ← CI
```

---

## Module boundary rules

- Apps **never** import from each other (`apps/web` cannot import from `apps/mobile` or vice versa).
- Apps only consume shared code via `packages/*`.
- `packages/db`, `packages/auth`, `packages/api-contract` (server router) are **server-only**.
  They must not be imported from client components — enforced by `import-x/no-restricted-paths`.
- `packages/tokens` is the **only** place hex codes, font names, and timing values live. If you
  find yourself typing `#D9462C` outside `packages/tokens/src/colors.ts`, stop.

---

## Coding rules

- **No `any`, no `as` casts** outside `packages/test-utils`. Use `unknown` + a Zod parse.
- **No `dangerouslySetInnerHTML`** outside the MDX renderer.
- **Every API input validates with Zod** — both client (RHF resolver) and server (tRPC input).
- **Server-only secrets** read through `lib/env.ts` (Zod-validated process.env). Never inline.
- **Never log PII or secrets.** `pino` redact list configured in `lib/logger.ts`.
- **Naming:** `PascalCase` components, `camelCase` utilities, `kebab-case` files and routes.
- **Imports:** absolute via package names (`@adopt-ai/tokens`), no `../../../` chains.
- **Comments:** default to none. Only add when the *why* is non-obvious. Never narrate *what*
  the code does — well-named identifiers do that.

---

## Copy and content

Marketing-page copy is **final** per `Design-Docs/design_handoff_adopt_ai/02-page-inventory.md`.
Pricing numbers appear in multiple places — if they change, update consistently across
`apps/web/app/(marketing)/pricing/`, `home/`, `services/`, `apps/mobile/app/(portal)/profile/`.

Brand-voice rules from the design handoff README apply to any new copy:
- No jargon (no VPC, p95, eval suite, RLHF, drift).
- No "Fortune-500" or "transform your organization" register.
- Numbers spelled out when spoken in VO ("twenty-two hours").
- Outcome first, customer-as-hero, never our process.

---

## Tests

- **PRs cannot merge red.** Typecheck, lint, unit, e2e all required.
- **Coverage target:** 80% lines on `packages/*` (utilities/contracts). Apps measured by E2E.
- **A11y is non-optional.** `axe-playwright` runs in every web E2E; RNTL accessibility queries
  in every screen test.
- **Lighthouse CI budget:** LCP ≤ 2.0s, CLS ≤ 0.05, TBT ≤ 200ms on the home page.

---

## Security

- See `SECURITY.md` for the full posture.
- Default-deny CSP via Next.js middleware. No `unsafe-inline`, script-src nonces.
- Auth.js secure cookies (`__Secure-` prefix, HTTP-only, SameSite=Lax).
- Mobile: biometric gate via `expo-local-authentication`; cert pinning on production host.
- Rate-limit auth + contact endpoints (Upstash Ratelimit, token bucket, IP+email keyed).
- `gitleaks` pre-commit hook blocks accidental secret commits.
- Prisma parameterised queries only. Zero raw SQL outside `packages/db/src/migrations/`.

---

## Commits and PRs

- **Conventional Commits** required. `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`.
- Commits should be small and focused. One concern per commit.
- PR description must include: summary, screenshots for UI changes, test plan checklist.
- Never use `--no-verify` or skip hooks.
- Never amend a commit that's already pushed.

---

## When in doubt

- The prototype HTML/JSX in `Design-Docs/design_handoff_adopt_ai/prototype/` is the canonical
  spec. If this file disagrees with the prototype, **the prototype wins**.
- For tokens, `01-brand-tokens.md` is the source of truth — `packages/tokens` is generated from it.
- For copy, `02-page-inventory.md` is the source of truth.
