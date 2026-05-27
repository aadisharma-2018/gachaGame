# Quickstart: Phase 3 Docker

**Branch**: `003-phase3-docker-dev` | **Date**: 2026-05-20

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed and running
- Repository at project root

## Build image

```bash
docker build -t gacha-game:local .
```

First build may take a few minutes (npm install + Vite build).

## Run container

```bash
docker run --rm -p 8080:80 gacha-game:local
```

Open **http://localhost:8080** in your browser.

## Manual verification

### 1. Container serves the app

- [ ] `docker build` completes without errors
- [ ] `docker run` stays up without immediate exit
- [ ] http://localhost:8080 shows the gacha game UI (title, coins, Pull button)

### 2. Gameplay parity (vs `npm run dev`)

- [ ] **Coins: 10**, **Common: 0**, **Rare: 0** on first load
- [ ] **Pull** costs 1 coin and shows **Common** or **Rare**
- [ ] At 0 coins, **Pull** shows **Not enough coins.**
- [ ] **Next coin** countdown visible; after ~60s, +1 coin (optional spot-check)
- [ ] Counters increment only on successful pulls

### 3. Session reset (unchanged)

- [ ] Browser refresh resets coins to 10 and counts to 0
- [ ] No `localStorage` / `sessionStorage` added in `src/`

### 4. npm workflow still works

- [ ] `npm install && npm run dev` still works independently of Docker

## Troubleshooting

| Issue | Action |
|-------|--------|
| Port 8080 in use | `docker run --rm -p 3000:80 gacha-game:local` → http://localhost:3000 |
| Build fails at `npm ci` | Ensure `package-lock.json` exists; check network |
| Blank page | Check browser console; verify `dist/` built in image (rebuild with `--no-cache`) |
| Permission denied (Docker) | Start Docker Desktop or add user to `docker` group (Linux) |

## What’s next

Run `/speckit.tasks` then `/speckit.implement` to add `Dockerfile`, `.dockerignore`, `nginx.conf`, and README updates.
