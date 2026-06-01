# Feature Specification: Phase 7 localStorage Persistence

**Feature Branch**: `007-localstorage-persistence`  
**Created**: 2026-05-31  
**Status**: Draft  
**Input**: User description: "Add browser persistence using localStorage so game state survives refresh and same-origin container restarts—coins, inventory, counters, last pull, reset progress, validation on load."

> **Constitution**: Phase 7 adds **localStorage** persistence only (explicit expansion after Phases 1–6). Frontend-only; builds on existing pull, currency, card pool, and inventory. No backend, auth, cloud sync, or new gameplay mechanics.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Progress survives refresh (Priority: P1)

A player pulls cards, earns coins, and builds inventory; after refreshing the page or restarting the Docker container in the **same browser**, their progress is restored.

**Why this priority**: Persistence is the core value—without restore-on-load, saving is meaningless.

**Independent Test**: Pull cards, change coin balance, refresh browser; confirm coins, inventory, counters, and last pull match pre-refresh state.

**Acceptance Scenarios**:

1. **Given** a player with saved progress, **When** they reload the page, **Then** coin balance, all five card inventory counts, Common/Rare counters, and last pulled card display are restored.
2. **Given** a first-time visitor with no saved data, **When** the app loads, **Then** default starting state applies (e.g. **10** coins, zero inventory, zero counters, no last pull).
3. **Given** a player using the app via Docker on the same origin, **When** they refresh after playing, **Then** saved state restores the same as local dev.

---

### User Story 2 - Progress saves automatically (Priority: P1)

The game saves after meaningful state changes so the player does not need a manual Save button.

**Why this priority**: Automatic save prevents lost progress between actions and refresh.

**Independent Test**: Perform a pull and a passive coin grant; inspect that stored data reflects latest values (via refresh or devtools).

**Acceptance Scenarios**:

1. **Given** a successful paid pull, **When** the pull completes, **Then** saved data includes updated coins, inventory, counters, and last pulled card.
2. **Given** the passive coin timer grants **+1** coin, **When** the coin is added, **Then** saved data includes the updated coin balance.
3. **Given** normal gameplay, **When** no state-changing event occurs, **Then** no unnecessary save churn is required beyond defined triggers (pull success, passive coin).

---

### User Story 3 - Reset progress (Priority: P1)

A player can deliberately wipe saved progress and start fresh from defaults.

**Why this priority**: Required control for testing, mistakes, and replay; must clear storage explicitly.

**Independent Test**: Play, save state, click **Reset Progress**, confirm defaults and empty storage.

**Acceptance Scenarios**:

1. **Given** saved progress, **When** the player clicks **Reset Progress**, **Then** localStorage is cleared and the game shows default starting state.
2. **Given** a reset, **When** the player refreshes, **Then** default starting state remains (no stale save restored).
3. **Given** reset, **When** inventory is viewed, **Then** undiscovered cards show as hidden (**???**) per Phase 6 rules at zero quantity.

---

### User Story 4 - Corrupted save handled safely (Priority: P2)

If stored data is missing, invalid, or corrupted, the game fails safely to defaults rather than breaking.

**Why this priority**: Protects UX when storage is edited, truncated, or schema changes.

**Independent Test**: Place invalid JSON or incomplete object in storage; reload; confirm defaults.

**Acceptance Scenarios**:

1. **Given** no entry under the storage key, **When** the app loads, **Then** default state is used.
2. **Given** malformed or incomplete saved data, **When** the app loads, **Then** saved data is ignored and default state is used.
3. **Given** invalid saved data, **When** defaults load, **Then** the game remains playable (pull, inventory, coins).

---

### Edge Cases

- Blocked pull at **0** coins does not change saved state beyond what already persisted (no phantom inventory/counter updates).
- **Reset Progress** must clear the single storage key and in-memory state together.
- Only **localStorage** on the app origin—no cross-browser or cross-device sync.
- Private/incognito behavior follows browser rules (may not persist after session); no special handling required beyond spec.
- Automated unit tests may mock storage; CI must not depend on real browser localStorage unless isolated.

## Requirements *(mandatory)*

### Assumptions

- Builds on Phases 1–6: coins, passive income, 90/10 pulls, five-card inventory, undiscovered **???** display at quantity **0**, same-page UI.
- **Single storage key**: `gachaGameState` (JSON serialized object).
- Saved payload includes at minimum: coin balance, inventory counts for all five card ids, Common/Rare pull counters, last pulled card reference (if any).
- **Default starting state** matches current new-session behavior (e.g. **10** coins, all inventory **0**, counters **0**, no last pull, placeholder result text).
- Passive income **timer countdown** is not required to persist unless needed for coin accuracy; **coin balance** must persist after timer grants (save on grant per requirement).
- **sessionStorage**, **IndexedDB**, cookies, backend, and cloud sync are out of scope.
- README documents persistence and reset; optional automated tests for save/load/validate/reset pure logic.
- GitHub Actions continues to pass existing tests and builds (tests use mocks or Node-safe storage stubs).

### Explicitly Out of Scope

- Backend, APIs, database, authentication, user accounts
- sessionStorage, IndexedDB, cookies, cloud sync
- AWS, Kubernetes, deployment pipeline changes
- New gameplay features (new cards, shops, pity, etc.)
- Multi-tab sync conflict resolution beyond last-write-wins for localStorage
- Encrypting or compressing saved data

### Functional Requirements

- **FR-001**: The app MUST persist coin balance to **localStorage** under key **`gachaGameState`**.
- **FR-002**: The app MUST persist inventory counts for **Archer**, **Swordsman**, **Protector**, **Mage**, and **King**.
- **FR-003**: The app MUST persist Common and Rare pull counters when those counters remain in the UI/logic.
- **FR-004**: The app MUST persist the **last pulled card** when at least one successful pull has occurred.
- **FR-005**: On app load, the app MUST restore valid saved state from **localStorage** if present.
- **FR-006**: On app load with no saved data, the app MUST initialize **default starting state**.
- **FR-007**: After every **successful pull**, the app MUST update **localStorage**.
- **FR-008**: When the passive coin timer **grants a coin**, the app MUST update **localStorage**.
- **FR-009**: The UI MUST provide a **Reset Progress** button.
- **FR-010**: **Reset Progress** MUST clear saved **localStorage** data and reset the game to default starting state.
- **FR-011**: If saved data is invalid, incomplete, or corrupted, the app MUST ignore it and use default starting state.
- **FR-012**: Gameplay rules (costs, odds, card pools, inventory rules) MUST remain unchanged except that state persists across refresh.

### Key Entities

- **Saved game state**: Serialized snapshot under `gachaGameState`—coins, per-card inventory counts, Common/Rare counters, last pulled card identity/display fields sufficient to restore UI.
- **Default game state**: Factory defaults for a new player/session.
- **Last pulled card**: Most recent successful pull result used to repopulate the result area on load.
- **Validation result**: Valid → hydrate modules; invalid/missing → defaults.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: After refresh, players see the same coin balance and inventory counts they had before reload (when save was valid).
- **SC-002**: After a successful pull, refreshing within the same browser origin shows the same last pulled card and updated inventory.
- **SC-003**: **Reset Progress** returns all persisted fields to defaults and clears storage; a subsequent refresh stays at defaults.
- **SC-004**: Invalid or missing storage never prevents the game from loading in a playable default state.
- **SC-005**: Existing CI checks (unit tests, build) continue to pass after Phase 7.
- **SC-006**: No backend, account, or cloud sync is introduced; persistence is local to the browser origin only.
