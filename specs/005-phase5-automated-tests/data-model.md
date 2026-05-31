# Data Model: Phase 5 Test Targets

**Branch**: `005-phase5-automated-tests` | **Date**: 2026-05-19

Phase 5 documents **logic under test** and **test artifacts**—no new runtime persistence or backend entities.

## Modules under test

### Pull logic (`src/pull.js`)

| Function | Input | Output | Rule |
|----------|-------|--------|------|
| `resolveRarity(randomValue)` | number ∈ [0, 1) | `{ rarity, label }` | `randomValue < 0.1` → rare; else common |
| `rollRarity()` | (none; uses `Math.random()`) | `{ rarity, label }` | Delegates to `resolveRarity(Math.random())` |

**Labels**: `rarity: 'rare'` → `label: 'Rare'`; `rarity: 'common'` → `label: 'Common'`.

### Session state (`src/gameState.js`)

| Function | Effect |
|----------|--------|
| `getCoins()` | Returns current coin balance |
| `getCommonCount()` | Returns common pull count |
| `getRareCount()` | Returns rare pull count |
| `spendCoin()` | If coins ≥ 1: decrement by 1, return `true`; else return `false` |
| `addCoin()` | Increment coins by 1 |
| `recordPull(rarity)` | Increment `rareCount` if `'rare'`, else `commonCount` |
| `resetGameState()` | Set coins = **10**, commonCount = **0**, rareCount = **0** |

### Constants (unchanged)

| Name | Value |
|------|-------|
| `START_COINS` | 10 |
| Rare threshold | 0.1 (strict less-than for Rare) |

## State transitions (gameState)

```text
Initial (after resetGameState or page load):
  coins=10, commonCount=0, rareCount=0

spendCoin() success:
  coins -= 1

spendCoin() fail (coins < 1):
  no change

addCoin():
  coins += 1

recordPull('rare'):
  rareCount += 1

recordPull('common') or other non-'rare':
  commonCount += 1
```

## Test artifacts

| File | Covers |
|------|--------|
| `src/pull.test.js` | `resolveRarity` boundaries |
| `src/gameState.test.js` | spend, add, record, getters, reset |

## CI pipeline entity (updated)

| Order | Step | Command |
|-------|------|---------|
| 1 | Checkout | `actions/checkout@v4` |
| 2 | Setup Node | Node 20 |
| 3 | Install | `npm ci` / fallback |
| 4 | **Tests** | **`npm test`** |
| 5 | Build | `npm run build` |
| 6 | Docker | `docker build -t gacha-game:ci .` |

## Invariants

1. Production gameplay rules unchanged after refactors.
2. `resetGameState()` used in tests only (not wired in `main.js` for Phase 5).
3. Passive income timer remains in `main.js` and is not unit-tested.
4. No persistence APIs introduced.
