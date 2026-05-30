# Quickstart: Phase 4 GitHub Actions CI

**Branch**: `004-phase4-github-ci` | **Date**: 2026-05-20

## Prerequisites

- Repository on GitHub with Actions enabled
- Default branch **main**
- Phase 3 Dockerfile present at repo root

## After implementation

Workflow file: **`.github/workflows/ci.yml`**

## Verify locally (before push)

Mirror CI steps on your machine:

```bash
npm ci
npm run build
docker build -t gacha-game:ci .
```

All three must succeed.

## Verify on GitHub

### Option A: Pull request

1. Push branch `004-phase4-github-ci` (or feature branch with CI file).
2. Open PR targeting **main**.
3. Open **Checks** tab → **CI** workflow should run.
4. Confirm green check when builds pass.

### Option B: Push to main

1. Merge CI workflow to **main**.
2. Push triggers CI on the commit.
3. View **Actions** tab → latest **CI** run.

## Manual verification checklist

- [ ] Workflow triggers on PR to **main**
- [ ] Workflow triggers on push to **main**
- [ ] Failed `npm run build` causes CI failure (optional test branch)
- [ ] Failed `docker build` causes CI failure (optional test branch)
- [ ] README CI section describes triggers and three checks
- [ ] No deploy or `docker push` steps in workflow
- [ ] `src/` game files unchanged

## Troubleshooting

| Issue | Action |
|-------|--------|
| CI not running | Confirm file is `.github/workflows/ci.yml` on default branch or PR branch |
| `npm ci` fails | Ensure `package-lock.json` committed and in sync |
| Docker step fails | Reproduce locally with `docker build -t gacha-game:ci .` |
| Actions disabled | Enable in repo **Settings → Actions** |

## What’s next

`/speckit.tasks` → `/speckit.implement` to add workflow and README section.
