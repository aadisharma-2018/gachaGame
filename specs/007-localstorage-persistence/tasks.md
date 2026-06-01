---
description: "Phase 7 implementation tasks — localStorage persistence"
---

# Tasks: Phase 7 localStorage Persistence

**Input**: [plan.md](./plan.md), [spec.md](./spec.md), [contracts/saved-state-schema.md](./contracts/saved-state-schema.md), [contracts/persistence-api.md](./contracts/persistence-api.md)  
**Branch**: `007-localstorage-persistence`

**Scope**: **localStorage** persistence and **Reset Progress** only. No backend, sessionStorage, IndexedDB, cookies, deploy/AWS/K8s changes, or new gameplay.

## Format

`- [x] [TaskID] [Story?] Description — **File/area:** … — **Expected outcome:** …`

Tasks are **sequential**; complete in order.

---

## Phase 1: Setup — Inspect persistable state

**Purpose**: Map in-memory fields to snapshot (item 1).

- [x] T001 Document persistable vs non-persistable state — **File/area:** `src/gameState.js`, `src/inventory.js`, `src/main.js` — **Expected outcome:** Persist list confirmed: **coins**, **Common/Rare counters**, **5 inventory counts**, **last pulled card**; non-persist: passive timer countdown, inventory panel open; only **`localStorage`** (no sessionStorage).

---

## Phase 2: Foundational — Default state and persistence module

**Purpose**: Default snapshot, storage key, helpers (items 2–4).

- [x] T002 Define **`getDefaultGameState()`** snapshot (`version: 1`, coins **10**, counters **0**, all inventory **0**, `lastPull: null`) — **File/area:** `src/persistence.js` — **Expected outcome:** Matches [contracts/saved-state-schema.md](./contracts/saved-state-schema.md); deep-copy factory for reset/load fallback.

- [x] T003 Add **`STORAGE_KEY = 'gachaGameState'`** constant — **File/area:** `src/persistence.js` — **Expected outcome:** Single key exported/used by all persistence helpers.

- [x] T004 Implement persistence helpers: **`loadGameState`**, **`saveGameState`**, **`clearGameState`**, **`validateGameState`**, plus **`collectGameState(lastPullId)`** and **`applyGameState(snapshot)`** — **File/area:** `src/persistence.js` — **Expected outcome:** Load parses JSON and validates; save writes string; clear removes key; invalid/incomplete data returns null from validate; apply hydrates modules (see T005).

- [x] T005 Add hydrate/load setters on state modules — **File/area:** `src/gameState.js`, `src/inventory.js` — **Expected outcome:** Can set coins, Common/Rare counts, and all five inventory quantities from snapshot; **`resetGameState()`** still works for existing unit tests.

---

## Phase 3: User Story 1 — Load on startup (Priority: P1)

**Goal**: Restore valid saves; default when missing or invalid (items 5–7).

**Independent test**: Refresh after playing restores state; corrupt/missing key loads defaults.

- [x] T006 [US1] On app startup, call **`loadGameState()`** and **`applyGameState`** when valid — **File/area:** `src/main.js` — **Expected outcome:** Before first render loop, valid save restores coins, inventory, counters; **`renderResult`** runs if **`lastPull`** card id resolves from catalog.

- [x] T007 [US1] If **`loadGameState()`** returns null (no saved data), apply **`getDefaultGameState()`** — **File/area:** `src/main.js` — **Expected outcome:** First visit shows **10** coins, zero inventory/counters, placeholder **Pull to reveal a card**.

- [x] T008 [US1] If saved JSON is invalid or fails **`validateGameState`**, ignore and apply defaults — **File/area:** `src/persistence.js`, `src/main.js` — **Expected outcome:** Corrupt storage never breaks load; game playable with default state.

---

## Phase 4: User Story 2 — Auto-save on state changes (Priority: P1)

**Goal**: Persist after pulls and passive coins (items 8–10).

**Independent test**: Pull and wait for passive coin; refresh shows updated values.

- [x] T009 [US2] After every **successful pull**, call **`saveGameState(collectGameState(lastPullId))`** — **File/area:** `src/main.js` — **Expected outcome:** Saved snapshot includes updated coins, inventory, Common/Rare counters, and **lastPull**; blocked pull at 0 coins does not save.

- [x] T010 [US2] When passive timer grants **+1** coin, call **`saveGameState`** — **File/area:** `src/main.js` — **Expected outcome:** Coin balance persists across refresh after passive income; timer countdown may reset on load (not persisted).

