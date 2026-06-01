# Implementation Plan: Phase 7 localStorage Persistence

**Branch**: `007-localstorage-persistence` | **Date**: 2026-05-31 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/007-localstorage-persistence/spec.md`

**Note**: Phase 7 adds **localStorage** only—no backend, sessionStorage, IndexedDB, or deploy changes.

## Summary

Introduce **`src/persistence.js`** with a single key **`gachaGameState`**, default snapshot, validate/load/save/clear helpers, and hydrate/serialize hooks into **`gameState.js`** and **`inventory.js`**. On startup **`main.js`** restores valid saves or defaults; saves after successful pull, passive coin grant, and reset. Add **Reset Progress** button. Optional **`persistence.test.js`** with in-memory storage mock. Update **README**.

## Technical Context

**Language/Version**: JavaScript (ES modules), Vite **6**  
**Primary Dependencies**: Browser **`localStorage`**; existing game modules  
**Storage**: **`localStorage`** key **`gachaGameState`** (JSON string)  
**Testing**: Vitest; pure validate/serialize tests + mock storage (no real browser in CI)  
**Target Platform**: Browser (same origin for dev and Docker)  
**Project Type**: Frontend-only SPA  
**Constraints**: One storage key; invalid save → defaults; gameplay rules unchanged  
**Scale/Scope**: ~1 new module, small extensions to 3 modules, HTML button, README, tests

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Evidence |
|------|--------|----------|
| Simplicity | ✅ PASS | One module, one key, JSON snapshot |
| Infrastructure | ✅ PASS | No backend/deploy; localStorage only |
| Abstractions | ✅ PASS | Thin persistence layer; modules keep logic |
| Local run | ✅ PASS | Works on `npm run dev` and Docker same origin |
| Phase boundary | ✅ PASS | Persistence + reset only |
| Pull prototype | ✅ PASS | Odds/costs unchanged |

**Post-design re-check**: Phase 7 explicitly overrides earlier “no persistence” for this phase only.

## Project Structure

### Documentation

```text
specs/007-localstorage-persistence/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── saved-state-schema.md
│   └── persistence-api.md
└── tasks.md
```

### Source changes

```text
src/
├── persistence.js       # NEW — load, validate, save, clear, defaults
├── persistence.test.js  # NEW — validate + round-trip (mock storage)
├── gameState.js         # + setters / loadSnapshot for hydrate
├── inventory.js         # + loadInventory(counts)
├── main.js              # boot restore, save triggers, lastPull, reset btn
└── styles.css           # optional Reset button style

index.html               # Reset Progress button
README.md                # persistence docs
```

---

## 1. Current in-memory state (identify)

| State | Location today | Persist? |
|-------|----------------|----------|
| **Coins** | `gameState.js` (`coins`, default **10**) | ✅ Yes |
| **Common counter** | `gameState.js` (`commonCount`) | ✅ Yes |
| **Rare counter** | `gameState.js` (`rareCount`) | ✅ Yes |
| **Inventory counts** | `inventory.js` (5 card ids → qty) | ✅ Yes |
| **Last pulled card** | Not stored (UI only in `#result`) | ✅ Yes — add `lastPull` (card `id` or null) |
| **Result display** | `#result` text/HTML | ✅ Restore via `lastPull` → `renderResult(card)` |
| **Passive timer** | `main.js` (`nextCoinAt`) | ❌ No — reset countdown on load; coins saved on grant |
| **Inventory panel open** | `main.js` (`inventoryOpen`) | ❌ No — closed on load |

**Not persisted:** timer countdown, inventory toggle, undiscovered **???** is derived from quantity **0**.

---

## 2. Default game state object

Canonical defaults (matches new-session today):

```javascript
{
  version: 1,
  coins: 10,
  commonCount: 0,
  rareCount: 0,
  inventory: {
    archer: 0,
    swordsman: 0,
    protector: 0,
    mage: 0,
    king: 0,
  },
  lastPull: null,  // no successful pull yet
}
```

Placeholder result text on default load: **"Pull to reveal a card"**.

Export **`getDefaultGameState()`** from `persistence.js` (returns a deep copy).

---

## 3. localStorage key

```text
gachaGameState
```

Single JSON string: `JSON.stringify(snapshot)`.

---

## 4. Helper functions (`src/persistence.js`)

