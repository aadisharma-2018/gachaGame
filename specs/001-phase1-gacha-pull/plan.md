# Implementation Plan: Phase 1 Gacha Pull Prototype

**Branch**: `001-phase1-gacha-pull` | **Date**: 2026-05-19 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-phase1-gacha-pull/spec.md`

**Note**: Phase 1 only — frontend-only, local dev, no backend or future systems.

## Summary

Deliver a single-page browser game where the player clicks **Pull** and sees a random
**Common** (90%) or **Rare** (10%) card result. All logic runs client-side in memory; a
page refresh clears state. Stack: **Vite + vanilla JavaScript** at repository root for
minimal tooling and one-command local run (`npm run dev`).

## Technical Context

**Language/Version**: JavaScript (ES2022+), HTML5, CSS3  
**Primary Dependencies**: Vite (dev server and bundler only; no UI framework; major version not pinned unless toolchain requires)  
**Storage**: None (in-memory React-less component state only; no `localStorage`)  
**Testing**: Manual verification per [quickstart.md](./quickstart.md); no automated test suite in Phase 1  
**Target Platform**: Modern desktop/mobile browsers (Chrome, Firefox, Safari, Edge)  
**Project Type**: Single-page web application (static client)  
**Performance Goals**: Instant UI update on each pull (<100 ms perceived)  
**Constraints**: No network calls for pulls; no build-time secrets; no persistence APIs  
**Scale/Scope**: One page, one button, two rarities, ~5 source files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Evidence |
|------|--------|----------|
| Simplicity | ✅ PASS | Single page, vanilla JS, no framework |
| Infrastructure | ✅ PASS | No auth, DB, Docker, K8s, AWS, CI/CD, backend |
| Abstractions | ✅ PASS | Two modules: UI (`main.js`) + pull logic (`pull.js`) |
| Local run | ✅ PASS | `npm install` + `npm run dev` documented in quickstart |
| Phase boundary | ✅ PASS | No currency, collection, accounts, or APIs |
| Pull prototype (Phase 1) | ✅ PASS | Pull button, 90/10 odds, refresh clears state |

**Post-design re-check (Phase 1)**: All gates still pass. No entries required in Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/001-phase1-gacha-pull/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-behavior.md
└── tasks.md              # Created by /speckit.tasks (not this command)
```

### Source Code (repository root)

```text
index.html                 # App shell: Pull button + result region
package.json               # Scripts: dev, build, preview
vite.config.js             # Minimal Vite config (root index.html)
src/
├── main.js                # DOM wiring, click handler, render result
├── pull.js                # rollRarity(): Common 90% / Rare 10%
└── styles.css             # Simple, clean layout and rarity styling
public/                    # Optional static assets (empty in Phase 1)
```

**Structure Decision**: Single-project layout at repo root (no `frontend/` / `backend/`
split). Vite serves `index.html` during development; production build is optional for
Phase 1 but supported via `npm run build` + `npm run preview` for local verification.

## Complexity Tracking

> No constitution violations. Table intentionally empty for Phase 1.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |

## Phase 0 & 1 Artifacts

| Artifact | Path | Purpose |
|----------|------|---------|
| Research | [research.md](./research.md) | Stack and pull-algorithm decisions |
| Data model | [data-model.md](./data-model.md) | In-memory entities and state |
| UI contract | [contracts/ui-behavior.md](./contracts/ui-behavior.md) | Player-visible behavior |
| Quickstart | [quickstart.md](./quickstart.md) | Run and manual test steps |

## Implementation Notes (for /speckit.tasks)

1. **Pull algorithm** (`pull.js`): `Math.random() < 0.1` → Rare, else Common.
2. **UI** (`main.js`): On click, call `rollRarity()`, update a single result element with
   text **Common** or **Rare** and a CSS class for visual distinction.
3. **Initial state**: Empty or placeholder result area until first pull (per spec edge case).
4. **Do not add**: `localStorage`, `fetch`, routers, state libraries, or component frameworks.
5. **Stop after Phase 1**: Document manual verification; do not implement Phase 2 features.
