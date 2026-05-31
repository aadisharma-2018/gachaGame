# Feature Specification: Phase 6 Expanded Card Pool and Session Inventory

**Feature Branch**: `006-card-pool-inventory`  
**Created**: 2026-05-31  
**Status**: Draft  
**Input**: User description: "Expand the card system from generic Common/Rare results into specific cards with emoji visuals, and add a same-page session inventory—90/10 rarity odds unchanged, in-memory only."

> **Constitution**: Phase 6 adds card variety and session inventory on the existing single page. Builds on Phases 1–5 (pull, currency, Docker, CI, automated tests). Frontend-only; no persistence, backend, auth, routing, or external assets.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Pull a specific card (Priority: P1)

A player clicks **Pull**, spends a coin, and sees a **specific** card drawn from the expanded pool—not just a generic Common or Rare label—with name, rarity, and emoji on screen.

**Why this priority**: Specific card pulls are the core gacha upgrade; without them there is no expanded pool.

**Independent Test**: Perform paid pulls and observe named cards with emojis; Common pulls show one of three Common cards; Rare pulls show one of two Rare cards.

**Acceptance Scenarios**:

1. **Given** the player has coins, **When** they pull and the result is **Common**, **Then** the result shows one of **Archer**, **Swordsman**, or **Protector** with the correct emoji and **Common** rarity.
2. **Given** the player has coins, **When** they pull and the result is **Rare**, **Then** the result shows **Mage** or **King** with the correct emoji and **Rare** rarity.
3. **Given** many pulls over a session, **When** results are reviewed, **Then** overall rarity remains approximately **90% Common / 10% Rare** (same odds as before).
4. **Given** a Common outcome, **When** the specific card is chosen, **Then** each of the three Common cards can appear (uniform random within the Common pool).
5. **Given** a Rare outcome, **When** the specific card is chosen, **Then** each of the two Rare cards can appear (uniform random within the Rare pool).

---

### User Story 2 - View session inventory (Priority: P1)

A player opens an **Inventory** panel on the same page to see how many of each card they have collected this session.

**Why this priority**: Inventory completes the collection loop started by specific card pulls.

**Independent Test**: Pull cards, toggle inventory, and confirm counts match pulls; refresh and confirm reset.

**Acceptance Scenarios**:

1. **Given** the main game page, **When** the player clicks **Inventory**, **Then** an inventory panel shows or hides on the same page (no navigation).
2. **Given** the inventory panel is visible, **When** the player views it, **Then** all **five** cards are listed: Archer, Swordsman, Protector, Mage, King.
3. **Given** each inventory row, **When** displayed, **Then** it shows emoji, card name, rarity, and **quantity owned** this session.
4. **Given** a successful pull of a specific card, **When** inventory is viewed, **Then** that card’s quantity increases by **1**.
5. **Given** the player has not pulled a card yet, **When** inventory is viewed, **Then** that card’s quantity is **0**.
6. **Given** the player refreshes the page, **When** the app reloads, **Then** all inventory quantities reset to **0** (in-memory only).

---

### User Story 3 - Existing session mechanics unchanged (Priority: P2)

A returning player still uses coins, counters, and pull rules from earlier phases while gaining card-specific results and inventory.

**Why this priority**: Phase 6 extends—not replaces—currency and rarity tracking.

**Independent Test**: Verify coin cost, insufficient-coins message, passive income, and Common/Rare session counters (if retained) still behave as before.

**Acceptance Scenarios**:

1. **Given** a new session, **When** the page loads, **Then** coin balance and pull cost rules from Phase 2 still apply.
2. **Given** **0** coins, **When** the player clicks **Pull**, **Then** **Not enough coins.** appears and no card is granted.
3. **Given** successful pulls, **When** Common or Rare results occur, **Then** session **Common** and **Rare** pull counters still increment appropriately (unless cleanly superseded by inventory-only display—see Assumptions).
4. **Given** Phase 5 automated tests, **When** this phase ships, **Then** pull rarity odds logic remains **90% / 10%** at the rarity step.

---

### Edge Cases

