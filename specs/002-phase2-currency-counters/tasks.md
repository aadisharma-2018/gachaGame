---
description: "Phase 2 implementation tasks — in-memory currency and session pull counters"
---

# Tasks: Phase 2 Currency and Pull Counters

**Input**: [spec.md](./spec.md) (plan.md optional; not required for this task list)  
**Builds on**: Phase 1 (`src/pull.js`, `src/main.js`, `index.html`, `src/styles.css`)  
**Branch**: `002-phase2-currency-counters`

**Scope**: Phase 2 only — in-memory session state. No `localStorage`, `sessionStorage`, backend, APIs, database, auth, inventory, Docker, K8s, AWS, CI/CD, or future phases.

**Tests**: Manual verification only (README checklist).

## Format

`- [ ] [TaskID] [Story?] Description — **File/area:** … — **Expected outcome:** …`

Tasks are **sequential**; complete in order.

---

## Phase 1: UI — Balance and counters on the page

**Purpose**: Add visible elements before wiring logic (items 1–2).

- [x] T001 Add a visible coin balance element (e.g. `#coin-balance`) to `index.html` — **File/area:** `index.html` — **Expected outcome:** Page shows current coins label (e.g. “Coins: 10”) in the game layout.
- [x] T002 Add visible Common and Rare session count elements (e.g. `#common-count`, `#rare-count`) to `index.html` — **File/area:** `index.html` — **Expected outcome:** Page shows separate Common and Rare pull totals starting at 0.

---

## Phase 2: Foundational — In-memory session state

**Purpose**: Centralize session data (item 3); refresh reset via load-time init (item 9).

- [x] T003 Create `src/gameState.js` with in-memory fields: `coins` (start **10**), `commonCount` (**0**), `rareCount` (**0**), and helpers to read/update them — **File/area:** `src/gameState.js` — **Expected outcome:** Module exports initial state and mutators; no `localStorage`, `sessionStorage`, or `fetch`.
- [x] T004 Add styles in `src/styles.css` for the stats row (coins + Common/Rare counts) — **File/area:** `src/styles.css` — **Expected outcome:** Balance and counters are readable and aligned with the existing clean layout.

---

## Phase 3: User Story 1 — Spend coins to pull (Priority: P1) 🎯 MVP

**Goal**: Pull costs 1 coin; block at 0 coins with a clear message (items 4–6).

**Independent test**: 10 coins → **Pull** → 9 coins + card → spend to 0 → **Pull** → “Not enough coins.” and no new card.

- [x] T005 [US1] Import `gameState` in `src/main.js` and render coin balance to `#coin-balance` on load and after changes — **File/area:** `src/main.js`, `#coin-balance` — **Expected outcome:** Opening the page shows **10** coins without refresh persistence.
- [x] T006 [US1] Update the **Pull** click handler: if `coins >= 1`, subtract **1** coin then call `rollRarity()` and update `#result` (keep 90/10 logic in `src/pull.js`) — **File/area:** `src/main.js` — **Expected outcome:** Each successful pull costs exactly 1 coin and still shows **Common** or **Rare**.
- [x] T007 [US1] When `coins === 0`, skip `rollRarity()` and set `#result` text to **Not enough coins.** (clear insufficient-funds message) — **File/area:** `src/main.js`, `#result` — **Expected outcome:** Zero-coin **Pull** does not change rarity classes for a new pull and does not deduct coins.

**Checkpoint (MVP)**: T001–T007 — currency gating works; counts UI present but may still show 0 until T008.

---

## Phase 4: User Story 3 — Session pull counts (Priority: P2)

**Goal**: Increment counters only on successful paid pulls (item 7).

**Independent test**: Paid Common pull → Common +1; paid Rare pull → Rare +1; blocked pull at 0 → counts unchanged.

- [x] T008 [US3] After a successful paid pull in `src/main.js`, increment `commonCount` or `rareCount` in `gameState` and render to `#common-count` / `#rare-count` — **File/area:** `src/main.js`, `src/gameState.js` — **Expected outcome:** Counts match successful pulls only; blocked pulls leave counts unchanged.

---

## Phase 5: User Story 2 — Passive coin income (Priority: P2)

**Goal**: +1 coin every 60 seconds while the page is open (item 8).

**Independent test**: At 0 coins, wait 60+ seconds → balance increases by 1 without refresh.

- [x] T009 [US2] Start a `setInterval` (60000 ms) in `src/main.js` that adds **1** coin via `gameState` and re-renders balance — **File/area:** `src/main.js` — **Expected outcome:** Balance grows by 1 per minute while the tab stays open; timer is not persisted across refresh.

---

## Phase 6: Polish — No persistence and README verification

**Purpose**: Confirm refresh reset (item 9) and document manual tests (item 10).

- [x] T010 Confirm `src/` uses no `localStorage`, `sessionStorage`, `indexedDB`, or backend `fetch` for coins/counts — **File/area:** `src/` — **Expected outcome:** Grep finds none; refresh restores coins **10**, counts **0**, placeholder result, new timer.
- [x] T011 Add a **Phase 2 manual verification** section to `README.md` (coins, pull cost, blocked pull message, counters, 60s income, refresh reset, Phase 1 odds unchanged) — **File/area:** `README.md` — **Expected outcome:** README lists step-by-step checks without requiring 50-pull statistics.
- [x] T012 Walk through the README Phase 2 checklist on the running app and fix any gaps — **File/area:** app + `README.md` — **Expected outcome:** All Phase 2 checks pass; stop—no Phase 3 features.

**Checkpoint**: Phase 2 complete.

---

## Dependencies & execution order

```text
T001 → T002 → T003 → T004 → T005 → T006 → T007 → T008 → T009 → T010 → T011 → T012
```

| User story | Tasks |
|------------|-------|
| US1 — Spend coins to pull | T005–T007 |
| US3 — Session pull counts | T008 |
| US2 — Passive income | T009 |

### MVP scope

**T001–T007** (7 tasks) — coin display, state module, paid/blocked pull behavior.

### Mapping to requested coverage

| # | Requirement | Task(s) |
|---|-------------|---------|
| 1 | Coin balance display | T001, T005 |
| 2 | Common/Rare count display | T002, T008 |
| 3 | In-memory state | T003 |
| 4 | Pull costs 1 coin | T006 |
| 5 | Prevent pull at 0 coins | T007 |
| 6 | “Not enough coins” message | T007 |
| 7 | Increment counts on success | T008 |
| 8 | +1 coin every 60s | T009 |
| 9 | Reset on refresh | T003, T010 |
| 10 | README verification | T011, T012 |

### Out of scope (no tasks)

`localStorage`, `sessionStorage`, backend, APIs, database, authentication, inventory UI, Docker, Kubernetes, AWS, CI/CD, future phases.

---

## Task summary

| Phase | Task IDs | Count |
|-------|----------|-------|
| UI | T001–T002 | 2 |
| Foundational | T003–T004 | 2 |
| US1 | T005–T007 | 3 |
| US3 | T008 | 1 |
| US2 | T009 | 1 |
| Polish | T010–T012 | 3 |
| **Total** | **T001–T012** | **12** |

**Format validation**: All tasks include Task ID, file/area, and expected outcome.
