# Feature Specification: Phase 1 Gacha Pull Prototype

**Feature Branch**: `001-phase1-gacha-pull`  
**Created**: 2026-05-19  
**Status**: Draft  
**Input**: User description: "Create Phase 1 of the gacha game: a frontend-only playable pull prototype with Pull button, Common 90% / Rare 10%, no persistence, no backend or future systems."

> **Constitution**: Aligns with `.specify/memory/constitution.md` Phase 1 scope. Frontend-only; no auth, backend, databases, inventory, currency, or infrastructure beyond a locally runnable page.

## Clarifications

### Session 2026-05-19

- Q: What is the MVP implementation scope (task count)? → A: MVP is tasks **T001–T009** (**9 tasks**), not 12.
- Q: How should 90/10 pull odds be verified in Phase 1? → A: Confirm code uses `Math.random() < 0.1` for **Rare**; manual testing confirms both **Common** and **Rare** can appear—no strict statistical verification over a fixed pull count (e.g., 50 pulls).
- Q: Should Vite be pinned to a specific major version? → A: No—use Vite as a dev dependency without locking a major version unless the toolchain requires it.
- Q: Does Phase 1 allow any future systems? → A: No—Phase 1 stays **frontend-only**; no backend, persistence, auth, inventory, currency, or other future-phase systems.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Pull a Card (Priority: P1)

A player opens the game page, clicks **Pull**, and immediately sees whether they received a **Common** or **Rare** card. Each click produces a new random outcome with no cost.

**Why this priority**: This is the entire Phase 1 experience—the minimum playable gacha loop.

**Independent Test**: Open the page, click **Pull** at least once, and confirm a clearly labeled Common or Rare result appears on screen. Repeat clicks to confirm new outcomes each time.

**Acceptance Scenarios**:

1. **Given** the player is on the game page, **When** they view the page, **Then** they see a clearly labeled **Pull** button and a clean, uncluttered layout.
2. **Given** the player is on the game page, **When** they click **Pull**, **Then** the app displays exactly one pull result on screen showing either **Common** or **Rare**.
3. **Given** the player has just completed a pull, **When** they click **Pull** again, **Then** a new random result replaces or updates the displayed outcome (no pull limit, no cost).
4. **Given** the player performs pulls in one session, **When** outcomes are observed, **Then** both **Common** and **Rare** can appear; pull logic uses `Math.random() < 0.1` for **Rare** (otherwise **Common**)—no strict statistical quota over a fixed number of pulls in Phase 1.
5. **Given** the player has performed one or more pulls, **When** they refresh or reload the page, **Then** no prior pull history or results remain—the experience starts fresh.

---

### User Story 2 - Distinguish Card Rarity at a Glance (Priority: P2)

After each pull, the player can immediately tell which rarity they received without reading fine print or guessing.

**Why this priority**: Clear feedback makes the prototype feel complete and supports manual probability verification.

**Independent Test**: Perform a pull and confirm the displayed result explicitly identifies **Common** or **Rare** (e.g., visible label or equivalent clear indicator).

**Acceptance Scenarios**:

1. **Given** a pull has just completed, **When** the result is shown, **Then** the rarity name (**Common** or **Rare**) is visible on screen.
2. **Given** consecutive pulls, **When** results alternate between rarities, **Then** each new result remains easy to read and distinguish from the previous one.

---

### Edge Cases

- What happens on the very first visit before any pull? The page shows the **Pull** button; no result is required until the first click (or a neutral empty state is acceptable).
- What happens when the user clicks **Pull** rapidly many times? Each click produces a valid new outcome; the UI remains responsive and readable.
- What happens after refresh? All session state is cleared; the user sees the initial page state again.
- What happens if the user navigates away and returns without refresh? Behavior matches no-persistence scope: only in-memory session state may exist until refresh or tab close; nothing is saved for a later visit.

## Requirements *(mandatory)*

### Assumptions

- The player uses a modern desktop or mobile browser; no install or account is required.
- "Frontend-only" means all pull logic runs in the client; no server calls for pulls or storage.
- Infinite money means pulls never fail due to balance and no currency UI is shown.
- 90/10 odds are defined in code (`Math.random() < 0.1` → **Rare**); verification is by code review plus manual confirmation that both rarities can appear—not by statistical sampling over a fixed pull count.
- MVP implementation scope is tasks **T001–T009** (9 tasks) per [tasks.md](./tasks.md).
- Local dev uses **Vite** without pinning a specific major version unless the toolchain requires it.

### Functional Requirements

- **FR-001**: The system MUST present a single, simple game page with a button labeled **Pull**.
- **FR-002**: The system MUST run entirely in the browser with no backend services, APIs, or databases for Phase 1.
- **FR-003**: When the player clicks **Pull**, the system MUST randomly select and display exactly one outcome: **Common** or **Rare**.
- **FR-004**: Each pull MUST assign **Rare** when `Math.random() < 0.1` (10%) and **Common** otherwise (90%).
- **FR-005**: The system MUST display the pull result clearly on screen immediately after each click.
- **FR-006**: The player MUST be able to click **Pull** unlimited times without cost, cooldown, or currency deduction.
- **FR-007**: The system MUST NOT persist pull history, inventory, collection, accounts, or preferences across page refresh.
- **FR-008**: The system MUST NOT include authentication, user accounts, currency balances, inventory, collection screens, or multi-card galleries in Phase 1.
- **FR-009**: The system MUST NOT include Docker, Kubernetes, AWS, CI/CD pipelines, or deployment infrastructure as part of this feature scope.
- **FR-010**: The application MUST be runnable locally with minimal setup so a developer or player can verify behavior without external services.

### Key Entities

- **Pull**: A single gacha action triggered by the player; produces one **Pull Result** per click.
- **Pull Result**: The outcome of one pull—either **Common** or **Rare**—shown on screen after the click.
- **Card Rarity**: The classification of a pull result; only two values exist in Phase 1: **Common** (90%) and **Rare** (10%).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new player can open the page and complete their first pull within 10 seconds without instructions.
- **SC-002**: 100% of pull actions display a visible **Common** or **Rare** result on screen (no silent or missing outcomes).
- **SC-003**: `src/pull.js` (or equivalent) uses `Math.random() < 0.1` for **Rare**; manual testing shows at least one **Common** and one **Rare** outcome without requiring a fixed pull count or percentage band.
- **SC-004**: After page refresh, 0 prior pull results or player progress remain visible or recoverable.
- **SC-005**: The page contains only Phase 1 elements: primary layout, **Pull** control, and pull result display—no login, wallet, collection, or settings for future phases.
