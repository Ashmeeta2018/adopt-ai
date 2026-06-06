# AI Agency (adopt-ai) — Workspace

Organisational hub for all non-code content: brand, projects, content, docs, resources.

## Structure

| Folder | Purpose |
|--------|---------|
| `00-brand/` | Logo references, color palette, tone-of-voice guide. Actual binary files (SVG, PNG, AI) live in MinIO. |
| `01-projects/` | Project briefs, status docs, and links to code repos. One subfolder per project: `YYYY-MM-description/` |
| `02-content/` | Content drafts and scripts — social, blog, email. Large graphic files go in MinIO. |
| `03-docs/` | SOPs, proposals, onboarding docs, reusable templates. |
| `04-resources/` | Research notes, inspiration, tool references. |
| `05-archive/` | Completed projects and expired content. Format: `YYYY-<name>/` |

## Code Repositories (linked, not stored here)

- [agency-website](http://gitea.home.lab/adopt-ai/agency-website) — main agency website
- [agency-automations](http://gitea.home.lab/adopt-ai/agency-automations) — n8n workflows & automation scripts

## Naming Conventions

- Projects: `YYYY-MM-description/` e.g. `2026-05-brand-refresh/`
- SOPs: `sop-<topic>.md` e.g. `sop-client-onboarding.md`
- Deliverables: `<name>-v<N>-final.<ext>`
- Meeting notes: `YYYY-MM-DD-<topic>.md`
