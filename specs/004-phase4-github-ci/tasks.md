---
description: "Phase 4 implementation tasks — GitHub Actions CI pipeline"
---

# Tasks: Phase 4 GitHub Actions CI Pipeline

**Input**: [plan.md](./plan.md), [spec.md](./spec.md), [contracts/ci-workflow.md](./contracts/ci-workflow.md)  
**Branch**: `004-phase4-github-ci`

**Scope**: CI only. No deployment, AWS, K8s, Docker publish, backend, database, auth, gameplay, persistence, or future phases.

**Tests**: Manual verification on GitHub (README + optional local mirror).

## Format

`- [ ] [TaskID] [Story?] Description — **File/area:** … — **Expected outcome:** …`

Tasks are **sequential**; complete in order.

---

## Phase 1: Setup — Confirm build commands

**Purpose**: Align CI with existing npm scripts (item 1).

- [x] T001 Confirm `package.json` defines install via lockfile (`npm ci` when `package-lock.json` exists) and production build via `npm run build` — **File/area:** `package.json`, `package-lock.json` — **Expected outcome:** CI will use `npm ci` + `npm run build`; no script changes unless missing.

---

## Phase 2: Foundational — Workflow file scaffold

**Purpose**: Create workflow path and job shell before steps (item 2).

- [x] T002 Create `.github/workflows/ci.yml` with workflow name `CI`, job `ci` on `ubuntu-latest`, and `actions/checkout@v4` — **File/area:** `.github/workflows/ci.yml` — **Expected outcome:** Valid YAML skeleton; checkout step present.

---

## Phase 3: User Story 1 & 2 — CI pipeline steps (Priority: P1)

**Goal**: Triggers, Node, install, build, Docker (items 3–7). Same workflow serves PRs and pushes to **main**.

**Independent test**: Push branch → open PR to **main** → CI runs all steps green.

- [x] T003 [US1] Add `on:` triggers for `pull_request` and `push` to branch **main** in `.github/workflows/ci.yml` — **File/area:** `.github/workflows/ci.yml` — **Expected outcome:** Workflow runs on PRs targeting **main** and direct pushes to **main** only.
- [x] T004 [US1] Add `actions/setup-node@v4` with `node-version: '20'` and `cache: npm` — **File/area:** `.github/workflows/ci.yml` — **Expected outcome:** Node 20 available before install/build steps.
- [x] T005 [US1] Add **Install dependencies** step: `npm ci` if `package-lock.json` exists, else `npm install` — **File/area:** `.github/workflows/ci.yml` — **Expected outcome:** Dependencies install; step fails workflow on error.
- [x] T006 [US1] Add **Build frontend** step running `npm run build` — **File/area:** `.github/workflows/ci.yml` — **Expected outcome:** Vite `dist/` builds; workflow fails if build fails.
- [x] T007 [US1] Add **Build Docker image** step running `docker build -t gacha-game:ci .` — **File/area:** `.github/workflows/ci.yml` — **Expected outcome:** Dockerfile builds in CI; workflow fails if Docker build fails; no `docker push`.

**Checkpoint (MVP)**: Full workflow file complete; no deploy/publish steps.

---

## Phase 4: User Story 3 — README documentation (Priority: P2)

**Goal**: Document CI for contributors (items 8–9).

**Independent test**: Read README CI section only; understand triggers and three checks.

- [x] T008 [US3] Add **Continuous Integration (CI)** section to `README.md`: runs on PR + push to **main**; checks install, `npm run build`, Docker build — **File/area:** `README.md` — **Expected outcome:** Short CI summary; link or path to `.github/workflows/ci.yml`.
- [x] T009 [US3] Add **CI manual verification** to `README.md`: open PR to **main**, check Actions tab, confirm green; optional local mirror (`npm ci`, `npm run build`, `docker build`) — **File/area:** `README.md` — **Expected outcome:** Steps to confirm workflow passes on GitHub without reading YAML.

---

## Phase 5: Polish — Scope guard

**Purpose**: Confirm CI-only diff (no gameplay).

- [x] T010 Verify workflow has no deploy, `docker push`, AWS, or secrets steps; `src/` game files unchanged — **File/area:** `.github/workflows/ci.yml`, `src/` — **Expected outcome:** Phase 4 adds CI + README only; game behavior unchanged.

**Checkpoint**: Phase 4 complete. **Stop** — no Phase 5 features.

---

## Dependencies & execution order

```text
T001 → T002 → T003 → T004 → T005 → T006 → T007 → T008 → T009 → T010
```

| User story | Tasks |
|------------|-------|
| US1 — PR CI (build steps) | T003–T007 |
| US2 — Push to main | T003 (shared triggers) |
| US3 — README | T008–T009 |

### Mapping to requested coverage

| # | Requirement | Task(s) |
|---|-------------|---------|
| 1 | Confirm install/build commands | T001 |
| 2 | Create `ci.yml` | T002 |
| 3 | PR + push triggers | T003 |
| 4 | Node setup | T004 |
| 5 | Dependency install | T005 |
| 6 | Frontend build | T006 |
| 7 | Docker build | T007 |
| 8 | README CI section | T008 |
| 9 | GitHub verification docs | T009 |
| — | No gameplay/deploy | T010 |

### Out of scope (no tasks)

Deployment, AWS, Kubernetes, Docker image publishing, backend, database, authentication, gameplay/persistence changes, automated test suites, future phases.

---

## Task summary

| Phase | Task IDs | Count |
|-------|----------|-------|
| Setup | T001 | 1 |
| Foundational | T002 | 1 |
| US1/US2 — Workflow | T003–T007 | 5 |
| US3 — README | T008–T009 | 2 |
| Polish | T010 | 1 |
| **Total** | **T001–T010** | **10** |

**MVP scope**: T001–T007 (workflow complete).

**Format validation**: All tasks include Task ID, file/area, and expected outcome.
