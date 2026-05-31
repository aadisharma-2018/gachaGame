# Research: Phase 6 Card Pool and Inventory

**Branch**: `006-card-pool-inventory` | **Date**: 2026-05-31

## R-001: Card data location

**Decision**: New module **`src/cards.js`** with static array and pool helpers.

**Rationale**: Keeps catalog out of UI and pull logic; easy to read and test; matches “static card data” requirement.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Inline in `pull.js` | Mixes data and logic |
| JSON file fetch | Implies async/API pattern; out of scope |

## R-002: Two-step pull algorithm

**Decision**: Reuse **`resolveRarity`** (90/10), then **`pickCardFromPool(rarity, randomValue)`** with uniform index.

**Rationale**: Preserves Phase 5 rarity tests; separates concerns; within-pool odds are equal per spec.

## R-003: Inventory storage

**Decision**: New **`src/inventory.js`** with in-memory map keyed by card `id`.

**Rationale**: Distinct from coin/rarity counters in `gameState.js`; clear ownership; resets on refresh via module re-init.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Extend `gameState.js` only | Overloads module; inventory is 5 keyed counts |
| localStorage | Explicitly out of scope |

## R-004: Inventory UI pattern

**Decision**: **Toggle panel** on same page (`hidden` / CSS class); no router.

**Rationale**: Spec FR-007/FR-008; simplest same-page UX.

## R-005: Common/Rare counters

**Decision**: **Keep** existing `#common-count` / `#rare-count` and `recordPull(rarity)`.

**Rationale**: FR-012 prefers retention; counters still match rarity step after specific card pull.

## R-006: Result display

**Decision**: Structured result in **`#result`** (emoji + name + rarity text); reuse rarity CSS classes.

**Rationale**: No image assets; emojis only per spec.

## R-007: Docker / CI

**Decision**: **No changes** unless `npm run build` or `npm test` fails.

**Rationale**: Spec out of scope; normal compatibility only.

## Resolved clarifications

No `NEEDS CLARIFICATION` items remain.