- Pull blocked at **0** coins must not increment inventory or counters.
- Inventory toggle can be opened with **0** of all cards (all quantities zero).
- Same card pulled multiple times accumulates quantity (e.g., two Archers → quantity **2**).
- Emoji are the only card visuals—no broken image placeholders or external URLs.
- Page refresh clears inventory, coins reset to starting balance, counters reset per Phase 2 rules.
- No `localStorage`, `sessionStorage`, or other persistence APIs for inventory.

## Requirements *(mandatory)*

### Assumptions

- Builds on the existing frontend-only app (Vite, single page, Phases 1–5 complete).
- **Card catalog** is fixed at **5** cards for this phase (static data, not loaded from a server).
- **Rarity step** remains **90% Common / 10% Rare** before selecting a specific card within the pool.
- **Within-pool selection** is uniform: each Common card has equal chance given a Common result; each Rare card has equal chance given a Rare result.
- **Inventory** is a toggle panel on the same page—not a separate route or modal requiring navigation.
- **Common/Rare counters** from Phase 2 remain visible and functional unless implementation replaces them with equivalent information from inventory without losing rarity totals (per user note).
- Docker and CI require no workflow changes unless the production build breaks; normal build compatibility only.
- Manual verification steps may be added to README; no new automated test scope required in this spec unless planning adds updates to existing tests.

### Explicitly Out of Scope

- Persistence (`localStorage`, `sessionStorage`, IndexedDB, backend sync)
- Backend, APIs, database, authentication
- Separate inventory page or client-side routing
- Image files, CDN assets, or AI-generated art
- Docker, GitHub Actions, AWS, Kubernetes, or deployment changes (except fixing build breakage if any)
- New currency systems, gacha banners, pity mechanics, or trading

### Functional Requirements

- **FR-001**: The game MUST define **3 Common cards**: Archer (🏹), Swordsman (⚔️), Protector (🛡️).
- **FR-002**: The game MUST define **2 Rare cards**: Mage (🪄), King (👑).
- **FR-003**: Pull rarity odds MUST remain **90% Common** and **10% Rare** at the rarity determination step.
- **FR-004**: On a **Common** rarity result, the app MUST randomly select **one** of the three Common cards with equal probability.
- **FR-005**: On a **Rare** rarity result, the app MUST randomly select **one** of the two Rare cards with equal probability.
- **FR-006**: After a successful paid pull, the result area MUST display **card name**, **rarity label**, and **emoji**.
- **FR-007**: The page MUST include an **Inventory** button on the same screen as **Pull**.
- **FR-008**: Clicking **Inventory** MUST show or hide a same-page inventory panel (toggle).
- **FR-009**: The inventory panel MUST list all **five** cards with emoji, name, rarity, and session **quantity owned**.
- **FR-010**: On each successful pull, the pulled card’s inventory quantity MUST increase by **1**.
- **FR-011**: Inventory quantities MUST start at **0** and reset on page refresh; no cross-session storage.
- **FR-012**: Session **Common** and **Rare** pull counters SHOULD remain functional; they MAY be removed only if inventory and result display preserve equivalent rarity tracking without loss of clarity.
- **FR-013**: Blocked pulls (insufficient coins) MUST NOT update inventory or increment counters.

### Key Entities

- **Card**: A collectible unit with **id/name**, **rarity** (Common or Rare), and **emoji** visual. Five fixed instances in the catalog.
- **Card catalog**: Static set of all pullable cards grouped by rarity pool (3 Common, 2 Rare).
- **Pull result**: Outcome of a paid pull—rarity step then specific **Card**, shown in the result area.
- **Inventory entry**: Per-card **quantity owned** during the current browser session (integer ≥ 0).
- **Session state**: Coins, optional Common/Rare counters, inventory counts—all in memory until refresh.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can pull and see one of **five** named cards with emoji, name, and rarity on every successful paid pull.
- **SC-002**: Over many pulls in one session, **Common** results occur approximately **90%** and **Rare** approximately **10%** of the time (rarity step unchanged).
- **SC-003**: Players can open inventory on the same page and see all **five** cards with correct session quantities after pulling.
- **SC-004**: Pulling the same card multiple times increases that card’s inventory quantity accordingly (e.g., 3 Archer pulls → Archer quantity **3**).
- **SC-005**: Refreshing the browser resets inventory to zero for all cards with no data surviving reload.
- **SC-006**: No persistence APIs are introduced; the app remains fully playable offline in the browser as before.
