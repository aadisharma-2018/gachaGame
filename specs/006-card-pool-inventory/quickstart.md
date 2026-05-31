# Quickstart: Phase 6 Card Pool and Inventory

**Branch**: `006-card-pool-inventory` | **Date**: 2026-05-31

## Prerequisites

- Phases 1–5 complete (`npm run dev`, `npm test`, CI green)
- Node 20+ recommended

## After implementation

### Run locally

```bash
npm run dev
```

Open the dev URL (usually http://localhost:5173).

### Quick smoke

1. **Pull** with coins → see emoji, card name, and rarity (not generic Common/Rare only).
2. Click **Inventory** → panel shows 5 cards; pulled card quantity is **1**.
3. Pull again → quantities update; Common/Rare counters still increment.
4. Refresh page → inventory back to **0**, coins **10**.

### Tests

```bash
npm test
```

Rarity boundary tests must still pass; optional new pool-picker tests if added.

### Build (optional)

```bash
npm run build
```

## Manual verification checklist

- [ ] 3 Common cards (Archer, Swordsman, Protector) can appear on Common pulls
- [ ] 2 Rare cards (Mage, King) can appear on Rare pulls
- [ ] Result shows emoji + name + rarity
- [ ] Inventory button toggles same-page panel
- [ ] All 5 cards listed with quantities
- [ ] Duplicate pulls increase that card’s quantity
- [ ] 0 coins → **Not enough coins.**; no inventory change
- [ ] Refresh resets inventory (no localStorage)
- [ ] Coins, timer, Common/Rare counters still work
- [ ] `npm test` passes

## Troubleshooting

| Issue | Action |
|-------|--------|
| Only generic Common/Rare shown | Confirm `main.js` uses `rollCard()` and renders card fields |
| Inventory empty/wrong | Check `inventory.js` keyed by card `id` |
| Tests fail on rarity | Do not change `resolveRarity` threshold |
| Persistence suspected | Grep `src/` for localStorage/sessionStorage — must be none |

## What's next

`/speckit.tasks` → `/speckit.implement`
