<!--
Sync Impact Report
- Version change: (unratified template) → 1.0.0
- Modified principles: N/A (initial ratification from template placeholders)
- Added sections: Phase 1: Playable Pull Prototype; Development Workflow
- Removed sections: None (template placeholders replaced)
- Templates:
  - ✅ .specify/templates/plan-template.md (Constitution Check gates)
  - ✅ .specify/templates/spec-template.md (phase scope note)
  - ✅ .specify/templates/tasks-template.md (phase-aware foundational guidance)
  - ⚠ .specify/templates/commands/*.md (not present; commands live in .cursor/commands/)
  - ⚠ README.md (not present; no runtime doc updates)
- Deferred TODOs: None
-->

# Gacha Game Constitution

## Core Principles

### I. Extreme Simplicity First

The first version MUST be the simplest playable prototype. Build only what is needed for
the current phase; defer everything else.

**Rationale**: This is a learning-focused game project built in small phases; complexity
early obscures learning goals and slows feedback.

### II. No Premature Infrastructure

The project MUST NOT add authentication, databases, Docker, Kubernetes, AWS, CI/CD
pipelines, or backend services until a later phase explicitly requests them.

**Rationale**: Infrastructure overhead distracts from core game mechanics and local
prototyping.

### III. No Unnecessary Abstractions

Do not introduce architecture layers, frameworks, or patterns beyond what the current phase
requires. Prefer direct, readable code over clever indirection.

**Rationale**: Premature abstraction increases maintenance cost without user value in early
phases.

### IV. Local-First Runnable App

The application MUST be easy to run locally with minimal setup. The UI MUST be clean and
simple for the current phase.

**Rationale**: Fast feedback loops support learning and manual verification.

### V. Phase-Bounded Scope

Work proceeds one phase at a time. Do not implement features from future phases unless the
user explicitly asks.

**Rationale**: Phased delivery keeps each increment reviewable, explainable, and
independently valuable.

## Phase 1: Playable Pull Prototype

Phase 1 is the minimum gacha-style card pull experience. All specs, plans, and tasks for
Phase 1 MUST stay within this scope.

### Required Behavior

- A **Pull** button MUST be visible on the page.
- Clicking **Pull** MUST randomly display either a **Common** card or a **Rare** card.
- Pull probabilities MUST be: **Common 90%**, **Rare 10%**.
- The user has infinite money; NO currency system in Phase 1.

### Explicitly Out of Scope (Phase 1)

- Card collection, inventory, or persistence
- User accounts or authentication
- Data surviving a browser refresh
- Backend services, APIs, or server-side pull logic

### Definition of Done (Phase 1)

1. The app runs locally.
2. The page displays a **Pull** button.
3. Clicking **Pull** randomly displays either a Common or Rare card.
4. Rare appears approximately 10% of the time (verify manually over many pulls).
5. Common appears approximately 90% of the time.
6. No data is stored after refresh.
7. No systems beyond this prototype are added.

## Development Workflow

### Process Rules

1. Implement **one phase at a time**.
2. After each phase, **stop** and explain what was created.
3. Do **not** move on to future features unless explicitly asked.
4. Prefer **clear, readable code** over clever code.
5. Keep files organized without overengineering folder structure.
6. Include **simple manual verification steps** after each implementation.

### Manual Verification (Required)

Every phase completion MUST document manual steps, such as:

- Start the app locally and confirm the page loads.
- Click **Pull** multiple times and observe Common vs Rare outcomes.
- Refresh the page and confirm state resets (no persistence).

## Governance

This constitution supersedes conflicting guidance in specs, plans, and ad-hoc instructions
for this repository.

### Amendment Procedure

1. Propose changes via `/speckit.constitution` with rationale.
2. Bump `CONSTITUTION_VERSION` per semantic versioning (see below).
3. Update dependent templates (plan, spec, tasks) when principles change.
4. Record changes in the Sync Impact Report HTML comment at the top of this file.

### Versioning Policy

- **MAJOR**: Backward-incompatible principle removals or redefinitions.
- **MINOR**: New principles or materially expanded phase guidance.
- **PATCH**: Clarifications, typo fixes, non-semantic wording.

### Compliance Review

- `/speckit.plan` MUST populate **Constitution Check** gates and reject unjustified
  violations.
- `/speckit.specify` MUST align user stories and requirements with the active phase scope.
- `/speckit.tasks` MUST NOT schedule out-of-scope infrastructure for the current phase.
- `/speckit.implement` MUST stop at phase boundaries and report manual verification steps.

**Version**: 1.0.0 | **Ratified**: 2026-05-19 | **Last Amended**: 2026-05-19
