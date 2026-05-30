# Implementation Plan: Phase 4 GitHub Actions CI Pipeline

**Branch**: `004-phase4-github-ci` | **Date**: 2026-05-20 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/004-phase4-github-ci/spec.md`

**Note**: Phase 4 adds CI only—no deployment, registry push, or app changes.

## Summary

Add **`.github/workflows/ci.yml`** that runs on **pull_request** and **push to main**: checkout → Node 20 → `npm ci` → `npm run build` → `docker build`. Update **README** with a CI section. Fail the workflow if frontend or Docker build fails.

## Technical Context

**Language/Version**: JavaScript, Node **20** (matches Dockerfile build stage)  
**Primary Dependencies**: GitHub Actions (`actions/checkout`, `actions/setup-node`), npm, Docker on `ubuntu-latest`  
**Storage**: N/A  
**Testing**: Manual verification via GitHub PR/push + [quickstart.md](./quickstart.md)  
**Target Platform**: GitHub-hosted runners (`ubuntu-latest`)  
**Project Type**: Frontend repo with Docker packaging  
**Performance Goals**: CI completes in typical GitHub Actions time (&lt;10 min for this small app)  
**Constraints**: No secrets, no deploy, no `src/` changes; `package-lock.json` present → use **`npm ci`**  
**Scale/Scope**: One workflow file + README section

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Evidence |
|------|--------|----------|
| Simplicity | ✅ PASS | Single job, linear steps |
| Infrastructure | ✅ PASS (Phase 4) | CI only—no AWS/K8s/deploy |
| Abstractions | ✅ PASS | One workflow file |
| Local run | ✅ PASS | npm/Docker local paths unchanged |
| Phase boundary | ✅ PASS | No gameplay/persistence/backend |
| Pull prototype | ✅ PASS | Unchanged |

**Post-design re-check**: All gates pass. Phase 4 is an explicit CI/CD exception for this phase.

## Project Structure

### Documentation (this feature)

```text
specs/004-phase4-github-ci/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ci-workflow.md
└── tasks.md              # /speckit.tasks
```

### Repository additions (implementation)

```text
.github/workflows/ci.yml   # GitHub Actions workflow
README.md                  # CI section (append/update)
# Unchanged: src/, Dockerfile, package.json, etc.
```

## Workflow Design

### File path

**`.github/workflows/ci.yml`**

### Triggers

```yaml
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
```

### Job: `ci` (single job on `ubuntu-latest`)

| Step | Action |
|------|--------|
| 1 | `actions/checkout@v4` |
| 2 | `actions/setup-node@v4` with `node-version: '20'` and `cache: 'npm'` |
| 3 | Install: `npm ci` (lockfile exists) — fallback `npm install` if lockfile missing |
| 4 | Build: `npm run build` |
| 5 | Docker: `docker build -t gacha-game:ci .` |

**Failure behavior**: Any step exit code ≠ 0 fails the job and the workflow.

### Canonical commands (CI)

| Step | Command |
|------|---------|
| Install | `npm ci` |
| Frontend build | `npm run build` |
| Docker build | `docker build -t gacha-game:ci .` |

### Planned workflow skeleton

```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: npm
      - name: Install dependencies
        run: |
          if [ -f package-lock.json ]; then npm ci; else npm install; fi
      - name: Build frontend
        run: npm run build
      - name: Build Docker image
        run: docker build -t gacha-game:ci .
```

## README Update (design)

Add **## Continuous Integration (CI)** section:

- Runs on PRs to **main** and pushes to **main**
- Checks: dependency install, `npm run build`, Docker image build
- Link to `.github/workflows/ci.yml`
- Note: does not deploy or publish images

Preserve existing npm, Docker, and manual verification sections.

## Complexity Tracking

> No violations.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |

## Phase 0 & 1 Artifacts

| Artifact | Path |
|----------|------|
| Research | [research.md](./research.md) |
| Data model | [data-model.md](./data-model.md) |
| CI contract | [contracts/ci-workflow.md](./contracts/ci-workflow.md) |
| Quickstart | [quickstart.md](./quickstart.md) |
