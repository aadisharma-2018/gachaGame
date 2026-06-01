# Persistence API Contract: Phase 7

**Branch**: `007-localstorage-persistence` | **Date**: 2026-05-31  
**Module**: `src/persistence.js`

## Constants

| Name | Value |
|------|-------|
| `STORAGE_KEY` | `gachaGameState` |
| `SCHEMA_VERSION` | `1` |

## Functions

### `getDefaultGameState()`

Returns a new default snapshot object (see [saved-state-schema.md](./saved-state-schema.md)).

### `validateSavedState(data)`

- **Input**: parsed JSON (any)
- **Output**: valid snapshot object, or **`null`** if invalid

### `loadSavedState()`

1. `localStorage.getItem(STORAGE_KEY)`
2. If missing → `null`
3. `JSON.parse` (try/catch → `null` on failure)
4. `validateSavedState(parsed)` → snapshot or `null`

### `saveGameState(snapshot)`

1. Validate snapshot (or trust `collectGameState` output)
2. `localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))`

### `clearSavedState()`

`localStorage.removeItem(STORAGE_KEY)`

### `collectGameState(lastPullId)`

Build snapshot from current `gameState` + `inventory` getters and `lastPullId`.

### `applyGameState(snapshot)`

1. Hydrate `gameState` (coins, counters)
2. Hydrate `inventory` (all five counts)
3. Return **Card** object for `lastPull` id via catalog lookup, or **`null`**

## Save triggers (integration)

| Event | Caller |
|-------|--------|
| Successful pull | `main.js` |
| Passive +1 coin | `main.js` |
| Reset progress | `main.js` (after clear + defaults) |

## UI

| Element | id | Action |
|---------|-----|--------|
| Reset Progress | `reset-btn` | clear + defaults + re-render |

## Testing

- Mock `localStorage` in Vitest for load/save/clear
- Pure tests for `validateSavedState` and `getDefaultGameState`
