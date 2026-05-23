# Adopt AI

Marketing site, client portal, and mobile app for **Adopt AI** — an AI-automation studio that
builds production agents for small and mid-sized businesses.

This is a TypeScript monorepo using pnpm workspaces and Turborepo.

```
apps/web      → Next.js 15 marketing site + client portal + API
apps/mobile   → Expo / React Native iOS + Android portal
packages/*    → shared tokens, UI atoms, API contract, DB, auth, configs
Design-Docs/  → canonical design handoff (do not modify)
```

## Quick start

```powershell
# Install dependencies
pnpm install

# Run web (http://localhost:3000)
pnpm --filter @adopt-ai/web dev

# Run mobile (Expo dev server)
pnpm --filter @adopt-ai/mobile start

# Run everything in parallel
pnpm dev
```

## Prerequisites

- **Node.js** ≥ 20.11 (we test on 22.x in CI)
- **pnpm** ≥ 9 (`corepack enable` will set it up)
- **Postgres** 15+ for portal/API work — use Neon (recommended), Supabase, or local Docker
- **Expo Go** app on a physical device, or Xcode 15 / Android Studio for simulators

## Environment

Copy `.env.example` to `.env.local` at the repo root and fill values:

```powershell
Copy-Item .env.example .env.local
```

## Scripts (root)

| Command | What it does |
|---|---|
| `pnpm dev`         | Run web + mobile in parallel via Turborepo |
| `pnpm build`       | Build everything (typecheck + bundle) |
| `pnpm typecheck`   | `tsc --noEmit` across all packages |
| `pnpm lint`        | ESLint across all packages |
| `pnpm test`        | Vitest + Jest unit suites |
| `pnpm test:e2e`    | Playwright (web) + Maestro (mobile) |
| `pnpm db:migrate`  | Apply Prisma migrations |
| `pnpm db:seed`     | Seed the local Postgres with demo data |

## Project conventions

See [`CLAUDE.md`](./CLAUDE.md) for engineering rules (module boundaries, naming, security
defaults, testing posture). See [`SECURITY.md`](./SECURITY.md) for the security policy.

## License

Proprietary — © 2026 Adopt AI. All rights reserved.
