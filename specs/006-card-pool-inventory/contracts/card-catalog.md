# Card Catalog Contract: Phase 6

**Branch**: `006-card-pool-inventory` | **Date**: 2026-05-31

Implementations MUST expose exactly these five cards in `src/cards.js`.

## Cards

| id | name | rarity | emoji |
|----|------|--------|-------|
| `archer` | Archer | common | 🏹 |
| `swordsman` | Swordsman | common | ⚔️ |
| `protector` | Protector | common | 🛡️ |
| `mage` | Mage | rare | 🪄 |
| `king` | King | rare | 👑 |

## Pools

- **Common pool**: archer, swordsman, protector (3 cards)
- **Rare pool**: mage, king (2 cards)

## Display order (inventory)

Archer → Swordsman → Protector → Mage → King

## Non-goals

- Dynamic catalog loading
- Image URLs or sprite sheets
- Card stats, levels, or fusion
