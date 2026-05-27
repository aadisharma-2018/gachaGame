# Data Model: Phase 1 Gacha Pull Prototype

**Branch**: `001-phase1-gacha-pull` | **Date**: 2026-05-19

Phase 1 uses **in-memory only** data. Nothing is serialized or stored across page loads.

## Entities

### CardRarity (enum)

| Value | Probability | Display label |
|-------|-------------|---------------|
| `common` | 90% (0.9) | **Common** |
| `rare` | 10% (0.1) | **Rare** |

**Validation**: Every pull MUST produce exactly one of these two values.

### PullResult

Represents the outcome of a single gacha pull (one click).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `rarity` | `CardRarity` | yes | Outcome of this pull |
| `label` | string | yes | Player-facing text: `"Common"` or `"Rare"` |

**Lifecycle**: Created on each **Pull** click; replaces the previous `PullResult` in UI.
Not retained in a history list in Phase 1.

### GameSession (implicit)

Ephemeral browser session state—**not** a persisted entity.

| State | Type | Initial | After pull | After refresh |
|-------|------|---------|------------|---------------|
| `lastResult` | `PullResult \| null` | `null` | current pull | `null` (page reload) |
| `pullCount` | number (optional) | `0` | incremented | `0` |

**Note**: `pullCount` is optional for display/debug only; omit if unused to keep UI minimal.

## Relationships

```text
GameSession
  └── lastResult: PullResult (0..1)
        └── rarity: CardRarity
```

No relationships to User, Wallet, Inventory, or Collection (out of scope).

## State Transitions

```text
[Page Load]
    → lastResult = null, UI shows Pull button (optional empty result area)

[User clicks Pull]
    → rollRarity() → PullResult
    → lastResult := PullResult
    → UI renders label + rarity styling

[User clicks Pull again]
    → new PullResult replaces lastResult (same transition)

[Page Refresh / Close tab]
    → all state discarded (browser reload)
```

## Business rules

1. **BR-001**: Each pull is independent; prior pulls do not bias the next outcome.
2. **BR-002**: `P(rare) = 0.1`, `P(common) = 0.9` per pull (FR-004).
3. **BR-003**: No currency check before pull (infinite money — no wallet entity).
4. **BR-004**: No write to storage APIs (FR-007).

## Mapping to source files

| Concept | File |
|---------|------|
| `rollRarity()` → `PullResult` | `src/pull.js` |
| `lastResult` + DOM update | `src/main.js` |
| Visual presentation | `src/styles.css`, `index.html` |
