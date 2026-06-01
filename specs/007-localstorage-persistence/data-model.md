# Data Model: Phase 7 Saved Game State

**Branch**: `007-localstorage-persistence` | **Date**: 2026-05-31

## Runtime modules (pre-persistence)

| Module | Fields |
|--------|--------|
| `gameState.js` | `coins`, `commonCount`, `rareCount` |
| `inventory.js` | `quantities[cardId]` × 5 |
| `main.js` | `lastPullCard`, `nextCoinAt`, `inventoryOpen` |

## Persisted snapshot (`gachaGameState`)

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `version` | number | `1` | Schema version |
| `coins` | integer ≥ 0 | `10` | |
| `commonCount` | integer ≥ 0 | `0` | |
| `rareCount` | integer ≥ 0 | `0` | |
| `inventory` | object | all `0` | Keys: archer, swordsman, protector, mage, king |
| `lastPull` | string \| null | `null` | Card id from catalog |

## Default state

Equivalent to Phase 6 new session: 10 coins, zero inventory/counters, no last pull, placeholder result message.

## Lifecycle

### Load (app start)

```text
read localStorage → parse → validate
  valid   → applyGameState → render UI + last pull
  invalid → applyGameState(defaults) → render UI
```

### Save

```text
collectGameState(lastPullId) → JSON.stringify → localStorage.setItem
```

Triggers: successful pull, passive coin +1, (after reset: clear only).

### Reset progress

```text
clearSavedState → applyGameState(defaults) → render UI
```

## Validation failures → defaults

- Missing key or null parse
- Invalid JSON
- Wrong `version`
- Missing/invalid `inventory` keys
- Negative or non-integer counts
- Unknown `lastPull` id

## Invariants

1. Only **`gachaGameState`** key used.
2. Gameplay rules unchanged; persistence is overlay.
3. Origin-scoped (localhost port matters).
