# Quickstart: Phase 1 Gacha Pull Prototype

**Branch**: `001-phase1-gacha-pull` | **Date**: 2026-05-19

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (20+ recommended)
- npm (bundled with Node)

## Setup (first time)

From the repository root:

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Open the URL printed in the terminal (typically `http://localhost:5173`).

## Manual verification (Phase 1 Definition of Done)

### 1. App runs

- [ ] Dev server starts without errors.
- [ ] Page loads with a **Pull** button and clean layout.

### 2. Single pull

- [ ] Click **Pull** once.
- [ ] Screen shows **Common** or **Rare** clearly.

### 3. Repeat pulls

- [ ] Click **Pull** at least 10 times.
- [ ] Each click shows a new result (may repeat rarities).

### 4. Pull logic and rarity appearance

- [ ] Confirm `src/pull.js` uses `Math.random() < 0.1` for **Rare** (else **Common**).
- [ ] Click **Pull** until both **Common** and **Rare** have appeared at least once (no fixed pull count or percentage band required).

### 5. No persistence

- [ ] After at least one pull, refresh the page (F5 / Cmd+R).
- [ ] Prior result is gone; state matches first visit.

### 6. Scope check

- [ ] No login, wallet, inventory, or extra pages visible.

## Optional: production build preview

```bash
npm run build
npm run preview
```

Use the preview URL for a static build smoke test. Not required for Phase 1 DoD if `npm run dev` passes all checks above.

## Troubleshooting

| Issue | Action |
|-------|--------|
| `npm: command not found` | Install Node.js 18+ |
| Port in use | Vite picks another port—read terminal output |
| Blank page | Check browser console; ensure `index.html` references `src/main.js` |

## What’s next

After verification passes, stop Phase 1 work. Use `/speckit.tasks` to generate
implementation tasks, then `/speckit.implement` when ready to build.
