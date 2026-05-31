# CI Workflow Contract: Phase 5 (updated)

**Branch**: `005-phase5-automated-tests` | **Date**: 2026-05-19  
**Type**: GitHub Actions workflow contract (extends Phase 4)

Updates **`.github/workflows/ci.yml`**. Triggers and runner unchanged from Phase 4.

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

4. **Run tests** ← **NEW (Phase 5)**

   ```bash
   npm test
   ```

5. **Build frontend**

   ```bash
   npm run build
   ```

6. **Build Docker image**

   ```bash
   docker build -t gacha-game:ci .
   ```

## Success criteria

- Workflow completes with green check when all steps succeed.
- Workflow fails when **tests**, frontend build, **or** Docker build fails.

## Non-goals

- Separate `test:ci` script (use `npm test` only)
- Coverage upload, Codecov, or test reporting services
- E2E browser steps
- Deploy, `docker push`, secrets
