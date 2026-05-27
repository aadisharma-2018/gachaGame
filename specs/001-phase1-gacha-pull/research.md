# Research: Phase 1 Gacha Pull Prototype

**Branch**: `001-phase1-gacha-pull` | **Date**: 2026-05-19

## R-001: Local dev tooling

**Decision**: Use **Vite** with a **vanilla** setup (no React/Vue); do not pin a specific Vite major unless the toolchain requires it.

**Rationale**:

- One command to run locally (`npm run dev`) with hot reload.
- Constitution requires easy local run; opening raw `file://` URLs can block modules and
  hurt DX.
- Vite adds only dev/build tooling—no runtime framework or extra abstractions.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Plain `index.html` + `<script>` only | No dev server; module/CORS quirks; weaker learning path for later phases |
| Create React App / Next.js | Violates simplicity; introduces routing/SSR concepts not needed in Phase 1 |
| Parcel / Webpack from scratch | More config than Vite for the same outcome |

## R-002: Pull randomness (90% Common / 10% Rare)

**Decision**: `Math.random() < 0.1` → **Rare**, else **Common**.

**Rationale**:

- Spec FR-004 requires 90/10 independent pulls per click.
- Browser `Math.random()` is sufficient for a learning prototype; verify the
  `Math.random() < 0.1` check in code and confirm both rarities can appear manually (SC-003).

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Weighted table with many rarities | Out of Phase 1 scope (only two outcomes) |
| Seeded PRNG | Unnecessary complexity; no replay requirement |
| Server-side pull | Violates frontend-only constitution |

## R-003: State and persistence

**Decision**: Hold **only** the latest pull result in JavaScript variables / DOM text.
Do **not** use `localStorage`, `sessionStorage`, or IndexedDB.

**Rationale**:

- FR-007 and constitution forbid persistence across refresh.
- Simplest model: refresh reloads the page and resets to initial UI.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| `sessionStorage` for last result | Survives refresh within tab in some interpretations—conflicts with SC-004 |
| Pull history array in memory | Not required; spec shows one current result |

## R-004: UI structure

**Decision**: Semantic HTML — `<main>`, `<button id="pull-btn">Pull</button>`, and a
`<div id="result">` (or similar) for the outcome label.

**Rationale**:

- Meets FR-001, FR-005, and User Story 2 (visible **Common** / **Rare** labels).
- CSS classes `.rarity-common` and `.rarity-rare` differentiate rarities without images.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Canvas/WebGL card reveal | Over-engineered for Phase 1 |
| Separate routes/pages | No multi-screen requirement |

## R-005: Testing approach

**Decision**: **Manual verification only** in Phase 1 (documented in quickstart.md).

**Rationale**:

- Spec clarifications state odds are verified by code review plus seeing both rarities—not strict statistical sampling.
- Constitution prioritizes playable prototype over test infrastructure.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Vitest unit tests for `rollRarity()` | Optional later; not required for Phase 1 DoD |
| E2E Playwright | Adds CI/tooling scope user excluded |

## Resolved clarifications

No `NEEDS CLARIFICATION` items remained from Technical Context—all decisions above
close them without backend or future features.
