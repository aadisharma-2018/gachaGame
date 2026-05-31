# Quickstart: Phase 5 Automated Tests

**Branch**: `005-phase5-automated-tests` | **Date**: 2026-05-19

## Prerequisites

- Node **20+** (matches CI)
- Phases 1–4 complete (`npm run dev`, `npm run build`, CI workflow present)

## After implementation

### Install (includes Vitest)

```bash
npm install
```

### Run tests locally

```bash
npm test
```

Expected: all unit tests pass; exit code **0**.

Optional watch mode (local dev only):

```bash
npm run test:watch
```

### Mirror full CI locally

```bash
npm ci
npm test
npm run build
docker build -t gacha-game:ci .
```

## What gets tested

| Module | Tests |
|--------|-------|
| `pull.js` | `resolveRarity` at 0.1 boundary (Rare below, Common at/above) |
| `gameState.js` | spend, add, record, counters; reset between cases |

**Not tested**: UI clicks, passive income timer (`main.js`).

## Verify on GitHub

1. Push branch and open PR to **main**.
2. **Actions** / **Checks** → **CI** workflow.
3. Confirm **Run tests** step passes before **Build frontend**.
4. Break a test intentionally on a scratch branch → CI should fail at test step.

## Manual verification checklist

- [ ] `npm test` passes locally
- [ ] `resolveRarity(0.09)` → Rare, `resolveRarity(0.1)` → Common (via tests)
- [ ] `spendCoin()` at 0 coins returns false (via tests)
- [ ] CI runs `npm test` after install, before build
- [ ] README documents `npm test` and CI test step
- [ ] `npm run dev` and gameplay unchanged (manual smoke)
- [ ] No deploy, E2E, or coverage gates added

## Troubleshooting

| Issue | Action |
|-------|--------|
| `vitest: command not found` | Run `npm install`; use `npm test` not bare `vitest` |
| Tests fail in random order | Ensure `resetGameState()` in `beforeEach` |
| CI fails on test step | Reproduce with `npm ci && npm test` locally |
| Import errors in tests | Confirm `type: "module"` in `package.json` |

## What's next

`/speckit.tasks` → `/speckit.implement` to add Vitest, tests, CI step, and README.
