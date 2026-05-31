# Pull Flow Contract: Phase 6

**Branch**: `006-card-pool-inventory` | **Date**: 2026-05-31

## Algorithm (paid pull only)

```text
Step 1 — Rarity (unchanged)
  resolveRarity(random₁)
  random₁ < 0.1  → rare
  random₁ >= 0.1 → common

Step 2 — Specific card (uniform within pool)
  pickCardFromPool(rarity, random₂)
  index = floor(random₂ * pool.length)
  return pool[index]
```

## Odds

| Stage | Rule |
|-------|------|
| Rarity | 90% Common, 10% Rare |
| Given Common | Each of 3 cards equally likely (⅓ each) |
| Given Rare | Each of 2 cards equally likely (½ each) |

## Public API (suggested)

| Function | Purpose |
|----------|---------|
| `resolveRarity(value)` | Existing; Phase 5 tests |
| `pickCardFromPool(rarity, value)` | Pure pool pick |
| `rollCard()` | Production: two `Math.random()` calls |

## Result UI (after successful pull)

Must show:

1. Card **emoji**
2. Card **name**
3. Card **rarity** label (Common / Rare)

## Blocked pull

At 0 coins: no `rollCard()`, no inventory update, no counter update.

## Non-goals

- Pity system
- Weighted individual card rates within pool
- Changing 90/10 rarity step
