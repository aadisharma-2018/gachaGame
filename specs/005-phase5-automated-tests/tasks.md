---
description: "Phase 5 implementation tasks — Vitest unit tests and CI integration"
---

# Tasks: Phase 5 Automated Tests for Game Logic

**Input**: [plan.md](./plan.md), [spec.md](./spec.md), [contracts/test-modules.md](./contracts/test-modules.md), [contracts/ci-workflow.md](./contracts/ci-workflow.md)  
**Branch**: `005-phase5-automated-tests`

**Scope**: Automated unit tests and CI test step only. No gameplay changes, backend, database, persistence, AWS, Kubernetes, deployment, or E2E.

**Tests**: Vitest unit tests for `pull.js` and `gameState.js`; manual CI verification in README.

## Format

`- [ ] [TaskID] [Story?] Description — **File/area:** … — **Expected outcome:** …`

Tasks are **sequential**; complete in order.

---

## Phase 1: Setup — Vitest dependency and config

**Purpose**: Add test framework (items 1–2).

- [x] T001 Install **Vitest** as a dev dependency — **File/area:** `package.json`, `package-lock.json` — **Expected outcome:** `vitest` listed under `devDependencies`; lockfile updated; `npm install` succeeds.
- [x] T002 Add Vitest **`test`** block with `environment: 'node'` — **File/area:** `vite.config.js` — **Expected outcome:** Vitest runs in Node (no DOM); config valid for ESM project.

---

## Phase 2: Foundational — npm test script

**Purpose**: Expose canonical test command (item 2).

- [x] T003 Add **`"test": "vitest run"`** to scripts (optional **`"test:watch": "vitest"`**) — **File/area:** `package.json` — **Expected outcome:** `npm test` runs once and exits non-zero on failure; existing `dev`/`build`/`preview` unchanged.

---

## Phase 3: User Story 1 — Pull rarity tests (Priority: P1)

**Goal**: Deterministic tests for 90/10 pull logic at the **0.1** boundary (items 3–4, 6).

**Independent test**: `npm test` passes pull tests; `resolveRarity(0.09)` → Rare, `resolveRarity(0.1)` → Common.

- [x] T004 [US1] Extract **`resolveRarity(randomValue)`** pure helper; **`rollRarity()`** calls `resolveRarity(Math.random())` — **File/area:** `src/pull.js` — **Expected outcome:** Same production behavior (`< 0.1` → Rare); no changes to `src/main.js`; small refactor only.
- [x] T005 [US1] Add **`src/pull.test.js`** with boundary cases via **`resolveRarity`** (explicit inputs: `0`, `0.09`, `0.1`, `0.5`) — **File/area:** `src/pull.test.js` — **Expected outcome:** Rare below **0.1**; Common at **0.1** and above; **no `Math.random` mocking** (control randomness through the pure helper per spec clarifications).

**Checkpoint (MVP)**: `npm test` runs and pull logic tests pass.

---

## Phase 4: User Story 2 — Coin and counter tests (Priority: P1)

**Goal**: Unit tests for separable session-state logic (items 5–6).

**Independent test**: `npm test` passes gameState tests after pull tests.

- [x] T006 [US2] Export **`resetGameState()`** (coins **10**, counters **0**) — **File/area:** `src/gameState.js` — **Expected outcome:** Test isolation helper available; gameplay on page load unchanged (`main.js` does not require changes).
- [x] T007 [US2] Add **`src/gameState.test.js`**: `beforeEach(resetGameState)`; test spend, add, record, getters — **File/area:** `src/gameState.test.js` — **Expected outcome:** Covers start **10** coins, spend success/fail at **0**, `addCoin`, `recordPull('common'|'rare')` counters per [contracts/test-modules.md](./contracts/test-modules.md).

---

## Phase 5: User Story 3 — CI runs tests before builds (Priority: P1)

**Goal**: GitHub Actions runs **`npm test`** before builds (item 7).

**Independent test**: CI workflow lists **Run tests** after install, before **Build frontend**.

- [x] T008 [US3] Add **Run tests** step (`npm test`) after install, before **Build frontend** — **File/area:** `.github/workflows/ci.yml` — **Expected outcome:** Step order matches [contracts/ci-workflow.md](./contracts/ci-workflow.md); failing tests fail the workflow; triggers unchanged (PR + push to **main**).

---

## Phase 6: User Story 4 — README and manual verification (Priority: P2)

**Goal**: Document local tests and how to verify CI (items 8–9).

**Independent test**: README alone explains `npm test` and GitHub verification.

- [x] T009 [US4] Add **Tests** section: `npm test`, optional `npm run test:watch`, what modules are covered — **File/area:** `README.md` — **Expected outcome:** Developer can run tests from repo root without reading test files.
- [x] T010 [US4] Update **Current features** (Phase 5) and **CI** section to include **`npm test`** before build/Docker — **File/area:** `README.md` — **Expected outcome:** CI described as install → **test** → build → Docker; Phase 5 noted.
- [x] T011 [US4] Add **manual verification** checklist: local `npm test`, PR to **main**, Actions/Checks green, optional failing-test branch — **File/area:** `README.md` — **Expected outcome:** Steps to confirm CI test results on GitHub without reading YAML.

---

## Phase 7: Polish — Scope guard

**Purpose**: Confirm testing-only diff (no gameplay).

- [x] T012 Verify **`src/main.js`** unchanged; no deploy/E2E/coverage gates; full suite passes — **File/area:** `src/main.js`, `package.json`, `.github/workflows/ci.yml` — **Expected outcome:** Phase 5 adds tests + minimal refactors in `pull.js`/`gameState.js` only; `npm test`, `npm run dev`, and `npm run build` all succeed.

**Checkpoint**: Phase 5 complete. **Stop** — no Phase 6 features.

---

## Dependencies & execution order

```text
T001 → T002 → T003 → T004 → T005 → T006 → T007 → T008 → T009 → T010 → T011 → T012
```

| User story | Tasks |
|------------|-------|
| US1 — Pull rarity tests | T004–T005 |
| US2 — Coin/counter tests | T006–T007 |
| US3 — CI test step | T008 |
| US4 — README + verification | T009–T011 |

### Mapping to requested coverage

| # | Requirement | Task(s) |
|---|-------------|---------|
| 1 | Add Vitest dev dependency | T001 |
| 2 | Add test script | T003 |
| 3 | Tests for pull/rarity logic | T004–T005 |
| 4 | Control randomness in tests | T004–T005 (pure helper; no mock) |
| 5 | Coin/counter tests | T006–T007 |
| 6 | Small refactors for testability | T004, T006 |
| 7 | CI runs `npm test` before build | T008 |
| 8 | README local test instructions | T009–T010 |
| 9 | Manual CI verification steps | T011 |
| — | Scope guard | T012 |

### Out of scope (no tasks)

Backend, database, persistence, AWS, Kubernetes, deployment, new gameplay, E2E/browser tests, passive income timer tests, coverage thresholds.

---

## Task summary

| Phase | Task IDs | Count |
|-------|----------|-------|
| Setup | T001–T002 | 2 |
| Foundational | T003 | 1 |
| US1 — Pull tests | T004–T005 | 2 |
| US2 — gameState tests | T006–T007 | 2 |
| US3 — CI | T008 | 1 |
| US4 — README | T009–T011 | 3 |
| Polish | T012 | 1 |
| **Total** | **T001–T012** | **12** |

**MVP scope**: T001–T005 (Vitest + pull tests passing via `npm test`).

**Parallel opportunities**: None — tasks are intentionally sequential (shared files and dependencies).

**Format validation**: All tasks include Task ID, file/area, and expected outcome.
