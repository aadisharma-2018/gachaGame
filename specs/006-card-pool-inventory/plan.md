# Implementation Plan: Phase 6 Expanded Card Pool and Session Inventory

**Branch**: `006-card-pool-inventory` | **Date**: 2026-05-31 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/006-card-pool-inventory/spec.md`

**Note**: Repo **Phase 6** (branch `006-card-pool-inventory`). User-facing “expanded card pool” follows automated-test Phase 5. Frontend-only; no persistence, routing, or infra changes.

## Summary

Add a **static 5-card catalog** (emoji visuals), extend **pull** to roll **90/10 rarity** then pick uniformly within the Common or Rare pool, show **emoji + name + rarity** on pull, track **in-memory inventory counts** per card, and add an **Inventory** toggle panel on the same page. Keep coins, timers, and Common/Rare session counters. Update **README** verification; extend **Vitest** only if `pickCardFromPool` helper is extracted (rarity tests unchanged).

## Technical Context

**Language/Version**: JavaScript (ES modules), Vite **6**  
**Primary Dependencies**: Existing vanilla JS modules; no new npm packages  
**Storage**: In-memory only (module-level state); no `localStorage` / `sessionStorage`  
**Testing**: Existing Vitest suite; optional tests for card-pool picker helper  
**Target Platform**: Browser (single-page app)  
**Project Type**: Frontend-only gacha SPA  
**Performance Goals**: Instant UI updates; no network  
**Constraints**: No persistence, backend, image files, Docker/CI edits unless build breaks  
**Scale/Scope**: ~3 new/edited modules, HTML/CSS touch, `main.js` wiring, README section

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Evidence |
|------|--------|----------|
| Simplicity | ✅ PASS | One catalog file, one inventory module, same-page panel |
| Infrastructure | ✅ PASS | No Docker/CI/AWS/backend changes |
| Abstractions | ✅ PASS | Flat modules; no framework |
| Local run | ✅ PASS | `npm run dev` unchanged entry |
| Phase boundary | ✅ PASS | Card pool + inventory only; no persistence |
| Pull prototype | ✅ PASS | Rarity step still 90/10 via existing `resolveRarity` |

**Post-design re-check**: All gates pass. Collection UI is explicit Phase 6 scope.

## Project Structure

### Documentation (this feature)

```text
specs/006-card-pool-inventory/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── card-catalog.md
│   ├── pull-flow.md
│   └── inventory-ui.md
└── tasks.md              # /speckit.tasks
```

### Source changes (implementation)

```text
src/
├── cards.js           # NEW — static catalog + pool picker helper
├── inventory.js       # NEW — per-card session quantities
├── pull.js            # EXTEND — rollCard(): rarity + specific card
├── pull.test.js       # OPTIONAL — pick-from-pool tests
├── gameState.js       # EXTEND — resetGameState() clears inventory
├── main.js            # EXTEND — pull result UI, inventory toggle/render
└── styles.css         # EXTEND — result layout, inventory panel

index.html             # EXTEND — Inventory button, panel container
README.md              # EXTEND — Phase 6 + manual verification

# Unchanged unless build breaks: Dockerfile, .github/workflows/ci.yml
```

---

## 1. Static card data (5 cards)

**New file: `src/cards.js`**

Export a fixed catalog and rarity pools:

| id | name | rarity | emoji |
|----|------|--------|-------|
| `archer` | Archer | common | 🏹 |
| `swordsman` | Swordsman | common | ⚔️ |
| `protector` | Protector | common | 🛡️ |
| `mage` | Mage | rare | 🪄 |
| `king` | King | rare | 👑 |

Suggested exports:

- `CARDS` — array of all 5 (stable display order for inventory)
- `COMMON_CARDS` / `RARE_CARDS` — filtered pools
- `pickCardFromPool(rarity, randomValue)` — pure helper: index `Math.floor(randomValue * pool.length)` (testable, no mock)

Card shape: `{ id, name, rarity, emoji, label }` where `label` is `'Common' | 'Rare'` for UI/counters.

See [contracts/card-catalog.md](./contracts/card-catalog.md).

---

## 2. Pull logic (rarity first, then card)

**Extend `src/pull.js`** — keep `resolveRarity` / `rollRarity` for Phase 5 tests.

Add **`rollCard()`**:

```text
1. resolveRarity(Math.random())  → common | rare
2. pickCardFromPool(rarity, Math.random())  → specific card
3. return card object
```

- Rarity odds unchanged: **90% Common / 10% Rare** (`< 0.1` → rare).
- Within pool: **uniform** (each Common ⅓ given Common; each Rare ½ given Rare).

`main.js` calls **`rollCard()`** instead of **`rollRarity()`** on successful paid pulls.

See [contracts/pull-flow.md](./contracts/pull-flow.md).

---

## 3. Result UI (emoji, name, rarity)

**`index.html`**: Structure result area for rich display (e.g. emoji span + name + rarity line), or keep `#result` and set `innerHTML` / child nodes from JS.

