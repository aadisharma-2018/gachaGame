# Docker Commands Contract: Phase 3

**Branch**: `003-phase3-docker-dev` | **Date**: 2026-05-20  
**Type**: Developer workflow contract (not a runtime API)

Implementations MUST expose these commands in README and quickstart.

## Prerequisites

- Docker Engine or Docker Desktop installed
- Repository cloned; commands run from **repository root**

## Build image

```bash
docker build -t gacha-game:local .
```

**Success**: Exit code 0; image `gacha-game:local` listed in `docker images`.

## Run container

```bash
docker run --rm -p 8080:80 gacha-game:local
```

| Parameter | Meaning |
|-----------|---------|
| `--rm` | Remove container on stop (recommended for local dev) |
| `-p 8080:80` | Host port 8080 → container port 80 |

**Success**: Process stays foreground; nginx serving HTTP on port 80 inside container.

## Verification URL

**http://localhost:8080**

## Alternate host port

If 8080 is in use:

```bash
docker run --rm -p 3000:80 gacha-game:local
```

Open **http://localhost:3000**.

## Stop container

`Ctrl+C` in the terminal running `docker run`, or `docker stop <container_id>` if run detached.

## Non-goals

- `docker compose` (out of scope)
- Environment files required for run (none for current app)
- Kubernetes manifests, CI pipelines, cloud push
