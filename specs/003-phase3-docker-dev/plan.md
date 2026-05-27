# Implementation Plan: Phase 3 Dockerized Local Development

**Branch**: `003-phase3-docker-dev` | **Date**: 2026-05-20 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/003-phase3-docker-dev/spec.md`

**Note**: Phase 3 adds Docker packaging only—no gameplay, persistence, or backend changes.

## Summary

Add a **multi-stage Dockerfile** (Node `npm ci` + `npm run build` → **nginx** serves `dist/`) and **`.dockerignore`** so developers can build and run the existing Vite gacha game at **http://localhost:8080** (`-p 8080:80`). Update **README** with build/run commands and manual parity verification.

## Technical Context

**Language/Version**: JavaScript (ES modules), Vite 6.x, Node 20 LTS (build stage)  
**Primary Dependencies**: Vite (dev/build); nginx 1.27-alpine (runtime stage)  
**Storage**: N/A (static files in image only; app state remains in-browser memory)  
**Testing**: Manual verification per [quickstart.md](./quickstart.md)  
**Target Platform**: Docker Engine / Docker Desktop (Linux/macOS/Windows)  
**Project Type**: Frontend static site in container  
**Performance Goals**: Image build &lt;5 min on typical laptop; HTTP serve via nginx  
**Constraints**: No changes to `src/` game logic; no Compose/K8s/CI/CD; port **80** in container, **8080** on host documented  
**Scale/Scope**: 3 new repo files (`Dockerfile`, `.dockerignore`, `nginx.conf`) + README section

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Evidence |
|------|--------|----------|
| Simplicity | ✅ PASS | Standard two-stage frontend pattern; no app rewrite |
| Infrastructure | ✅ PASS (Phase 3) | Docker only—no DB, auth, K8s, AWS, CI/CD |
| Abstractions | ✅ PASS | Single Dockerfile + minimal nginx config |
| Local run | ✅ PASS | `docker build` / `docker run` documented; npm path unchanged |
| Phase boundary | ✅ PASS | No gameplay, persistence, or backend tasks |
| Pull prototype | ✅ PASS | Unchanged; parity verified manually |

**Post-design re-check**: All gates pass. Docker is an explicit Phase 3 exception to constitution “defer Docker” for Phases 1–2.

## Project Structure

### Documentation (this feature)

```text
specs/003-phase3-docker-dev/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── docker-commands.md
└── tasks.md              # Created by /speckit.tasks
```

### Repository additions (implementation)

```text
Dockerfile                 # Node build → nginx runtime
.dockerignore              # Slim build context
nginx.conf                 # SPA static serve + try_files fallback
# (existing unchanged)
src/
index.html
package.json
package-lock.json
dist/                      # Build output (gitignored; produced in Docker build stage)
```

**Structure Decision**: Docker files at **repository root** beside `package.json`. No changes under `src/` except if nginx base path requires none (Vite `base: '/'` default).

## Dockerfile Structure (design)

```dockerfile
# Stage 1: build
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: runtime
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Image tag (documented)**: `gacha-game:local`

## .dockerignore (design)

Exclude from build context:

- `node_modules/`
- `dist/`
- `.git/`
- `.env`, `.env.*`
- `*.log`, npm/yarn/pnpm debug logs
- `.DS_Store`
- `specs/` (optional—keeps context smaller; not needed for build)
- `.cursor/`, `.vscode/`, `.idea/`

## Commands (canonical)

| Action | Command |
|--------|---------|
| **Build** | `docker build -t gacha-game:local .` |
| **Run** | `docker run --rm -p 8080:80 gacha-game:local` |
| **Browser URL** | **http://localhost:8080** |
| **Stop** | `Ctrl+C` in terminal running the container |

**Port conflict**: Use `-p 3000:80` and open http://localhost:3000 instead.

## README Updates (design)

Add a **## Docker** section after **Build** (npm) with:

1. Prerequisite: Docker installed  
2. Build and run commands (table above)  
3. Verification URL  
4. Link to Phase 3 manual checks in quickstart / checklist bullets  
5. Note: gameplay identical to `npm run dev`; session still in-memory only  

Preserve existing npm, verification, and phased-learning content.

## Manual Verification (summary)

See [quickstart.md](./quickstart.md). Key checks:

1. `docker build` succeeds  
2. `docker run` → http://localhost:8080 loads  
3. Pull, coins, timer, counters match npm behavior  
4. Refresh resets session  
5. No new persistence APIs  

## Complexity Tracking

> No unjustified violations.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |

## Phase 0 & 1 Artifacts

| Artifact | Path |
|----------|------|
| Research | [research.md](./research.md) |
| Data model | [data-model.md](./data-model.md) |
| Commands contract | [contracts/docker-commands.md](./contracts/docker-commands.md) |
| Quickstart | [quickstart.md](./quickstart.md) |
