# Feature Specification: Phase 4 GitHub Actions CI Pipeline

**Feature Branch**: `004-phase4-github-ci`  
**Created**: 2026-05-20  
**Status**: Draft  
**Input**: User description: "Add GitHub Actions CI that validates npm install, frontend build, and Docker image build on pushes and PRs to main—no deployment or gameplay changes."

> **Constitution**: Phase 4 explicitly adds CI/CD workflow automation (overrides general “defer CI/CD” for earlier phases). Builds on Phases 1–3. No deployment, image publishing, backend, database, auth, gameplay, or persistence changes.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Automatic validation on pull requests (Priority: P1)

A contributor opens a pull request against **main** and the repository automatically runs checks that install dependencies, build the frontend, and build the Docker image. If any step fails, the pull request check fails visibly.

**Why this priority**: PR validation is the primary CI value—catch broken builds before merge.

**Independent Test**: Open a PR to **main** (or simulate with a push to a PR branch) and confirm the workflow runs and reports pass/fail status on the PR.

**Acceptance Scenarios**:

1. **Given** a pull request targeting **main**, **When** the workflow triggers, **Then** it runs dependency installation, frontend build, and Docker image build steps.
2. **Given** all build steps succeed, **When** the workflow completes, **Then** the CI check shows **success**.
3. **Given** the frontend build fails (e.g., intentional break in a test branch), **When** the workflow runs, **Then** the CI check shows **failure** and the pull request is blocked from passing that check.
4. **Given** the Docker image build fails, **When** the workflow runs, **Then** the CI check shows **failure**.

---

### User Story 2 - Automatic validation on pushes to main (Priority: P1)

When changes are pushed directly to **main**, the same CI pipeline runs to keep the default branch healthy.

**Why this priority**: Equal protection for direct pushes and merged PRs on **main**.

**Independent Test**: Push a commit to **main** and confirm the workflow runs with the same steps as on pull requests.

**Acceptance Scenarios**:

1. **Given** a push to **main**, **When** the workflow triggers, **Then** it performs the same install, frontend build, and Docker build steps as on pull requests.
2. **Given** a successful push to **main**, **When** the workflow completes, **Then** all CI steps pass.

---

### User Story 3 - Understand CI from project docs (Priority: P2)

A developer reads the README and understands what CI validates without opening the workflow file.

**Why this priority**: Onboarding and transparency for a learning project.

**Independent Test**: Read the README CI section only and list the three things CI checks (dependencies/build, frontend build, Docker build).

**Acceptance Scenarios**:

1. **Given** the project README, **When** a developer reads the CI section, **Then** they see that CI runs on pull requests and pushes to **main**.
2. **Given** the README CI section, **When** reviewed, **Then** it states that CI verifies dependency install, frontend production build, and Docker image build—and fails if either build fails.

---

### Edge Cases

- What if only documentation changes? CI still runs full build steps (acceptable; ensures pipeline stays green).
- What if Docker is unavailable in the runner? Workflow MUST use a hosted runner with Docker available (standard GitHub-hosted runners support this).
- What if **main** is renamed? Workflow triggers MUST target the repository’s default branch name **main** as specified.
- Failed CI on a PR does not deploy anything and does not alter game behavior.

## Requirements *(mandatory)*

### Assumptions

- Repository is hosted on **GitHub** with GitHub Actions enabled.
- Default branch is **main**.
- Existing project already supports `npm install`, `npm run build`, and `docker build` locally (Phase 1–3).
- CI uses a single workflow file at **`.github/workflows/ci.yml`** (or equivalent path under `.github/workflows/`).
- No secrets required for Phase 4 (no registry push, no cloud deploy).
- Game source under the app is **unchanged**; CI only adds workflow and README documentation.

### Functional Requirements

- **FR-001**: The project MUST include a GitHub Actions workflow that triggers on **pull requests** and on **pushes** to **main**.
- **FR-002**: The workflow MUST install project dependencies before building.
- **FR-003**: The workflow MUST run the frontend production build and **fail the workflow** if that build fails.
- **FR-004**: The workflow MUST build the Docker image (using the existing Dockerfile) and **fail the workflow** if the image build fails.
- **FR-005**: The workflow MUST NOT deploy the app, publish Docker images to a registry, or modify production infrastructure.
- **FR-006**: The README MUST include a brief **CI** section describing what the workflow checks and when it runs.
- **FR-007**: Phase 4 MUST NOT change gacha gameplay, economy rules, persistence behavior, or application UI copy (except README CI documentation).
- **FR-008**: Phase 4 MUST NOT add backend services, databases, authentication, Kubernetes, AWS resources, or Docker Compose.

### Key Entities

- **CI Workflow**: Automated pipeline triggered by GitHub events (PR, push to **main**).
- **Build Job**: Single logical run that executes install → frontend build → Docker build.
- **Check Result**: Pass/fail status reported on commits and pull requests.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A pull request to **main** triggers CI within the normal GitHub Actions startup window and completes with a visible pass/fail status.
- **SC-002**: A push to **main** triggers the same CI workflow with pass/fail status on the commit.
- **SC-003**: When the frontend build is broken, CI reports **failure** (verified once on a test branch or documented manual simulation).
- **SC-004**: When the Docker build is broken, CI reports **failure** (verified once on a test branch or documented manual simulation).
- **SC-005**: When both builds succeed, CI reports **success** on a clean **main** branch.
- **SC-006**: README CI section allows a new developer to name all three validation steps (install, frontend build, Docker build) without reading workflow YAML.

## Explicitly Out of Scope (Phase 4)

- Deployment (GitHub Pages, AWS, etc.)
- Docker image push to registry (GHCR, Docker Hub)
- Kubernetes, AWS infrastructure, Docker Compose
- Backend, database, authentication
- Automated gameplay or unit test suites (unless added in a future phase)
- Gameplay, persistence, or app rewrite
- Required repository secrets for Phase 4
