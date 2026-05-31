# Implementation Plan: Phase 5 Automated Tests for Game Logic

**Branch**: `005-phase5-automated-tests` | **Date**: 2026-05-19 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/005-phase5-automated-tests/spec.md`

**Note**: Phase 5 adds Vitest unit tests and a CI test step only—no gameplay, deploy, or backend changes.

## Summary

Add **Vitest** to the existing Vite app, unit-test **pull rarity** (`resolveRarity` threshold at **0.1**) and **session coin/counter** logic in `gameState.js`, expose **`npm test`** (`vitest run`), insert a **Run tests** step in **`.github/workflows/ci.yml`** before builds, and document local testing in **README**. Two minimal refactors: extract **`resolveRarity(value)`** in `pull.js` and add **`resetGameState()`** in `gameState.js`. **Do not mock `Math.random`**—tests pass deterministic numbers to the pure helper.

## Technical Context

**Language/Version**: JavaScript (ES modules), Node **20** (matches CI and Dockerfile)  
**Primary Dependencies**: Vite **6**, Vitest **^3** (dev), existing vanilla JS game modules  
**Storage**: N/A (in-memory session state only; unchanged)  
**Testing**: **Vitest** unit tests; `vitest run` for CI and local single-run  
**Target Platform**: Node test runner (Vitest); browser not required for Phase 5  
**Project Type**: Frontend-only Vite SPA with Phase 4 GitHub Actions CI  
**Performance Goals**: Full test suite completes in seconds on CI  
**Constraints**: No gameplay changes; no E2E; no timer tests; no coverage gates; refactors minimal  
**Scale/Scope**: ~2 test files, 2 small source edits, 1 CI step, README section

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Evidence |
|------|--------|----------|
| Simplicity | ✅ PASS | Vitest only; colocated unit tests; two tiny refactors |
| Infrastructure | ✅ PASS | Extends Phase 4 CI with one step; no AWS/K8s/deploy |
| Abstractions | ✅ PASS | Pure helper + reset export; no test framework wrappers |
| Local run | ✅ PASS | `npm test` documented; app still runs via `npm run dev` |
| Phase boundary | ✅ PASS | No new gameplay, persistence, backend, or E2E |
| Pull prototype | ✅ PASS | Odds unchanged; `rollRarity()` still uses `Math.random() < 0.1` |

**Post-design re-check**: All gates pass. Vitest is justified as the phase deliverable (automated verification).

## Project Structure

### Documentation (this feature)

```text
specs/005-phase5-automated-tests/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1 — test targets & state
├── quickstart.md        # Phase 1 — run tests locally & in CI
├── contracts/
│   ├── test-modules.md  # Unit test contract (pull + gameState)
│   └── ci-workflow.md   # Updated CI step order
└── tasks.md             # /speckit.tasks (not created here)
```

### Source code (repository root)

```text
src/
├── pull.js              # + resolveRarity(value); rollRarity() unchanged behavior
├── pull.test.js         # NEW — threshold boundary tests
├── gameState.js         # + resetGameState()
├── gameState.test.js    # NEW — spend, add, record, counters
├── main.js              # UNCHANGED
└── styles.css           # UNCHANGED

vite.config.js           # + test: { globals: false } (optional env)
package.json             # + vitest devDep, "test": "vitest run"
.github/workflows/ci.yml # + Run tests step after install
README.md                # + Tests section, update Phase 5 / CI bullets
```

**Structure Decision**: Colocate `*.test.js` next to modules under `src/` (minimal paths, no separate `tests/` tree for two files).

---

## 1. Add the test framework (Vitest)

### Install

From repo root:

```bash
npm install -D vitest
```

Vitest shares Vite’s ESM pipeline—no Jest, jsdom, or Playwright for Phase 5.

### Configure

**Option A (preferred)**: Extend existing `vite.config.js`:

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  test: {
    environment: 'node',
  },
});
```

Use `environment: 'node'` because unit tests target pure JS modules with no DOM. `main.js` is not imported in tests.

No separate `vitest.config.js` unless merge issues arise.

### Discover tests

Vitest finds `src/**/*.test.js` by default. No extra `include` needed for Phase 5.

---

## 2. npm scripts

