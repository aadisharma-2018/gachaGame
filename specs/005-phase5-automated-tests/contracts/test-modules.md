# Unit Test Contract: Phase 5

**Branch**: `005-phase5-automated-tests` | **Date**: 2026-05-19  
**Type**: Vitest unit test contract

Implementations MUST satisfy these cases. Tests MUST use **`resolveRarity`** with explicit inputs—not mocked `Math.random`.

## Framework

| Setting | Value |
|---------|-------|
| Runner | Vitest |
| Command | `npm test` → `vitest run` |
| Environment | `node` |
| Location | `src/*.test.js` |

## `pull.test.js` — required cases

| # | Call | Expected `rarity` | Expected `label` |
|---|------|-------------------|------------------|
| 1 | `resolveRarity(0)` | `'rare'` | `'Rare'` |
| 2 | `resolveRarity(0.09)` | `'rare'` | `'Rare'` |
| 3 | `resolveRarity(0.1)` | `'common'` | `'Common'` |
| 4 | `resolveRarity(0.5)` | `'common'` | `'Common'` |

**Boundary rule**: Exactly **0.1** is **Common** (`< 0.1` is Rare).

## `gameState.test.js` — required cases

Each test file (or each test) MUST start with `resetGameState()`.

| # | Scenario | Expected |
|---|----------|----------|
| 1 | After reset | `getCoins() === 10`, counts 0/0 |
| 2 | `spendCoin()` once | returns `true`, coins 9 |
| 3 | Spend until 0, then `spendCoin()` | returns `false`, coins stay 0 |
| 4 | `addCoin()` once | coins increase by 1 |
| 5 | `recordPull('common')` | commonCount 1, rareCount 0 |
| 6 | `recordPull('rare')` | rareCount 1, commonCount 0 |

## Non-goals

- Statistical sampling of `rollRarity()` distribution
- DOM / button click tests
- Timer / passive income tests
- Coverage percentage gates

## Success

All tests pass under `npm test` locally and in CI.
