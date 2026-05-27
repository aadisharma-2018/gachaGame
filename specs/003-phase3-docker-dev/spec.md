# Feature Specification: Phase 3 Dockerized Local Development

**Feature Branch**: `003-phase3-docker-dev`  
**Created**: 2026-05-20  
**Status**: Draft  
**Input**: User description: "Add Docker support so the existing frontend Vite gacha game can be built and run locally in a container, with no gameplay changes."

> **Constitution**: Phase 3 explicitly adds Docker (overrides the general “defer Docker” rule for earlier phases). Builds on [Phase 1](../001-phase1-gacha-pull/spec.md) and [Phase 2](../002-phase2-currency-counters/spec.md). No backend, database, auth, persistence changes, Compose, K8s, AWS, or CI/CD in this phase.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Build a Docker Image (Priority: P1)

A developer clones the repository and builds a production-style Docker image for the gacha game without changing application source behavior.

**Why this priority**: Without a reproducible image build, containerized run is impossible.

**Independent Test**: Run the documented `docker build` command from the repo root; build completes successfully and produces a tagged image.

**Acceptance Scenarios**:

1. **Given** a machine with Docker installed, **When** the developer runs the documented build command, **Then** the image build completes without error.
2. **Given** a successful build, **When** the developer inspects the result, **Then** a named image exists locally ready to run.
3. **Given** the build context, **When** unnecessary files are excluded, **Then** `node_modules` and other dev artifacts are not required inside the final runtime image beyond the built static assets.

---

### User Story 2 - Run the Game in a Container (Priority: P1)

A developer runs the container locally and plays the same gacha game in the browser as when using `npm run dev` or the production build preview.

**Why this priority**: Delivers the core Phase 3 outcome—Docker-based local run.

**Independent Test**: Run the documented `docker run` command, open the published URL/port, and perform a pull with coins and counters working.

**Acceptance Scenarios**:

1. **Given** a built image, **When** the developer runs the documented `docker run` command with port mapping, **Then** the app is reachable in the browser (e.g., mapped host port).
2. **Given** the containerized app is open, **When** the player uses **Pull**, coins, passive income timer, and Common/Rare counts behave the same as the non-Docker local build.
3. **Given** the container is stopped and removed, **When** the developer runs a fresh container, **Then** session state still resets on browser refresh (no new persistence layer introduced).

---

### User Story 3 - Document and Verify Docker Workflow (Priority: P2)

A developer follows README instructions to build, run, and manually verify Docker parity without reading source implementation details.

**Why this priority**: Makes Phase 3 usable for learning and onboarding.

**Independent Test**: A new developer follows only the README Docker section to build, run, and complete the verification checklist.

**Acceptance Scenarios**:

1. **Given** the project README, **When** the developer reads the Docker section, **Then** it includes build command, run command, which URL/port to open, and prerequisites (Docker installed).
2. **Given** Docker and npm workflows, **When** the developer compares behavior, **Then** Phase 1–2 gameplay rules (pull odds, coin cost, passive coin, counters, refresh reset) match between container and existing local npm workflow.

---

### Edge Cases

- What if port 8080 (or the documented port) is already in use? Documentation SHOULD mention mapping a different host port (e.g., `-p 3000:80`).
- What if Docker build fails due to missing `package-lock.json`? Build SHOULD use the same dependency install approach as local npm (lockfile committed or documented).
- What if the player refreshes the browser while the container keeps running? In-memory session rules unchanged—state resets on refresh, not on container restart alone.
- Build failures due to network during `npm install` in the build stage are environment issues; the spec requires a standard multi-stage frontend build pattern, not offline builds.

## Requirements *(mandatory)*

### Assumptions

- The app remains **frontend-only** Vite + vanilla JavaScript; no new runtime services.
- **Production-style** container delivery is acceptable: build static assets in a Node stage, serve with **nginx** in the final image.
- Default container HTTP port is **80** inside the container; host port mapping is documented (e.g., host `8080` → container `80`).
- Game behavior and in-memory session rules from Phase 2 are **unchanged**; Docker is packaging and serving only.
- **Docker Compose** is out of scope for Phase 3.
- Developers have Docker Engine (or Docker Desktop) installed locally.

### Functional Requirements

- **FR-001**: The project MUST include a `Dockerfile` suitable for a Vite frontend app using a multi-stage build (Node build → nginx serve).
- **FR-002**: The project MUST include a `.dockerignore` that excludes `node_modules`, `dist`, git metadata, and other unnecessary context from the build.
- **FR-003**: A developer MUST be able to build the image with a documented `docker build` command from the repository root.
- **FR-004**: A developer MUST be able to run the app with a documented `docker run` command that publishes HTTP to the host.
- **FR-005**: The containerized app MUST serve the built static site such that all Phase 1–2 player-visible behavior works in the browser (Pull, 90/10 odds, coins, timer, counters, insufficient-coins message, refresh reset).
- **FR-006**: The README MUST include a **Docker** section with prerequisites, build steps, run steps, how to open the app, and manual verification steps.
- **FR-007**: Manual verification MUST include confirming gameplay parity with the existing npm-based local workflow (no new statistical or persistence requirements).
- **FR-008**: Phase 3 MUST NOT add backend services, databases, authentication, `localStorage`/`sessionStorage` persistence, Docker Compose, Kubernetes, AWS, or CI/CD.
- **FR-009**: Phase 3 MUST NOT change gacha pull logic, economy rules, or UI copy except documentation references to Docker.

### Key Entities

- **Docker image**: Immutable package containing the built static app and nginx runtime.
- **Container**: Running instance of the image, mapping container port 80 to a host port.
- **Static build output**: Production Vite `dist/` assets copied into the nginx stage.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer with Docker installed can build the image on first attempt using only README instructions (assuming network for dependency download).
- **SC-002**: A developer can open the containerized app in a browser and complete one paid **Pull** within 30 seconds of `docker run`.
- **SC-003**: Side-by-side manual check: container vs npm local—same visible rules for coins (start 10, cost 1), passive coin timer, counters, and **Not enough coins.** at 0 balance.
- **SC-004**: Browser refresh in the containerized app resets session state to initial values (coins 10, counts 0) with no cross-session storage.
- **SC-005**: README Docker section includes at least: build command, run command, URL/port to visit, and a short verification checklist.

## Explicitly Out of Scope (Phase 3)

- Docker Compose, Kubernetes, cloud deploy, CI/CD pipelines
- Backend API, database, authentication, user accounts
- Gameplay, economy, or persistence changes
- `localStorage` / `sessionStorage` / IndexedDB
- Inventory or collection UI
- Environment-variable–driven configuration (unless already required by the app—currently none)