Add to `package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

| Script | Purpose |
|--------|---------|
| **`npm test`** | Single run; non-zero exit on failure — **CI and README canonical command** |
| **`npm run test:watch`** | Optional local dev loop (not used in CI) |

Keep existing `dev`, `build`, `preview` unchanged.

---

## 3. Which logic to test first

**Priority order** (implement and land tests in this sequence):

| Order | Module | Why first |
|-------|--------|-----------|
| **1** | `pull.js` | Core gacha rule (90/10); pure after small extract; no shared mutable state |
| **2** | `gameState.js` | Coin/counter rules; already exported functions; needs `resetGameState()` for isolation |

**Not tested in Phase 5**:

- `main.js` — DOM, click handlers, `setInterval` passive income timer
- CSS / HTML
- Docker / nginx

---

## 4. Small refactors for testability

### `src/pull.js`

Extract a pure function; keep production entry point behavior identical:

```javascript
/** @param {number} randomValue — value in [0, 1), e.g. from Math.random() */
export function resolveRarity(randomValue) {
  const isRare = randomValue < 0.1;
  if (isRare) {
    return { rarity: 'rare', label: 'Rare' };
  }
  return { rarity: 'common', label: 'Common' };
}

export function rollRarity() {
  return resolveRarity(Math.random());
}
```

**Behavior invariant**: `randomValue < 0.1` → Rare; `>= 0.1` → Common (same as before).

### `src/gameState.js`

Add reset for test isolation (no effect on normal app load—only called from tests unless wired later):

```javascript
export function resetGameState() {
  coins = START_COINS;
  commonCount = 0;
  rareCount = 0;
}
```

**Do not** change `START_COINS`, spend rules, or counter logic.

### `src/main.js`

**No changes.** Still imports `rollRarity`, `spendCoin`, etc. Gameplay unchanged.

---

## 5. Controlling randomness (no `Math.random` mocking)

**Decision (from spec clarifications)**: Do **not** mock `Math.random` in tests.

| Approach | Phase 5 |
|----------|---------|
| Mock `Math.random` with `vi.spyOn` | ❌ Rejected — couples tests to global; clarifications chose pure helper |
| Inject random fn into `rollRarity` | ❌ Rejected — unnecessary API surface |
| **`resolveRarity(value)` with explicit inputs** | ✅ **Use this** |

### Test cases for `resolveRarity`

| Input | Expected |
|-------|----------|
| `0` | Rare |
| `0.09` | Rare |
| `0.099999` | Rare |
| **`0.1`** | **Common** (boundary) |
| `0.5` | Common |
| `0.99` | Common |

Optional smoke: `rollRarity()` returns object with `rarity` in `['common','rare']` and matching `label` (non-deterministic; no odds assertion).

---

## 6. Update GitHub Actions

Insert **after Install dependencies**, **before Build frontend** in `.github/workflows/ci.yml`:

```yaml
      - name: Run tests
        run: npm test
```

### Updated CI step order

1. Checkout  
2. Setup Node 20  
3. Install dependencies (`npm ci` / fallback)  
4. **Run tests** (`npm test`) ← **NEW**  
5. Build frontend (`npm run build`)  
6. Build Docker image  

**Failure behavior**: Failing tests fail the job; build/Docker steps do not run (GitHub Actions default for sequential steps).

Triggers unchanged: `pull_request` and `push` to **`main`**.

See [contracts/ci-workflow.md](./contracts/ci-workflow.md).

---

## 7. Update README

Add a **Tests** section (after **Build**, before **Docker** or within **Continuous Integration**):

- Command: **`npm test`**
- What it runs: unit tests for pull odds and coin/counter logic
- Optional: **`npm run test:watch`** for local development
- CI bullet: CI runs **`npm test`** before frontend and Docker builds
- Update **Current features** with **Phase 5 — Automated tests** one-liner
- Update CI section step list to include tests (four checks: install implicit, **test**, build, docker)

Manual verification checklist items for Phase 5 (in quickstart).

---

## Test file outline

### `src/pull.test.js`

- `resolveRarity(0.09)` → Rare  
- `resolveRarity(0.1)` → Common  
- `resolveRarity(0.5)` → Common  
- (optional) `rollRarity()` shape check  

### `src/gameState.test.js`

- `beforeEach(() => resetGameState())`  
- initial state: 10 coins, 0/0 counters  
- `spendCoin()` success/failure at 0 coins  
- `addCoin()` increments balance  
- `recordPull('common'|'rare')` increments correct counter  

---

## Complexity Tracking

No constitution violations requiring justification.

| Addition | Justification |
|----------|---------------|
| Vitest dev dependency | Phase 5 explicit deliverable; smallest Vite-native choice |
| `resolveRarity` extract | Enables deterministic tests without mocking globals |
| `resetGameState` export | Isolates module-level state between tests |

---

## Generated artifacts

| Artifact | Path |
|----------|------|
| Research | [research.md](./research.md) |
| Data model | [data-model.md](./data-model.md) |
| Test contract | [contracts/test-modules.md](./contracts/test-modules.md) |
| CI contract | [contracts/ci-workflow.md](./contracts/ci-workflow.md) |
| Quickstart | [quickstart.md](./quickstart.md) |

## Next steps

Run **`/speckit.tasks`** to break this plan into implementation tasks, then **`/speckit.implement`**.
