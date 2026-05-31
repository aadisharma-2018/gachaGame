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

**Phase 3 — Docker (local)**

- Build and run the same app in a container (nginx serves production `dist/`)
- Documented `docker build` / `docker run` workflow

**Phase 4 — GitHub Actions CI**

- Automated checks on pull requests and pushes to **main**
- Validates dependency install, unit tests, frontend build, and Docker image build
- Workflow: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

**Phase 5 — Automated tests**

- **Vitest** unit tests for pull odds and coin/counter logic
- **`npm test`** runs locally and in CI before builds

**Phase 6 — Card pool and inventory**

- **5** specific cards with emoji visuals (3 Common, 2 Rare)
- Pull shows **emoji**, **name**, and **rarity**; **90% / 10%** odds unchanged
- **Inventory** button toggles a same-page panel with per-card session quantities
- All inventory data is **in-memory only** (resets on refresh)

**Not included (yet):** backend, database, auth, persistence (`localStorage` / `sessionStorage`), separate inventory page, Docker Compose, Kubernetes, deployment, Docker image publishing, E2E browser tests.

## Prerequisites

**npm (local development)**

- [Node.js](https://nodejs.org/) 18+ (20+ recommended)
- npm (bundled with Node)

**Docker (optional container run)**

- [Docker](https://docs.docker.com/get-docker/) Engine or Docker Desktop

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

## Tests

Automated unit tests cover pull rarity logic and session coin/counter behavior.

From the repository root:

```bash
npm test
```

Optional watch mode (local development only):

```bash
npm run test:watch
```

**What is tested**

- **`pull.js`**: `resolveRarity` at the **0.1** boundary (Rare below, Common at/above)
- **`gameState.js`**: spend, add, record pull, balances, and counters

**Not tested in Phase 5**: UI clicks, passive income timer (`main.js`).

## Docker

Run the app in a container (production-style build + nginx). Game behavior matches the npm workflow; no changes to `src/`.

### Build image

From the repository root:

```bash
docker build -t gacha-game:local .
```

### Run container

```bash
docker run --rm -p 8080:80 gacha-game:local
```

Open **http://localhost:8080** in your browser.

If port 8080 is in use:

```bash
docker run --rm -p 3000:80 gacha-game:local
```

Then open **http://localhost:3000**.

Stop the container with `Ctrl+C` in the terminal where `docker run` is running.

### Docker manual verification

- [ ] `docker build -t gacha-game:local .` completes without errors
- [ ] `docker run --rm -p 8080:80 gacha-game:local` stays running
- [ ] http://localhost:8080 shows the game (coins, Pull, counters, timer)
- [ ] **Pull** costs 1 coin; at 0 coins shows **Not enough coins.**
- [ ] Browser refresh resets session (coins 10, counts 0)
- [ ] Gameplay matches `npm run dev` for Phase 1–2 rules
- [ ] `npm run dev` still works independently

## Continuous Integration (CI)

GitHub Actions runs [`.github/workflows/ci.yml`](.github/workflows/ci.yml) to validate the project on every pull request and push to **main**.

**When it runs**

- **Pull requests** targeting **main**
- **Pushes** to **main**

**What it checks**

1. Installs dependencies (`npm ci` when `package-lock.json` exists, otherwise `npm install`)
2. Runs unit tests (`npm test`)
3. Builds the frontend (`npm run build`)
4. Builds the Docker image (`docker build -t gacha-game:ci .`)

The workflow **fails** if tests, the frontend build, or the Docker build fails. It does **not** deploy the app or publish Docker images.

### CI manual verification

**On GitHub**

1. Push this branch and open a pull request targeting **main** (or merge to **main**).
2. Open the **Actions** tab (or the PR **Checks** section).
3. Confirm the **CI** workflow completes with a green check, including the **Run tests** step.

**Optional local mirror** (same steps as CI)

```bash
npm ci
npm test
npm run build
docker build -t gacha-game:ci .
```

### Phase 5 — test CI verification

- [ ] `npm test` passes locally
- [ ] PR to **main** shows **Run tests** step green in Actions/Checks
- [ ] Full CI (test → build → Docker) completes green
- [ ] (Optional) Break a test on a scratch branch → CI fails at **Run tests**

## Manual verification

### Phase 6 — Card pool and inventory

- [ ] **Pull** shows a specific card: emoji, name, and Common/Rare label
- [ ] Common pulls can be Archer, Swordsman, or Protector
- [ ] Rare pulls can be Mage or King
- [ ] **Inventory** button toggles the panel on the same page
- [ ] Panel lists all **5** cards with emoji, name, rarity, and quantity
- [ ] Pulling a card increases that card’s quantity by **1**
- [ ] Duplicate pulls of the same card stack quantity (e.g. Archer × 2)
- [ ] **0** coins → **Not enough coins.**; inventory unchanged
- [ ] Browser refresh resets inventory to **0** for all cards
- [ ] Coins, timer, and Common/Rare counters still behave as in Phase 2
- [ ] `npm test` still passes

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

Design docs and task lists live under `specs/` (e.g. `001-phase1-gacha-pull`, `002-phase2-currency-counters`, `003-phase3-docker-dev`, `004-phase4-github-ci`, `005-phase5-automated-tests`, `006-card-pool-inventory`).
