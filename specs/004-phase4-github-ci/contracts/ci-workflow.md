# CI Workflow Contract: Phase 4

**Branch**: `004-phase4-github-ci` | **Date**: 2026-05-20  
**Type**: GitHub Actions workflow contract

Implementations MUST match this contract in `.github/workflows/ci.yml`.

## Triggers

```yaml
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
```

## Environment

| Setting | Value |
|---------|--------|
| Runner | `ubuntu-latest` |
| Node | **20** |
| Working directory | Repository root |

## Required steps (in order)

1. **Checkout** — `actions/checkout@v4`
2. **Setup Node** — `actions/setup-node@v4` with `node-version: '20'`, `cache: 'npm'`
3. **Install dependencies**

   ```bash
   if [ -f package-lock.json ]; then npm ci; else npm install; fi
   ```

4. **Build frontend**

   ```bash
   npm run build
   ```

5. **Build Docker image**

   ```bash
   docker build -t gacha-game:ci .
   ```

## Success criteria

- Workflow completes with green check when all steps succeed.
- Workflow fails (red X) when frontend build OR Docker build fails.

## Non-goals

- `docker push`, GHCR, ECR, deployment
- AWS, Kubernetes, Docker Compose
- Unit/e2e test steps (future phase)
- Repository secrets (Phase 4)
