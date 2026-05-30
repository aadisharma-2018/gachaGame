# Data Model: Phase 4 CI Pipeline

**Branch**: `004-phase4-github-ci` | **Date**: 2026-05-20

Phase 4 adds automation metadata only—no application data entities.

## Entities

### Workflow (`ci.yml`)

| Attribute | Value |
|-----------|--------|
| Path | `.github/workflows/ci.yml` |
| Name | `CI` |
| Triggers | `pull_request` → `main`, `push` → `main` |
| Runner | `ubuntu-latest` |
| Jobs | Single job `ci` |

### CI Job Steps (ordered)

| Order | Step name | Command / action | Fail if |
|-------|-----------|------------------|---------|
| 1 | Checkout | `actions/checkout@v4` | checkout fails |
| 2 | Setup Node | `actions/setup-node@v4`, node **20** | setup fails |
| 3 | Install | `npm ci` or `npm install` | non-zero exit |
| 4 | Build frontend | `npm run build` | Vite build fails |
| 5 | Build Docker | `docker build -t gacha-game:ci .` | Docker build fails |

### Check Result

| State | Meaning |
|-------|---------|
| success | All steps passed |
| failure | Any step failed |

Reported on GitHub commit/PR checks UI.

## Invariants

1. No deployment or image push steps.
2. No changes to game `src/` or persistence.
3. Same Dockerfile as Phase 3; CI only validates it builds.
