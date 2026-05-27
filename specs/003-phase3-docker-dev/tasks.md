---
description: "Phase 3 implementation tasks — Dockerized local development"
---

# Tasks: Phase 3 Dockerized Local Development

**Input**: [plan.md](./plan.md), [spec.md](./spec.md), [contracts/docker-commands.md](./contracts/docker-commands.md)  
**Branch**: `003-phase3-docker-dev`

**Scope**: Docker packaging only. No changes to `src/` gameplay, persistence, backend, Compose, K8s, AWS, CI/CD, or future phases.

**Tests**: Manual verification only.

## Format

`- [ ] [TaskID] [Story?] Description — **File/area:** … — **Expected outcome:** …`

Tasks are **sequential**; complete in order.

---

## Phase 1: Setup — Confirm build contract

**Purpose**: Verify the existing npm build matches the Docker build stage (item 1).

- [x] T001 Confirm `package.json` defines `npm run build` (Vite production build to `dist/`) and `package-lock.json` exists for `npm ci` — **File/area:** `package.json`, `package-lock.json` — **Expected outcome:** Documented build command is `npm run build`; no script changes required unless missing.

---

## Phase 2: Foundational — Docker context and config

**Purpose**: Files required before the multi-stage image (items 2–3).

- [x] T002 Create `.dockerignore` excluding `node_modules/`, `dist/`, `.git/`, `.env*`, logs, `.DS_Store`, and editor folders per [plan.md](./plan.md) — **File/area:** `.dockerignore` — **Expected outcome:** `docker build` context excludes dev artifacts; smaller,faster builds.
- [x] T003 Create `nginx.conf` for SPA static serve (`root`, `try_files` → `/index.html`) — **File/area:** `nginx.conf` — **Expected outcome:** Config ready to copy into nginx image at `/etc/nginx/conf.d/default.conf`.

---

## Phase 3: User Story 1 — Build Docker image (Priority: P1)

**Goal**: Multi-stage Dockerfile: Node builds, nginx serves (items 3–6).

**Independent test**: `docker build -t gacha-game:local .` succeeds.

- [x] T004 [US1] Create `Dockerfile` with **Node 20 Alpine build stage**: `WORKDIR /app`, copy lockfiles, `npm ci`, copy source, `npm run build` — **File/area:** `Dockerfile` — **Expected outcome:** Build stage produces `/app/dist` inside the image build.
- [x] T005 [US1] Add **nginx 1.27 Alpine runtime stage** to `Dockerfile`: copy `nginx.conf`, `COPY --from=build /app/dist` → `/usr/share/nginx/html`, **`EXPOSE 80`**, `CMD` nginx foreground — **File/area:** `Dockerfile` — **Expected outcome:** Final image serves static files on port 80; no Node in runtime layer.

**Checkpoint (MVP)**: `docker build -t gacha-game:local .` completes.

---

## Phase 4: User Story 2 — Run container locally (Priority: P1)

**Goal**: Document and verify run workflow (items 7–8).

**Independent test**: `docker run --rm -p 8080:80 gacha-game:local` → http://localhost:8080

- [x] T006 [US2] Add README **Docker — Build image** subsection with `docker build -t gacha-game:local .` and Docker prerequisite — **File/area:** `README.md` — **Expected outcome:** Developer can build from README alone.
- [x] T007 [US2] Add README **Docker — Run container** subsection with `docker run --rm -p 8080:80 gacha-game:local`, URL **http://localhost:8080**, and alternate port note (`-p 3000:80`) — **File/area:** `README.md` — **Expected outcome:** Developer can run and open the app from README alone.

---

## Phase 5: User Story 3 — Document and verify (Priority: P2)

**Goal**: Manual verification and gameplay parity (items 9–10).

**Independent test**: README Docker checklist completed; `src/` unchanged.

- [x] T008 [US3] Add README **Docker — Manual verification** checklist (build, run, UI loads, coins/pull/counters/timer, refresh reset, npm still works) per [quickstart.md](./quickstart.md) — **File/area:** `README.md` — **Expected outcome:** Step-by-step Docker verification without 50-pull statistics.
- [x] T009 [US3] Run `docker build` and `docker run`; complete README checklist on http://localhost:8080 — **File/area:** Docker CLI + browser — **Expected outcome:** Containerized app matches Phase 1–2 behavior in manual testing.
- [x] T010 [US3] Confirm no gameplay or persistence changes: `src/` unmodified for game logic; grep `src/` for no new `localStorage`/`sessionStorage`; optional diff review — **File/area:** `src/` — **Expected outcome:** Phase 3 only adds Docker/nginx/docs files; gacha rules unchanged.

**Checkpoint**: Phase 3 complete. **Stop** — no Compose, K8s, CI/CD, or backend.

---

## Dependencies & execution order

```text
T001 → T002 → T003 → T004 → T005 → T006 → T007 → T008 → T009 → T010
```

| User story | Tasks |
|------------|-------|
| US1 — Build image | T004–T005 |
| US2 — Run container | T006–T007 |
| US3 — Document & verify | T008–T010 |

### Mapping to requested coverage

| # | Requirement | Task(s) |
|---|-------------|---------|
| 1 | Confirm build command | T001 |
| 2 | `.dockerignore` | T002 |
| 3 | Multi-stage Dockerfile | T004–T005 |
| 4 | Node build stage | T004 |
| 5 | nginx serves `dist/` | T003, T005 |
| 6 | Expose port 80 | T005 |
| 7 | README build instructions | T006 |
| 8 | README run instructions | T007 |
| 9 | README Docker verification | T008, T009 |
| 10 | No gameplay change | T010 |

### Out of scope (no tasks)

Backend, database, authentication, Docker Compose, Kubernetes, AWS, CI/CD, gameplay changes, persistence changes, future-phase features.

---

## Task summary

| Phase | Task IDs | Count |
|-------|----------|-------|
| Setup | T001 | 1 |
| Foundational | T002–T003 | 2 |
| US1 — Build image | T004–T005 | 2 |
| US2 — Run container | T006–T007 | 2 |
| US3 — Verify | T008–T010 | 3 |
| **Total** | **T001–T010** | **10** |

**MVP scope**: T001–T005 (`docker build` works).

**Format validation**: All tasks include Task ID, file/area, and expected outcome.