**`main.js`** after successful pull:

- Show **emoji** (large), **name**, **rarity label**
- Apply existing `.rarity-common` / `.rarity-rare` on result container from `card.rarity`

Blocked pull at 0 coins: still **Not enough coins.** — no card UI.

---

## 4. In-memory inventory state

**New file: `src/inventory.js`**

- Module-level `Map` or object keyed by card `id` → quantity (integer ≥ 0)
- Initialize all 5 ids to **0** on load
- `getQuantity(id)`, `addCard(id)` (+1), `getInventory()` (all cards with quantities)
- `resetInventory()` — all zeros (called from `resetGameState()` for tests)

No persistence APIs.

---

## 5. Increment inventory on successful pull

In **`main.js`** pull handler (after `spendCoin()` succeeds):

```text
const card = rollCard();
recordPull(card.rarity);      // keeps Common/Rare counters
addCardToInventory(card.id);  // inventory +1
renderResult(card);
renderStats();
renderInventory();            // if panel open, or always cheap re-render
```

Blocked pulls must not call inventory or `recordPull`.

---

## 6. Inventory button (same-page toggle)

**`index.html`**: Add `<button id="inventory-btn">Inventory</button>` beside **Pull**.

**`main.js`**:

- `let inventoryOpen = false`
- Click toggles `inventoryOpen`, shows/hides `#inventory-panel` (class `hidden` or `aria-hidden`)

---

## 7. Inventory panel rendering

**`index.html`**: `<section id="inventory-panel" hidden>` with list container.

**`main.js`** — `renderInventory()`:

- Loop `CARDS` in catalog order
- Each row: emoji, name, rarity, quantity (`× N` or `Qty: N`)
- Panel hidden by default; visible when toggled open

See [contracts/inventory-ui.md](./contracts/inventory-ui.md).

---

## 8. Reset on page refresh

- All state lives in module variables (`gameState.js`, `inventory.js`) — **refresh re-initializes modules** → coins **10**, counters **0**, inventory **0**
- Do **not** add `localStorage` / `sessionStorage`
- Extend **`resetGameState()`** to call **`resetInventory()`** so Vitest stays isolated

---

## 9. README manual verification

Add **Phase 6** feature bullet and checklist:

- Pull shows named card + emoji + rarity
- Inventory lists 5 cards with quantities
- Same card pulled twice → quantity 2
- Refresh resets inventory
- `npm test` still passes (rarity tests unchanged)
- Optional: `npm run dev` smoke

No Docker/CI doc changes unless build fails.

---

## Phase 5 test compatibility

| Module | Action |
|--------|--------|
| `resolveRarity` tests | **Keep unchanged** |
| `gameState` tests | Extend `resetGameState` to reset inventory if added |
| New tests (optional) | `pickCardFromPool('common', 0)` → first Common card, etc. |

CI: no workflow edits expected; run `npm test` after implementation.

---

## Complexity Tracking

No constitution violations.

| Addition | Justification |
|----------|---------------|
| `cards.js` | Single source of truth for 5-card catalog |
| `inventory.js` | Separates collection counts from coin counters |
| `pickCardFromPool` pure helper | Testable pool selection without mocking |

---

## Generated artifacts

| Artifact | Path |
|----------|------|
| Research | [research.md](./research.md) |
| Data model | [data-model.md](./data-model.md) |
| Card catalog contract | [contracts/card-catalog.md](./contracts/card-catalog.md) |
| Pull flow contract | [contracts/pull-flow.md](./contracts/pull-flow.md) |
| Inventory UI contract | [contracts/inventory-ui.md](./contracts/inventory-ui.md) |
| Quickstart | [quickstart.md](./quickstart.md) |

## Next steps

**`/speckit.tasks`** → **`/speckit.implement`**
