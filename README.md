# Gacha Game

A **frontend-only** gacha-style card pull game built in small learning phases. Click **Pull** to draw **Common** or **Rare** cards, spend session coins, and track pulls—all in the browser with no backend.

This repository is a **phased learning project**: each phase adds a focused slice of gameplay while staying simple, local, and easy to review.

## Current features

**Phase 1 — Pull prototype**

- Single-page UI with a **Pull** button
- Random **Common** (90%) or **Rare** (10%) results
- Clear on-screen rarity feedback

**Phase 2 — Currency and counters**

- Start with **10** coins; each pull costs **1** coin
- **Not enough coins.** when balance is 0
- **+1** coin every **60** seconds while the page is open
- **Next coin** countdown timer
- Session **Common** and **Rare** pull counts
- All state is **in-memory only** (resets on refresh)

**Not included (yet):** backend, database, auth, persistence (`localStorage` / `sessionStorage`), inventory UI, Docker, CI/CD.

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (20+ recommended)
- npm (bundled with Node)

## Install dependencies

From the repository root:

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Build

Production build and local preview:

```bash
npm run build
npm run preview
```

`npm run preview` serves the contents of `dist/` for a quick smoke test after building.

## Manual verification

### Phase 2

#### 1. Coins and layout

- [ ] Page shows **Coins: 10**, **Common: 0**, **Rare: 0** on load
- [ ] **Pull** button and result area are visible

#### 2. Paid pulls

- [ ] Click **Pull** once → coins decrease to **9** and **Common** or **Rare** appears
- [ ] Each successful pull costs exactly **1** coin

#### 3. Insufficient coins

- [ ] Spend coins until balance is **0**
- [ ] Click **Pull** → message **Not enough coins.** (no new pull, counts unchanged)

#### 4. Session counters

- [ ] After a **Common** pull, **Common** count increases by 1
- [ ] After a **Rare** pull, **Rare** count increases by 1
- [ ] Blocked pull at 0 coins does not change either count

#### 5. Passive income

- [ ] **Next coin:** countdown is visible and ticks down toward the next free coin
- [ ] With page open, wait until the countdown reaches **0:00** (or use a clock for ~60s)
- [ ] Coin balance increases by **1** without refreshing; countdown resets to **1:00**

#### 6. Refresh resets state

- [ ] After playing, refresh the page (F5 / Cmd+R)
- [ ] Coins return to **10**, counts to **0**, result shows placeholder text

#### 7. No persistence APIs

- [ ] Confirm `src/` has no `localStorage`, `sessionStorage`, or `indexedDB` usage

#### 8. Phase 1 odds (unchanged)

- [ ] `src/pull.js` still uses `Math.random() < 0.1` for **Rare**
- [ ] Over several paid pulls, both **Common** and **Rare** can appear

### Phase 1

<details>
<summary>Phase 1 checks (still apply on paid pulls)</summary>

- App runs with **Pull** and clean layout
- Paid pulls show **Common** or **Rare** clearly
- Repeat paid pulls update the result each time
- Refresh clears session (see Phase 2 §6)
- No login, inventory, or extra pages

</details>

## Tech stack

- [Vite](https://vitejs.dev/) + vanilla JavaScript (HTML/CSS)
- No framework, no server required for local play

## Specifications

Design docs and task lists live under `specs/` (e.g. `001-phase1-gacha-pull`, `002-phase2-currency-counters`).
