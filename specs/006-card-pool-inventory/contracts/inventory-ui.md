# Inventory UI Contract: Phase 6

**Branch**: `006-card-pool-inventory` | **Date**: 2026-05-31

## Controls

| Element | id (suggested) | Behavior |
|---------|----------------|----------|
| Inventory button | `inventory-btn` | Toggles panel visibility on same page |
| Inventory panel | `inventory-panel` | Hidden by default |

## Panel contents

For **each** of the 5 catalog cards, one row showing:

| Column | Content |
|--------|---------|
| Emoji | Card emoji |
| Name | Card name |
| Rarity | Common or Rare |
| Quantity | Session count (0 if never pulled) |

## Toggle behavior

- First click: panel **visible**
- Second click: panel **hidden**
- No route change, no new page

## Sync rules

- After each successful pull, pulled card quantity += 1
- Panel may be re-rendered when open or on next open
- Refresh: all quantities 0, panel closed

## Retained UI (Phase 2)

- Coins, Common/Rare counters, coin timer, Pull button remain

## Non-goals

- Separate inventory route
- Sort/filter/search
- Persist inventory across sessions
