# Feature Specification: Phase 5 Automated Tests for Game Logic

**Feature Branch**: `005-phase5-automated-tests`  
**Created**: 2026-05-19  
**Status**: Draft  
**Input**: User description: "Add automated tests for the existing game logic so CI can verify behavior automatically—unit tests for pull odds and coin/counter logic, test script, CI runs tests before builds, README docs; no gameplay changes."

> **Constitution**: Phase 5 adds automated unit tests and CI integration only. Builds on Phases 1–4. No new gameplay features, backend, database, auth, persistence, deployment, AWS, or Kubernetes.

## Clarifications

### Session 2026-05-19

- Q: Which test framework should Phase 5 use? → A: **Vitest** (Vite-native unit test runner)
- Q: How should pull rarity tests supply deterministic random values? → A: **Extract pure threshold helper** — test numeric inputs directly; `rollRarity()` still uses `Math.random()` in production
- Q: What coin/counter behavior should Phase 5 unit tests cover? → A: **`gameState.js` only** — spend, add, record pull, balances, and counters (no timer tests)
- Q: How should tests reset `gameState.js` session state between cases? → A: **Export `resetGameState()`** — resets coins to 10 and counters to 0; used in test `beforeEach`
- Q: What should `npm test` run? → A: **`vitest run`** — single run, exit code on failure; used locally and in CI

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Verify pull rarity logic automatically (Priority: P1)

A developer runs automated tests that confirm pull results follow the **90% Common / 10% Rare** rule at known random boundaries, without manual clicking.

**Why this priority**: Pull odds are core gacha behavior and the highest-risk regression.

**Independent Test**: Run the project test command locally; pull logic tests pass with deterministic inputs at the **0.1** threshold.

**Acceptance Scenarios**:

1. **Given** a random value strictly below **0.1**, **When** pull rarity is resolved, **Then** the result is **Rare**.
2. **Given** a random value of **0.1** or greater, **When** pull rarity is resolved, **Then** the result is **Common**.
3. **Given** production pull behavior, **When** a player pulls in the app, **Then** odds and outcomes are unchanged from Phases 1–2.

---

### User Story 2 - Verify coin and counter logic automatically (Priority: P1)

A developer runs automated tests for coin spending, coin earning, and session counters where the logic is structured in a testable way.

**Why this priority**: Currency and counters are Phase 2 core behavior; tests catch regressions before merge.

**Independent Test**: Run the test command; coin and counter unit tests pass for spend, add, and record operations.

**Acceptance Scenarios**:

1. **Given** starting coins (**10**), **When** a coin is spent successfully, **Then** balance decreases by **1**.
2. **Given** **0** coins, **When** spend is attempted, **Then** spend fails and balance stays **0**.
3. **Given** a recorded pull, **When** rarity is **common** or **rare**, **Then** the matching session counter increments by **1**.
4. **Given** a coin is added, **When** balance is read, **Then** coins increase by **1**.

---

### User Story 3 - CI runs tests before builds (Priority: P1)

When a pull request or push to **main** triggers CI, automated tests run and must pass before frontend and Docker builds proceed.

**Why this priority**: CI is the enforcement mechanism for Phase 5 value.

**Independent Test**: Open a PR to **main** and confirm the CI workflow includes a test step that runs before build steps.

**Acceptance Scenarios**:

1. **Given** a pull request to **main**, **When** CI runs, **Then** tests execute after dependency install and before frontend build.
2. **Given** a failing test, **When** CI runs, **Then** the workflow fails and does not report success.
3. **Given** all tests pass, **When** CI continues, **Then** existing frontend and Docker build steps still run.

---

### User Story 4 - Run tests from project docs (Priority: P2)

A developer reads the README and knows how to run tests locally without opening test files.

**Why this priority**: Local feedback matches CI for a learning project.

**Independent Test**: Follow README test instructions only; successfully run the documented test command.

**Acceptance Scenarios**:

1. **Given** the README, **When** a developer follows test instructions, **Then** they can run tests from the repo root.
2. **Given** passing tests locally, **When** the same command runs in CI, **Then** results are consistent.

---

### Edge Cases

- Pull boundary at exactly **0.1** MUST yield **Common** (not Rare).
- Spending with insufficient coins MUST NOT change counters.
- Session state MUST be reset between tests to avoid order-dependent failures.
- Passive income timer (**+1 coin/minute** in the UI) is **out of scope** for Phase 5 unit tests.
- Failed tests MUST fail CI; no deployment or image publishing is added.
- Documentation-only changes still run the full CI pipeline including tests (acceptable).

## Requirements *(mandatory)*

### Assumptions

- Project is a frontend-only gacha app (Phases 1–4 complete) with existing production build and CI workflow on **main**.
- A lightweight unit test framework appropriate for the frontend toolchain is added (resolved: **Vitest** — see Clarifications).
- Refactoring game logic is allowed **only** to make behavior testable; gameplay rules stay unchanged.
- Pull logic uses a pure threshold at **0.1**; tests use deterministic numeric inputs via a small extracted helper (see Clarifications).
- Coin/counter tests cover the testable session-state module only; timer-driven passive income remains manual/UI-tested.
- Tests are **unit** tests for logic modules; no browser end-to-end suite in Phase 5.
- CI triggers unchanged from Phase 4 (pull requests and pushes to **main**).

### Explicitly Out of Scope

- New gameplay features or rule changes
- Backend, database, authentication, persistence
- AWS, Kubernetes, deployment, Docker image publishing
- Major app rewrite
- Browser E2E or visual regression tests
- Automated tests for passive income timer behavior
- Test coverage thresholds or reporting gates (Phase 5)

### Functional Requirements

- **FR-001**: The project MUST add an automated unit test framework appropriate for the existing frontend app.
- **FR-002**: The project MUST include unit tests for pull probability logic with deterministic inputs at the **0.1** threshold.
- **FR-003**: Tests MUST verify **Rare** when the random value is below **0.1**.
- **FR-004**: Tests MUST verify **Common** when the random value is **0.1** or greater.
- **FR-005**: The project MUST include unit tests for coin and counter behavior where logic is structured in a testable way (spend, add, record, balance reads).
- **FR-006**: The project MUST expose a single test command in package configuration (e.g. **`npm test`**) that runs all unit tests once and exits non-zero on failure.
- **FR-007**: GitHub Actions CI MUST run the test command after dependency install and **before** frontend and Docker builds.
- **FR-008**: README MUST document how to run tests locally and that CI runs the same command.
- **FR-009**: Game behavior (odds, coin rules, UI flows) MUST NOT change; refactors limited to testability.

### Key Entities

- **Pull result**: Rarity (**Common** or **Rare**) derived from random threshold **0.1** (below → Rare; at/above → Common).
- **Session coins**: Integer balance starting at **10**; each pull costs **1**; passive **+1** per minute remains UI/timer-driven and untested in Phase 5.
- **Session counters**: In-memory **Common** and **Rare** pull counts updated on successful pulls.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Developers can run one documented test command locally and see all unit tests pass or fail clearly.
- **SC-002**: Pull logic tests cover at minimum the **0.1** boundary (below → Rare, at/above → Common).
- **SC-003**: CI runs automated tests before build steps; a deliberate test failure fails the workflow.
- **SC-004**: README lists the local test command and states that CI runs the same checks.
- **SC-005**: No new gameplay features, persistence, backend, or deployment capabilities are introduced.
- **SC-006**: Existing manual gameplay behavior (10 coins, 1 coin/pull, 90/10 odds, session counters) remains unchanged after Phase 5.
