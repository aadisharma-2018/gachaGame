# Research: Phase 5 Automated Tests

**Branch**: `005-phase5-automated-tests` | **Date**: 2026-05-19

## R-001: Test framework

**Decision**: **Vitest** (`vitest` dev dependency, Vite 6 project).

**Rationale**: Native Vite/ESM support; zero config for small JS modules; `vitest run` fits CI; user and spec clarifications prefer Vitest.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Jest | Extra ESM/transform config for Vite project |
| Node `node:test` | Weaker DX; no shared Vite config |
| Playwright/Cypress | E2E out of scope; overkill for unit logic |

## R-002: Test environment

**Decision**: Vitest **`environment: 'node'`** in `vite.config.js`.

**Rationale**: Tests import `pull.js` and `gameState.js` only—no DOM, no `document`, no `main.js`. Avoids jsdom dependency.

## R-003: Randomness strategy

**Decision**: **Pure `resolveRarity(randomValue)` helper**; tests pass explicit numbers; **`rollRarity()`** calls `Math.random()` in production.

**Rationale**: Spec clarification Q2; deterministic boundary tests at **0.1** without `vi.spyOn(Math, 'random')`.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Mock `Math.random` | Clarification chose pure helper |
| Dependency injection on `rollRarity` | Extra API for one call site |

## R-004: Session state isolation

**Decision**: Export **`resetGameState()`** from `gameState.js`; call in `beforeEach`.

**Rationale**: Module-level `let` variables persist across tests; reset is clearer than `vi.resetModules()`.

## R-005: Test file layout

**Decision**: Colocate **`src/*.test.js`** next to source modules.

**Rationale**: Two modules, two test files—simplest navigation; Vitest default glob picks them up.

## R-006: npm test command

**Decision**: **`"test": "vitest run"`** — same locally and in CI.

**Rationale**: Clarification Q5; non-watch exit code for GitHub Actions.

Optional **`test:watch`** for local only—not in CI.

## R-007: CI integration

**Decision**: Add **`npm test`** step after install, before **`npm run build`**, in existing `.github/workflows/ci.yml`.

**Rationale**: Fail fast on logic regressions before slower build/Docker steps; FR-007.

## R-008: Out of scope confirmation

**Decision**: No tests for `main.js` timer, no coverage thresholds, no E2E.

**Rationale**: Spec explicitly excludes passive income automation and major rewrites.

## Resolved clarifications

All five clarification answers from spec session 2026-05-19 are incorporated. No `NEEDS CLARIFICATION` items remain.
