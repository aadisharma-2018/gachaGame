---
description: "Phase 6 implementation tasks — expanded card pool and session inventory"
---

# Tasks: Phase 6 Expanded Card Pool and Session Inventory

**Input**: [plan.md](./plan.md), [spec.md](./spec.md), [contracts/card-catalog.md](./contracts/card-catalog.md), [contracts/pull-flow.md](./contracts/pull-flow.md), [contracts/inventory-ui.md](./contracts/inventory-ui.md)  
**Branch**: `006-card-pool-inventory`

**Scope**: Frontend-only card catalog, specific-card pulls, same-page inventory. No persistence, backend, routing, image assets, Docker/CI changes (unless build breaks), or future phases.

**Note**: User request says “Phase 5”; repo **005** is automated tests—this is **Phase 6** (`006-card-pool-inventory`).

## Format

`- [ ] [TaskID] [Story?] Description — **File/area:** … — **Expected outcome:** …`

Tasks are **sequential**; complete in order.

---

## Phase 1: Setup — Inspect existing structure

**Purpose**: Understand current pull and state modules before changes (item 1).

- [x] T001 Review existing pull flow and session state — **File/area:** `src/pull.js`, `src/gameState.js`, `src/main.js`, `index.html` — **Expected outcome:** Confirmed `resolveRarity` / 90–10 odds, coin spend, `recordPull`, result `#result`, and DOM hooks; no persistence APIs in `src/`.

---

## Phase 2: Foundational — Static card catalog

**Purpose**: Define the 5-card pool (item 2).

- [x] T002 Create static card catalog with all 5 cards — **File/area:** `src/cards.js` — **Expected outcome:** Exports catalog matching [contracts/card-catalog.md](./contracts/card-catalog.md): Archer/Common/🏹, Swordsman/Common/⚔️, Protector/Common/🛡️, Mage/Rare/🪄, King/Rare/👑; includes Common/Rare pools and stable display order.

---

## Phase 3: User Story 1 — Specific card pulls and result UI (Priority: P1)

**Goal**: Pull returns a specific card; rarity odds unchanged; result shows emoji, name, rarity (items 3–5).

**Independent test**: Paid pulls show named cards with emojis; `resolveRarity` behavior unchanged; `npm test` rarity tests still pass.

- [x] T003 [US1] Add **`pickCardFromPool(rarity, randomValue)`** and **`rollCard()`** (rarity via `resolveRarity`, then uniform pool pick) — **File/area:** `src/pull.js` — **Expected outcome:** `rollCard()` returns full card object `{ id, name, rarity, emoji, label }`; **90% Common / 10% Rare** unchanged at rarity step; existing `resolveRarity` / `rollRarity` kept for Phase 5 tests.
- [x] T004 [US1] Wire paid pull to **`rollCard()`**; keep **`recordPull(card.rarity)`** for Common/Rare counters — **File/area:** `src/main.js` — **Expected outcome:** Successful pull uses specific card; blocked pull at 0 coins unchanged; counters still increment by rarity.
- [x] T005 [US1] Update result markup and **`renderResult(card)`** — **File/area:** `index.html`, `src/main.js`, `src/styles.css` — **Expected outcome:** After successful pull, `#result` shows **emoji**, **card name**, and **rarity**; rarity CSS classes applied; **Not enough coins.** unchanged when blocked.

**Checkpoint (MVP)**: Pulls show specific cards with emoji; odds step preserved.

---

## Phase 4: User Story 2 — Session inventory (Priority: P1)

**Goal**: In-memory counts, increment on pull, toggle panel, render all 5 cards (items 6–10).

**Independent test**: Pull → inventory quantity +1; toggle panel lists 5 cards with correct quantities; refresh resets to 0.