- [x] T011 [US2] Confirm **`collectGameState`** includes inventory counts and pull counters — **File/area:** `src/persistence.js` — **Expected outcome:** One collect covers all five card quantities and **`commonCount`** / **`rareCount`**; no separate save path needed beyond T009–T010.

---

## Phase 5: User Story 3 — Reset Progress (Priority: P1)

**Goal**: Clear storage and restore defaults (items 11–12).

**Independent test**: Play → Reset → refresh stays at defaults; storage key removed.

- [x] T012 [US3] Add **Reset Progress** button to UI — **File/area:** `index.html`, `src/styles.css` — **Expected outcome:** **`#reset-btn`** visible on same page; accessible label **Reset Progress**.

- [x] T013 [US3] Wire reset: **`clearGameState()`**, apply defaults, clear last-pull UI, re-render — **File/area:** `src/main.js` — **Expected outcome:** In-memory and UI return to default; **`localStorage`** key cleared; refresh does not restore old progress.

---

## Phase 6: User Story 4 — Tests and docs (Priority: P2)

**Goal**: Helper tests, README, CI guard (items 13–15).

**Independent test**: `npm test` and build pass; README explains persistence.

- [x] T014 [US4] Add **`src/persistence.test.js`** for **`validateGameState`**, defaults, load/save/clear with mock storage — **File/area:** `src/persistence.test.js` — **Expected outcome:** Vitest passes in CI without real browser; existing pull/gameState tests still pass.

- [x] T015 [US4] Update README with Phase 7 persistence docs — **File/area:** `README.md` — **Expected outcome:** Explains **`gachaGameState`**, refresh verification, Reset Progress, origin/port note, clearing site data removes progress.

---

## Phase 7: Polish — CI and Docker guard

**Purpose**: Confirm no regressions (item 15).

- [x] T016 Verify **`npm test`**, **`npm run build`**, and Docker build; no CI workflow edits unless broken — **File/area:** `package.json`, `.github/workflows/ci.yml`, `Dockerfile` — **Expected outcome:** GitHub Actions steps still pass; no backend/sessionStorage/IndexedDB added under **`src/`**.

**Checkpoint**: Phase 7 complete. **Stop** — no Phase 8 features.

---

## Dependencies & execution order

```text
T001 → T002 → T003 → T004 → T005 → T006 → T007 → T008 → T009 → T010 → T011 → T012 → T013 → T014 → T015 → T016
```

| User story | Tasks |
|------------|-------|
| US1 — Load / fallback | T006–T008 |
| US2 — Auto-save | T009–T011 |
| US3 — Reset Progress | T012–T013 |
| US4 — Tests + README + CI | T014–T016 |

### Mapping to requested coverage

| # | Requirement | Task(s) |
|---|-------------|---------|
| 1 | Inspect persistable state | T001 |
| 2 | Default game state object | T002 |
| 3 | Storage key `gachaGameState` | T003 |
| 4 | load/save/clear/validate helpers | T004 |
| 5 | Load on startup if valid | T006 |
| 6 | Fallback if no save | T007 |
| 7 | Fallback if invalid | T008 |
| 8 | Save after successful pull | T009 |
| 9 | Save after passive coin | T010 |
| 10 | Save inventory + pull counts | T009, T011 |
| 11 | Reset Progress button | T012 |
| 12 | Wire reset clear + UI | T013 |
| 13 | Persistence tests | T014 |
| 14 | README | T015 |
| 15 | Docker/CI still pass | T016 |

### Out of scope (no tasks)

Backend, APIs, database, auth, cookies, sessionStorage, IndexedDB, AWS, Kubernetes, deployment, new gameplay, major rewrite.

---

## Task summary

| Phase | Task IDs | Count |
|-------|----------|-------|
| Setup | T001 | 1 |
| Foundational | T002–T005 | 4 |
| US1 — Load | T006–T008 | 3 |
| US2 — Save | T009–T011 | 3 |
| US3 — Reset | T012–T013 | 2 |
| US4 — Tests/docs | T014–T015 | 2 |
| Polish | T016 | 1 |
| **Total** | **T001–T016** | **16** |

**MVP scope**: T001–T008 (load/save helpers + startup restore).

**Parallel opportunities**: None — intentionally sequential.

**Format validation**: All tasks include Task ID, file/area, and expected outcome.