| Function | Role |
|----------|------|
| **`getDefaultGameState()`** | Factory default snapshot |
| **`validateSavedState(data)`** | Return valid snapshot or `null` if invalid/incomplete |
| **`loadSavedState()`** | Read key → parse JSON → `validateSavedState` |
| **`saveGameState(snapshot)`** | Write JSON to `gachaGameState` |
| **`clearSavedState()`** | `localStorage.removeItem('gachaGameState')` |
| **`collectGameState(lastPullId)`** | Build snapshot from current modules + last pull |
| **`applyGameState(snapshot)`** | Hydrate `gameState` + `inventory`; return card for `lastPull` or null |

**Validation rules (minimum):**

- `version === 1`
- `coins` non-negative integer
- `commonCount`, `rareCount` non-negative integers
- `inventory` has all **5** known card ids with non-negative integers
- `lastPull` is `null` or a valid card id in catalog

Invalid JSON, wrong types, missing keys → treat as **`null`** → defaults.

**Testability:** `validateSavedState` and default factory are pure; tests use a **mock storage** object passed or global stub for load/save/clear.

See [contracts/persistence-api.md](./contracts/persistence-api.md).

---

## 5. Load on app start

In **`main.js`** (before render loop):

```text
1. saved = loadSavedState()
2. if saved → applyGameState(saved); restore lastPull UI if present
3. else → applyGameState(getDefaultGameState())
4. renderStats(); renderCoinTimer(); renderInventory()
```

Timer starts fresh (**1:00**); coin balance comes from saved data.

---

## 6. Save triggers

Call **`saveGameState(collectGameState(lastPullId))`** after:

| Event | Location |
|-------|----------|
| Successful paid pull | `main.js` pull handler (after inventory update) |
| Passive coin grant | `main.js` `setInterval` (+1 coin) |
| Reset progress | reset handler (save defaults **or** clear then defaults) |

**Note:** Successful pull already updates coins, inventory, counters, and last pull—**one save** at end of handler covers “inventory updates” and “coin changes” for that action. Passive grant saves separately.

Blocked pull at 0 coins: **no save** (no state change).

---

## 7. Reset Progress button

**`index.html`:** `<button id="reset-btn" type="button">Reset Progress</button>`

**`main.js`:**

```text
1. clearSavedState()
2. applyGameState(getDefaultGameState())
3. lastPull = null; result placeholder; inventory panel closed
4. saveGameState(defaults) OR leave cleared — prefer clear + in-memory defaults (refresh stays default)
5. re-render UI
```

Optional confirm dialog — **skip** for simplicity unless spec requires (not required).

---

## 8. Module extensions

### `gameState.js`

Add hydrate setters (minimal):

- `setCoins(n)`, `setCommonCount(n)`, `setRareCount(n)`  
- Or single **`loadGameState({ coins, commonCount, rareCount })`**

Keep **`resetGameState()`** for tests; call from **`applyGameState(defaults)`** path.

### `inventory.js`

Add **`loadInventory(counts)`** — set all five quantities from snapshot.

### `main.js`

Track **`lastPullCard`** (full card object or id) for collect/restore.

---

## 9. Tests (if practical)

**`src/persistence.test.js`** (Vitest, Node):

- `validateSavedState` accepts valid snapshot
- rejects missing inventory keys, bad types, unknown `lastPull` id
- `getDefaultGameState` shape
- round-trip: `apply` after `collect` with mocked module state (or test validate + default only if hydrate needs DOM)

Mock **`localStorage`**:

```javascript
const mock = { store: {}, getItem(k) { return this.store[k] ?? null; }, ... };
```

Existing **`pull.test.js`** / **`gameState.test.js`** unchanged; **`resetGameState`** may call **`clearSavedState`** only in persistence reset path, not in unit test reset.

---

## 10. README updates

Add **Phase 7 — localStorage persistence** section:

- What persists (coins, inventory, counters, last pull)
- Key name **`gachaGameState`**
- Verify: play → refresh → state matches
- **Reset Progress** button
- Clearing browser site data removes progress
- Storage is per **origin** (e.g. `http://localhost:5173` vs `http://localhost:8080` are separate)

---

## Complexity Tracking

| Change | Justification |
|--------|---------------|
| `persistence.js` | Single place for key, schema, validate |
| Hydrate setters | Avoid rewriting gameState/inventory internals |
| `version: 1` | Forward-compatible validation |

No constitution violations.

---

## Generated artifacts

| Artifact | Path |
|----------|------|
| Research | [research.md](./research.md) |
| Data model | [data-model.md](./data-model.md) |
| Saved state schema | [contracts/saved-state-schema.md](./contracts/saved-state-schema.md) |
| Persistence API | [contracts/persistence-api.md](./contracts/persistence-api.md) |
| Quickstart | [quickstart.md](./quickstart.md) |

## Next steps

**`/speckit.tasks`** → **`/speckit.implement`**
