# Feature Specification: Phase 2 Currency and Pull Counters

**Feature Branch**: `002-phase2-currency-counters`  
**Created**: 2026-05-20  
**Status**: Draft  
**Input**: User description: "Create Phase 2: temporary currency and pull counters — in-memory coins, pull cost, passive income, session Common/Rare counts, no persistence."

> **Constitution**: Builds on Phase 1 ([001-phase1-gacha-pull](../001-phase1-gacha-pull/spec.md)). Frontend-only; in-memory state only. No auth, backend, databases, `localStorage`, `sessionStorage`, inventory pages, or infrastructure beyond local run.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Spend Coins to Pull (Priority: P1)

A player opens the game with a starting coin balance, spends 1 coin per pull when they can afford it, and still receives **Common** or **Rare** results using the existing 90/10 odds. When they cannot afford a pull, they see a clear message and no card is drawn.

**Why this priority**: Currency gating the pull is the core new mechanic; without it, Phase 2 delivers no value.

**Independent Test**: Load the page (10 coins shown) → click **Pull** → balance decreases by 1 and a **Common** or **Rare** result appears → repeat until 0 coins → click **Pull** → see "Not enough coins." and no new pull outcome.

**Acceptance Scenarios**:

1. **Given** a fresh page load, **When** the player views the game, **Then** the coin balance shows **10** coins.
2. **Given** the player has at least 1 coin, **When** they click **Pull**, **Then** the balance decreases by 1, a pull executes, and **Common** or **Rare** is displayed per existing 90/10 rules.
3. **Given** the player has 0 coins, **When** they click **Pull**, **Then** no pull occurs, the last result (if any) is unchanged, and a clear message such as **Not enough coins.** is shown.
4. **Given** the player has 1 coin, **When** they click **Pull** once successfully, **Then** the balance becomes 0 and the next **Pull** attempt is blocked with the insufficient-coins message.

---

### User Story 2 - Earn Passive Coins Over Time (Priority: P2)

While the game page remains open, the player automatically receives 1 additional coin every 60 seconds, allowing more pulls without refresh.

**Why this priority**: Passive income extends play in a session and is explicitly requested; it depends on visible balance (US1) but is independently testable with a timer.

**Independent Test**: Load with 0 coins (after spending all) or note starting balance → wait 60+ seconds without refreshing → confirm balance increased by 1 → repeat to observe further gains.

**Acceptance Scenarios**:

1. **Given** the page is open, **When** 60 seconds elapse, **Then** the coin balance increases by 1.
2. **Given** the page is open and multiple 60-second intervals pass, **When** the player checks the balance, **Then** it reflects one coin gained per full interval (e.g., 2 coins after 120 seconds from a baseline).
3. **Given** the player refreshes the page, **When** the session restarts, **Then** passive timers and balance reset per session rules (no carry-over).

---

### User Story 3 - Track Session Pull Counts (Priority: P2)

The player sees how many **Common** and **Rare** cards they have pulled during the current session. Counts update only on successful paid pulls.

**Why this priority**: Session counters reinforce feedback alongside currency; they must not increment on blocked pulls.

**Independent Test**: Perform pulls that succeed → **Common** count and **Rare** count update correctly → attempt pull at 0 coins → counts unchanged → refresh → counts reset to zero.

**Acceptance Scenarios**:

1. **Given** a fresh session, **When** the player views the page, **Then** Common and Rare pull counts are visible and start at **0**.
2. **Given** a successful pull that results in **Common**, **When** the pull completes, **Then** the Common pull count increases by 1 and the Rare count is unchanged.
3. **Given** a successful pull that results in **Rare**, **When** the pull completes, **Then** the Rare pull count increases by 1 and the Common count is unchanged.
4. **Given** the player attempts **Pull** with 0 coins, **When** the action is blocked, **Then** neither Common nor Rare counts change.
5. **Given** the player has recorded pulls in a session, **When** they refresh the page, **Then** both counts reset to **0** along with coin balance.

---

### Edge Cases

- What happens if the player clicks **Pull** rapidly with exactly 1 coin? Only one successful pull occurs; balance and counts reflect a single paid pull.
- What happens when passive income and a pull occur close together? Balance updates remain correct (no negative balance; no free pulls).
- What happens on refresh? Coins reset to 10, Common and Rare counts reset to 0, passive timer restarts, prior pull result display resets per Phase 1 acceptable initial state.
- What happens if the browser tab is backgrounded? Passive coin gain continues while the page is open (standard timer behavior); no persistence when the tab is closed and the session ends via refresh.

