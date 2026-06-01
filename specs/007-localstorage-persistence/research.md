# Research: Phase 7 localStorage Persistence

**Branch**: `007-localstorage-persistence` | **Date**: 2026-05-31

## R-001: Storage mechanism

**Decision**: **`localStorage`** only, key **`gachaGameState`**, JSON payload.

**Rationale**: User requirement; simple, synchronous, sufficient for small snapshot; works on same origin in Docker.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| sessionStorage | Out of scope |
| IndexedDB | Out of scope; overkill |
| Backend sync | Out of scope |

## R-002: Snapshot shape

**Decision**: Versioned object with `coins`, `commonCount`, `rareCount`, `inventory` map (5 ids), `lastPull` (card id or null).

**Rationale**: Covers all required fields; `lastPull` id resolves against static `CARDS` catalog on load.

## R-003: Timer persistence

**Decision**: **Do not persist** passive income countdown; **do persist** coins when timer fires (save on grant).

**Rationale**: Spec assumption; simpler; coin total is what matters across refresh.

## R-004: Module layout

**Decision**: New **`persistence.js`**; thin **`set/load`** on `gameState.js` and `inventory.js`.

**Rationale**: Keeps storage I/O out of UI; testable validate/defaults.

## R-005: Invalid save handling

**Decision**: Fail safe to **`getDefaultGameState()`**; do not write bad data back automatically.

**Rationale**: FR-011; avoids corrupt loops.

## R-006: CI testing

**Decision**: Vitest tests with **in-memory localStorage mock**; pure `validateSavedState` tests.

**Rationale**: Node CI has no browser localStorage; existing tests keep passing.

## R-007: Reset behavior

**Decision**: **`clearSavedState()`** + apply defaults in memory; optional immediate save of defaults omitted (cleared key = fresh on reload).

**Rationale**: FR-010 clear storage; empty key loads defaults.

## Resolved clarifications

None remaining.
