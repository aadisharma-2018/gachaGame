# Data Model: Phase 3 Docker Packaging

**Branch**: `003-phase3-docker-dev` | **Date**: 2026-05-20

Phase 3 does not add application data entities. This document describes **delivery artifacts** only.

## Artifacts

### Docker Image (`gacha-game:local`)

| Attribute | Value |
|-----------|--------|
| Build context | Repository root |
| Build stages | `build` (Node), runtime (nginx) |
| Contents (runtime) | `/usr/share/nginx/html` ← Vite `dist/` |
| Exposed port | **80** (TCP) |
| Game state | None in image (client in-memory only) |

### Container Instance

| Attribute | Value |
|-----------|--------|
| Host port (documented) | **8080** |
| Container port | **80** |
| Mapping | `-p 8080:80` |
| Lifecycle | Ephemeral (`--rm` optional); stop does not persist player session |

### Static Build Output (`dist/`)

| Field | Description |
|-------|-------------|
| `index.html` | App shell |
| `assets/*` | Bundled JS/CSS from Vite |

Produced in **build** stage; not committed to git.

## Relationships

```text
Dockerfile
  ├── build stage → dist/
  └── runtime stage → nginx serves dist/

docker run -p 8080:80
  └── Browser → http://localhost:8080 → same UI as npm build
```

## Invariants

1. **No persistence layer** in image or new browser storage APIs.
2. **No backend** process in container—only nginx + static files.
3. **Gameplay state** unchanged from Phase 2; refresh still resets session in browser.
