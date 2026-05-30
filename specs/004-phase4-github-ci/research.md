# Research: Phase 4 GitHub Actions CI

**Branch**: `004-phase4-github-ci` | **Date**: 2026-05-20

## R-001: Runner and Docker

**Decision**: **`ubuntu-latest`** GitHub-hosted runner (Docker pre-installed).

**Rationale**: Standard for Node + `docker build` without self-hosted setup. FR-004 requires Docker image build in CI.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| macOS runner | Slower, unnecessary for Linux containers |
| Skip Docker in CI | Violates spec FR-004 |

## R-002: Node version

**Decision**: **Node 20** via `actions/setup-node@v4`.

**Rationale**: Matches `Dockerfile` build stage (`node:20-alpine`); README recommends Node 18+; 20 is current LTS alignment.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Node 18 | Works but diverges from Dockerfile |
| Matrix 18+20 | Overkill for Phase 4 simplicity |

## R-003: Dependency install

**Decision**: **`npm ci`** when `package-lock.json` exists; else **`npm install`**.

**Rationale**: Lockfile is committed; `npm ci` is faster and reproducible in CI. User plan explicitly requests this fallback pattern.

## R-004: Workflow triggers

**Decision**: **`pull_request`** and **`push`** limited to **`main`** branch.

**Rationale**: Matches spec FR-001 and user requirements exactly.

## R-005: Docker build tag

**Decision**: **`docker build -t gacha-game:ci .`** (local tag only, no push).

**Rationale**: Validates Dockerfile without registry publish (out of scope).

## R-006: Actions versions

**Decision**: `actions/checkout@v4`, `actions/setup-node@v4` with `cache: npm`.

**Rationale**: Current major versions; npm cache speeds repeat runs.

## Resolved clarifications

No `NEEDS CLARIFICATION` items remain.
