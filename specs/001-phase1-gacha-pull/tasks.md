---
description: "Phase 1 implementation tasks — frontend-only gacha pull prototype"
---

# Tasks: Phase 1 Gacha Pull Prototype

**Input**: Design documents from `/specs/001-phase1-gacha-pull/`  
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [quickstart.md](./quickstart.md)  
**Clarifications**: [spec.md § Clarifications](./spec.md#clarifications) (Session 2026-05-19)

**Scope**: Phase 1 only — **frontend-only**, local run. No backend, APIs, databases, auth, Docker, K8s, AWS, CI/CD, persistence, inventory, currency, or future-phase systems.

**Tests**: Manual verification only (no automated test tasks). Odds: confirm `Math.random() < 0.1` in code; manually see both **Common** and **Rare** — no strict statistical test over a fixed pull count.

## Format

`- [ ] [TaskID] [Story?] Description — **Expected outcome:** …`

Tasks are **sequential** unless noted; complete in order for easiest review.

---

## Phase 1: Setup — Minimal frontend app structure

**Purpose**: Initialize a Vite + vanilla JavaScript project at the repository root.

- [x] T001 Create `package.json` at repo root with `dev`, `build`, and `preview` scripts and `vite` as a dev dependency — **Expected outcome:** `npm install` succeeds; `package.json` lists `vite` only (no React/Vue/backend); Vite major version is **not** pinned unless the toolchain requires it.
- [x] T002 Create `vite.config.js` at repo root pointing at root `index.html` — **Expected outcome:** `npm run dev` starts without config errors (may 404 until `index.html` exists in T004).
- [x] T003 Create empty `public/` directory (optional static assets; leave empty for Phase 1) — **Expected outcome:** Folder exists; no files required inside.

---

## Phase 2: Foundational — Page shell and base styles

**Purpose**: Blocking prerequisites before pull behavior (minimal per constitution).

- [x] T004 Create `index.html` with `<main>`, a linked `src/styles.css`, and a module script entry for `src/main.js` — **Expected outcome:** Page loads in browser with no console errors about missing CSS/JS modules.
- [x] T005 Create `src/styles.css` with a simple centered layout, readable font, and spacing for a single-page game — **Expected outcome:** Page looks clean and uncluttered before game logic is added.

---

## Phase 3: User Story 1 — Pull a card (Priority: P1) 🎯 MVP

**Goal**: Player clicks **Pull** and sees a random **Common** or **Rare** result; unlimited repeats; refresh clears state.

**Independent test**: `npm run dev` → click **Pull** → see **Common** or **Rare** → repeat → refresh clears result. After several pulls, both rarities should be observable (no fixed pull quota required).

### Implementation for User Story 1

- [x] T006 [US1] Add `#pull-btn` labeled **Pull** and `#result` with neutral placeholder in `index.html` per [contracts/ui-behavior.md](./contracts/ui-behavior.md) — **Expected outcome:** Visible **Pull** button; placeholder result area until first pull.
- [x] T007 [US1] Implement `rollRarity()` in `src/pull.js` returning `{ rarity, label }` using **`Math.random() < 0.1`** → **Rare**, else **Common** (FR-004, SC-003) — **Expected outcome:** Exported function returns only `common`/`rare` with labels **Common**/**Rare**; no `fetch`, `localStorage`, or storage APIs.
- [x] T008 [US1] Create `src/main.js` importing `rollRarity`, wire `#pull-btn` click, update `#result` text each pull — **Expected outcome:** Each click shows **Common** or **Rare** immediately; button always enabled; no currency/cooldown UI.
- [x] T009 [US1] Ensure `src/` has no network, persistence, or auth usage — **Expected outcome:** No `fetch`, `localStorage`, `sessionStorage`, or `indexedDB` in `src/`.

**Checkpoint (MVP)**: US1 complete — **9 tasks (T001–T009)** deliver a playable pull loop. Stop here for MVP review if desired.

---

## Phase 4: User Story 2 — Distinguish rarity at a glance (Priority: P2)

**Goal**: Player instantly recognizes Common vs Rare after each pull.

**Independent test**: Pull several times; each result is labeled and visually distinct (**Common** vs **Rare**).

### Implementation for User Story 2

- [x] T010 [US2] In `src/main.js`, set `rarity-common` or `rarity-rare` on `#result` from `rollRarity()` — **Expected outcome:** CSS class updates every pull; text stays **Common** or **Rare**.
- [x] T011 [US2] Add `.rarity-common` and `.rarity-rare` in `src/styles.css` — **Expected outcome:** Rarities are visually distinct on desktop and mobile.
- [x] T012 [US2] Add `aria-live="polite"` on `#result` in `index.html` — **Expected outcome:** Assistive tech can announce new results (optional manual check).

**Checkpoint**: US1 + US2 complete — clear labels and visual distinction.

---

## Phase 5: Polish — Docs and manual verification

**Purpose**: Local run instructions and Phase 1 DoD; then **stop** (no Phase 2 features).

- [x] T013 Create `README.md` at repo root with prerequisites, `npm install`, and `npm run dev` per [quickstart.md](./quickstart.md) — **Expected outcome:** New developer can run the app from README alone.
- [x] T014 Add **Manual verification** to `README.md` matching [quickstart.md](./quickstart.md): app runs, single/repeat pull, **`Math.random() < 0.1` in `src/pull.js`**, both rarities appear at least once, refresh clears state, no extra UI — **Expected outcome:** README checklist has no 50-pull or percentage-band requirement.
- [x] T015 Walk through README verification on the running app and fix gaps — **Expected outcome:** All checklist items pass; code still uses `Math.random() < 0.1`; both **Common** and **Rare** observed manually; no future-phase features added.

**Checkpoint**: Phase 1 complete. **Do not implement** backend, persistence, auth, inventory, or currency.

---

## Dependencies & Execution Order

### Phase dependencies

```text
Setup (T001–T003) → Foundational (T004–T005) → US1 (T006–T009) [MVP]
  → US2 (T010–T012) → Polish (T013–T015)
```

### User story dependencies

- **US1 (P1)**: Requires Setup + Foundational; no dependency on US2.
- **US2 (P2)**: Requires US1 (`src/main.js`, `#result`).

### Parallel opportunities

None — sequential by design for easy review.

---

## Implementation strategy

### MVP first (recommended)

1. Complete **T001–T009** (**9 tasks**) through US1 checkpoint.
2. Verify per [quickstart.md](./quickstart.md) §§1–3 and §5 (app, pulls, refresh).
3. Optionally continue **T010–T015** for styling, docs, and full DoD.

### Verification (clarified — not statistical)

| Check | How |
|-------|-----|
| Pull logic | Read `src/pull.js`: `Math.random() < 0.1` → **Rare** |
| Both rarities | Click **Pull** until **Common** and **Rare** each appear ≥1 time |
| No stats quota | Do **not** require 50 pulls or 85–95% Common band in Phase 1 |

### Out of scope (do not add tasks)

Backend, APIs, databases, auth, Docker, K8s, AWS, CI/CD, `localStorage`/persistence, inventory, collection, currency/wallet, multi-page routing, automated test suites, or any future-phase system.

---

## Task summary

| Phase | Task IDs | Count |
|-------|----------|-------|
| Setup | T001–T003 | 3 |
| Foundational | T004–T005 | 2 |
| US1 — Pull a card (MVP) | T006–T009 | 4 |
| US2 — Rarity distinction | T010–T012 | 3 |
| Polish & verification | T013–T015 | 3 |
| **Total** | **T001–T015** | **15** |

| Scope | Tasks | Count |
|-------|-------|-------|
| **MVP** | T001–T009 | **9** |
| Full Phase 1 | T001–T015 | 15 |

**Format validation**: All 15 tasks use `- [ ] [TaskID] …` with file paths and **Expected outcome** lines.
