# UI Behavior Contract: Phase 1 Gacha Pull

**Branch**: `001-phase1-gacha-pull` | **Date**: 2026-05-19  
**Type**: Client-side application contract (no HTTP API)

This document defines the player-visible interface for Phase 1. Implementations MUST
conform unless the spec and constitution are amended.

## Surfaces

### Page: Gacha Pull (single page)

| Element | ID / selector (suggested) | Behavior |
|---------|---------------------------|----------|
| Pull control | `#pull-btn` | Button with visible label **Pull**; always enabled |
| Result display | `#result` | Shows latest pull outcome; updates on each click |

## Interactions

### I-001: Initial load

- **Trigger**: Player opens the app URL.
- **Precondition**: None.
- **Postcondition**:
  - **Pull** button is visible.
  - Result area is empty OR shows neutral placeholder (e.g., “Pull to reveal a card”).
  - No **Common** / **Rare** result shown until first pull (acceptable per spec).

### I-002: Execute pull

- **Trigger**: Player activates **Pull** (click or keyboard activation on button).
- **Precondition**: None (no balance, no cooldown).
- **Processing**:
  1. Sample rarity: 90% **Common**, 10% **Rare**.
  2. No network request.
- **Postcondition**:
  - Result display shows exactly one of: text **Common** or text **Rare**.
  - Result is immediately visible (FR-005).
  - Visual distinction between rarities (class or style) per User Story 2.

### I-003: Repeat pull

- **Trigger**: Player activates **Pull** again.
- **Postcondition**: Result display updates to the new outcome; unlimited repetitions.

### I-004: Refresh page

- **Trigger**: Browser reload.
- **Postcondition**: Same as I-001; no memory of prior pulls (FR-007, SC-004).

## Display contract

| Rarity | Required label text | Suggested CSS class |
|--------|---------------------|---------------------|
| Common | `Common` | `.rarity-common` |
| Rare | `Rare` | `.rarity-rare` |

Labels MUST match casing above for manual testing consistency.

## Non-goals (MUST NOT appear in Phase 1 UI)

- Login / sign-up
- Currency, gems, or balance
- Inventory, collection, or card gallery
- Pull history log (beyond current result)
- Settings, shop, or navigation to other pages
- Loading spinners that imply server fetch for pulls

## Accessibility (minimal Phase 1)

- **Pull** MUST be a `<button>` (not `<motion.div>`) for keyboard and assistive tech.
- Result region SHOULD use `aria-live="polite"` so screen readers announce new pulls.

## Error handling

No user-facing errors expected in Phase 1. If DOM elements are missing (dev misconfig),
fail fast in console during development—no error UI required for players.
