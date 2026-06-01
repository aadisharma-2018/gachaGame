# Saved State Schema: Phase 7

**Branch**: `007-localstorage-persistence` | **Date**: 2026-05-31  
**Storage key**: `gachaGameState`  
**Format**: JSON string

## Example (valid)

```json
{
  "version": 1,
  "coins": 7,
  "commonCount": 4,
  "rareCount": 1,
  "inventory": {
    "archer": 2,
    "swordsman": 1,
    "protector": 0,
    "mage": 1,
    "king": 0
  },
  "lastPull": "mage"
}
```

## Example (fresh / default)

```json
{
  "version": 1,
  "coins": 10,
  "commonCount": 0,
  "rareCount": 0,
  "inventory": {
    "archer": 0,
    "swordsman": 0,
    "protector": 0,
    "mage": 0,
    "king": 0
  },
  "lastPull": null
}
```

## Required fields

| Field | Type | Validation |
|-------|------|------------|
| `version` | number | Must be **1** |
| `coins` | integer | ≥ 0 |
| `commonCount` | integer | ≥ 0 |
| `rareCount` | integer | ≥ 0 |
| `inventory` | object | All 5 card ids present, values integer ≥ 0 |
| `lastPull` | string \| null | If string, must match a catalog card id |

## Card ids (inventory keys)

`archer`, `swordsman`, `protector`, `mage`, `king`

## Non-goals

- Encrypting payload
- Multiple save slots
- Cloud backup fields
