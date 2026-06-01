# Quickstart: Phase 7 localStorage Persistence

**Branch**: `007-localstorage-persistence` | **Date**: 2026-05-31

## Prerequisites

- Phases 1–6 complete
- Browser with localStorage enabled

## After implementation

### Run

```bash
npm run dev
```

### Verify persistence

1. Pull a few cards; note coins and inventory.
2. Refresh the page (F5 / Cmd+R).
3. Confirm coins, counters, inventory, and last pull result restored.

### Verify reset

1. Click **Reset Progress**.
2. Confirm defaults (10 coins, empty inventory, placeholder result).
3. Refresh — still defaults.

### DevTools check

Application → Local Storage → origin → key **`gachaGameState`**

### Docker note

Persistence works on the container **origin** (e.g. `http://localhost:8080`). Different port from `npm run dev` = separate save.

### Tests

```bash
npm test
npm run build
```

## Manual checklist

- [ ] Refresh restores coins and inventory
- [ ] Last pulled card visible after refresh
- [ ] Passive coin grant survives refresh (wait ~60s or adjust timer in dev)
- [ ] Reset clears storage and UI
- [ ] Invalid JSON in storage → game loads defaults
- [ ] `npm test` passes

## Troubleshooting

| Issue | Action |
|-------|--------|
| No restore | Check same origin/port; storage not disabled |
| Stale corrupt save | Reset Progress or delete `gachaGameState` in DevTools |
| CI fails | Ensure persistence tests mock localStorage |

## What's next

`/speckit.tasks` → `/speckit.implement`
