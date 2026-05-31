# Data Model: Phase 6 Card Pool and Inventory

**Branch**: `006-card-pool-inventory` | **Date**: 2026-05-31

## Entities

### Card (catalog entry)

| Field | Type | Example |
|-------|------|---------|
| `id` | string | `archer` |
| `name` | string | Archer |
| `rarity` | `'common' \| 'rare'` | `common` |
| `emoji` | string | 🏹 |
| `label` | string | Common / Rare (display) |

**Fixed instances (5)**:

| id | name | rarity | emoji |
|----|------|--------|-------|
| archer | Archer | common | 🏹 |
| swordsman | Swordsman | common | ⚔️ |
| protector | Protector | common | 🛡️ |
| mage | Mage | rare | 🪄 |
| king | King | rare | 👑 |

### Card catalog

- **COMMON_POOL**: 3 cards (archer, swordsman, protector)
- **RARE_POOL**: 2 cards (mage, king)
- **ALL_CARDS**: 5 cards in stable inventory display order

### Pull result

Outcome of paid pull:

1. Rarity roll (90/10) — unchanged from Phase 1–5
2. Card pick from matching pool (uniform)
3. Returned **Card** object shown in UI

### Inventory entry

| Field | Type | Rule |
|-------|------|------|
| `cardId` | string | One of 5 ids |
| `quantity` | integer ≥ 0 | Session-owned count |

All 5 ids exist in inventory map; default quantity **0**.

### Session state (in memory)

| State | Module | Reset on refresh |
|-------|--------|------------------|
| Coins | `gameState.js` | Yes → 10 |
| Common/Rare counters | `gameState.js` | Yes → 0 |
| Per-card quantities | `inventory.js` | Yes → 0 |
| Inventory panel open | `main.js` local | Yes → closed |
| Passive income timer | `main.js` local | Yes → restarted |

## State transitions

### Successful pull

```text
coins >= 1
  → spendCoin() (−1)
  → rollCard() → Card
  → recordPull(card.rarity)   // commonCount or rareCount += 1
  → addCard(card.id)           // inventory quantity += 1
  → update result UI
```

### Blocked pull

```text
coins < 1
  → show "Not enough coins."
  → no card, no inventory change, no counter change
```

### Inventory toggle

```text
click Inventory
  → inventoryOpen = !inventoryOpen
  → show/hide panel
  → renderInventory() when visible
```

## Invariants

1. No persistence beyond page session.
2. Rarity step odds unchanged (90/10).
3. Inventory always lists all 5 cards (quantity may be 0).
4. Quantity only increases on successful paid pulls.