- [x] T006 [US2] Add in-memory inventory module — **File/area:** `src/inventory.js` — **Expected outcome:** All 5 card ids start at quantity **0**; exports `getQuantity(id)`, `addCard(id)`, `getInventory()` / render data, `resetInventory()`; no `localStorage` / `sessionStorage`.
- [x] T007 [US2] Increment pulled card inventory after successful pull — **File/area:** `src/main.js` — **Expected outcome:** `addCard(card.id)` runs only after successful paid pull; blocked pulls do not change inventory.
- [x] T008 [US2] Add **Inventory** button and hidden panel shell — **File/area:** `index.html` — **Expected outcome:** `#inventory-btn` and `#inventory-panel` on same page as **Pull**; panel hidden by default.
- [x] T009 [US2] Implement inventory toggle and **`renderInventory()`** — **File/area:** `src/main.js`, `src/styles.css` — **Expected outcome:** Button toggles panel show/hide; all **5** cards render with emoji, name, rarity, and **quantity owned**; re-renders after pulls when open.

---

## Phase 5: User Story 3 — Session reset and docs (Priority: P2)

**Goal**: Refresh resets inventory; README verification (items 11–12).

**Independent test**: Refresh clears inventory; README describes Phase 6 checks; coins/counters/timer still work.

- [x] T010 [US3] Extend **`resetGameState()`** to call **`resetInventory()`**; confirm no persistence — **File/area:** `src/gameState.js`, `src/inventory.js`, `src/` — **Expected outcome:** Test reset clears inventory; page refresh re-inits all counts to 0 via module load only; grep confirms no persistence APIs added.
- [x] T011 [US3] Update README with Phase 6 features and manual verification — **File/area:** `README.md` — **Expected outcome:** Documents specific-card pulls, inventory toggle, quantity tracking, refresh reset; optional note that Common/Rare counters remain.

---

## Phase 6: Polish — Build and test guard

**Purpose**: Confirm small diff; CI-compatible build.

- [x] T012 Verify **`npm test`**, **`npm run build`**, and **`npm run dev`**; no Docker/CI edits unless broken — **File/area:** `package.json`, `.github/workflows/ci.yml`, `src/` — **Expected outcome:** Tests pass (rarity tests unchanged); production build succeeds; Phase 6 limited to catalog, pull, inventory, UI, README—no backend, deploy, or persistence.

**Checkpoint**: Phase 6 complete. **Stop** — no Phase 7 features.

---

## Dependencies & execution order

```text
T001 → T002 → T003 → T004 → T005 → T006 → T007 → T008 → T009 → T010 → T011 → T012
```

| User story | Tasks |
|------------|-------|
| US1 — Specific card pulls + result UI | T003–T005 |
| US2 — Session inventory | T006–T009 |
| US3 — Reset + README | T010–T011 |

### Mapping to requested coverage

| # | Requirement | Task(s) |
|---|-------------|---------|
| 1 | Inspect pull logic and state | T001 |
| 2 | Static card data (5 cards) | T002 |
| 3 | Pull returns specific card object | T003–T004 |
| 4 | Preserve 90/10 rarity odds | T003 |
| 5 | Result: emoji, name, rarity | T005 |
| 6 | In-memory inventory counts | T006 |
| 7 | Increment on successful pull | T007 |
| 8 | Inventory button | T008 |
| 9 | Same-page toggle panel | T008–T009 |
| 10 | Render all 5 cards in panel | T009 |
| 11 | Refresh resets (no persistence) | T010 |
| 12 | README manual verification | T011 |
| — | Build/test guard | T012 |

### Out of scope (no tasks)

Persistence, localStorage, sessionStorage, backend, APIs, database, auth, routing, separate inventory page, external images, AWS, Kubernetes, deployment, future phases.

---

## Task summary

| Phase | Task IDs | Count |
|-------|----------|-------|
| Setup — Inspect | T001 | 1 |
| Foundational — Catalog | T002 | 1 |
| US1 — Pull + result | T003–T005 | 3 |
| US2 — Inventory | T006–T009 | 4 |
| US3 — Reset + README | T010–T011 | 2 |
| Polish | T012 | 1 |
| **Total** | **T001–T012** | **12** |

**MVP scope**: T001–T005 (specific card pulls with result UI).

**Parallel opportunities**: None — intentionally sequential.

**Format validation**: All tasks include Task ID, file/area, and expected outcome.