## Requirements *(mandatory)*

### Assumptions

- Phase 1 pull behavior (**Common** 90%, **Rare** 10%, `Math.random() < 0.1` for **Rare**) remains unchanged for successful paid pulls.
- "Temporary" and "in-memory" mean JavaScript variables only; no `localStorage`, `sessionStorage`, IndexedDB, or server storage.
- Starting balance is always **10** coins on each fresh page load.
- Pull cost is fixed at **1** coin per successful pull.
- Passive income is **1** coin per **60** seconds for the lifetime of the open page session.
- Insufficient-coins message copy is **Not enough coins.** (or equivalent clear wording shown in the result or status area).
- Implementation extends the existing Phase 1 single-page app; no full rewrite.

### Functional Requirements

- **FR-001**: On first load of a session, the system MUST initialize the coin balance to **10**.
- **FR-002**: The system MUST display the current coin balance visibly on the game page at all times.
- **FR-003**: Each successful **Pull** MUST cost **1** coin, deducted before or as part of executing the pull.
- **FR-004**: When the player has at least **1** coin and clicks **Pull**, the system MUST perform the existing random **Common**/**Rare** pull and update the displayed result.
- **FR-005**: When the player has **0** coins and clicks **Pull**, the system MUST NOT perform a pull and MUST show a clear insufficient-coins message (e.g., **Not enough coins.**).
- **FR-006**: While the page remains open in the current session, the system MUST add **1** coin to the balance every **60** seconds.
- **FR-007**: The system MUST display the current session count of **Common** pulls and **Rare** pulls separately on the page.
- **FR-008**: On each successful pull resulting in **Common**, the Common pull count MUST increase by **1**.
- **FR-009**: On each successful pull resulting in **Rare**, the Rare pull count MUST increase by **1**.
- **FR-010**: Blocked pulls (0 coins) MUST NOT change Common or Rare pull counts.
- **FR-011**: On page refresh, the system MUST reset coin balance to **10**, Common count to **0**, Rare count to **0**, and passive-income timing for the new session.
- **FR-012**: The system MUST NOT use `localStorage`, `sessionStorage`, databases, backends, APIs, authentication, or user accounts for coin or count data.
- **FR-013**: The system MUST NOT add inventory screens, collection pages, Docker, Kubernetes, AWS, CI/CD, or other future-phase systems in Phase 2.

### Key Entities

- **Coin Balance**: Non-negative integer representing spendable currency for the current session; starts at 10; changes on pulls (−1) and passive income (+1 per interval).
- **Pull** (paid): A gacha action that costs 1 coin and produces a **Pull Result** (**Common** or **Rare**) when affordable.
- **Pull Result**: Outcome of a paid pull—unchanged rarity rules from Phase 1.
- **Common Pull Count**: Session tally of successful **Common** pulls.
- **Rare Pull Count**: Session tally of successful **Rare** pulls.
- **Session**: Browser page lifetime until refresh; all Phase 2 state is discarded on refresh.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new player can identify their coin balance within 3 seconds of opening the page.
- **SC-002**: 100% of successful pulls reduce balance by exactly 1 coin and show **Common** or **Rare**.
- **SC-003**: 100% of pull attempts at 0 coins show an insufficient-coins message and produce no new pull outcome or count change.
- **SC-004**: After 60 seconds with the page open, balance increases by at least 1 coin without user action (verified manually with a clock).
- **SC-005**: After page refresh, balance is 10 and both pull counts are 0 with no recovered prior session values.
- **SC-006**: Common and Rare session counts match the number of successful pulls of each rarity observed during manual testing.
- **SC-007**: Phase 1 pull odds behavior remains verifiable on paid pulls (code uses `Math.random() < 0.1` for **Rare**; both rarities can appear over manual testing).

## Explicitly Out of Scope (Phase 2)

- `localStorage`, `sessionStorage`, or any cross-refresh persistence
- Backend services, APIs, databases
- Authentication and user accounts
- Inventory or card collection UI
- Docker, Kubernetes, AWS, CI/CD
- Variable pull costs, shops, or multi-currency economies
- Features beyond currency, passive income, and session counters unless a later phase requests them
