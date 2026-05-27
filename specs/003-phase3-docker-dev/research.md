# Research: Phase 3 Dockerized Local Development

**Branch**: `003-phase3-docker-dev` | **Date**: 2026-05-20

## R-001: Multi-stage build pattern

**Decision**: **Node 20 Alpine** build stage + **nginx 1.27 Alpine** runtime stage.

**Rationale**:

- Matches Vite production workflow (`npm ci` + `npm run build`).
- Final image contains only static `dist/` + nginx—no Node in production image (smaller, fewer attack surfaces).
- Industry-standard for SPAs.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Single-stage Node + `vite preview` | Keeps dev server in image; not ideal for production-style serve |
| `nginx` serves from bind mount | Not self-contained image; fails FR-003/004 |
| Caddy/Apache | nginx is widely documented for static SPAs |

## R-002: Dependency install in Docker

**Decision**: `npm ci` with committed **`package-lock.json`**.

**Rationale**:

- Reproducible installs in CI/Docker same as local npm.
- Faster and stricter than `npm install` in containers.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| `npm install` only | Less reproducible without lockfile discipline |
| pnpm/yarn | Project already uses npm + package-lock.json |

## R-003: nginx configuration for Vite SPA

**Decision**: Custom **`nginx.conf`** with `root /usr/share/nginx/html`, `try_files $uri $uri/ /index.html` for single-page app.

**Rationale**:

- Vite builds assets under `dist/` with `index.html` entry.
- Fallback ensures direct URL loads work if routes expand later; harmless for current single-page game.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Default nginx image config only | May not include SPA fallback |
| Dev server in container | Not production-style per spec |

## R-004: Port mapping

**Decision**: **EXPOSE 80** in image; document **`docker run -p 8080:80`**.

**Rationale**:

- User requirement: host **8080** → container **80**.
- nginx listens on 80 by default in official image.

## R-005: Build context exclusions

**Decision**: **`.dockerignore`** excludes `node_modules`, `dist`, `.git`, env files, logs, editor folders, optional `specs/`.

**Rationale**:

- Smaller,faster builds; FR-002.
- `node_modules` rebuilt inside image; host copy unnecessary.

## Resolved clarifications

No `NEEDS CLARIFICATION` items—all decisions align with spec and user plan input.
