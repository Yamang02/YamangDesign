---
name: layered-tdd-workflow
description: Use when implementing or fixing code in Domain or Application layers, or when choosing test strategy by architectural layer — follows TC-01 layer rules and Red-Green-Refactor where mandatory.
source: vibe_boilerplate@E26
---

# Layered TDD Workflow

This skill **overrides** “TDD everywhere always.” It matches **TC-01**: TDD is **mandatory** for **Domain** and **Application**; **optional** for **Infrastructure** and **UI**; tests must verify **behavior**, not implementation details.

## Classify the code

Determine **layer** (folder/module conventions from this repo — e.g. domain, application/use-cases, infrastructure/adapters, ui). If unclear, resolve layer first (naming/boundary rules in basis CC-02).

## Strategy by layer

| Layer | Test kind | TDD | Notes |
|-------|-----------|-----|--------|
| **Domain** | Unit | **Required** R→G→Refactor | Pure logic; no I/O; isolate fully. |
| **Application** | Unit | **Required** R→G→Refactor | Mock/stub **ports**; verify use-case order and error propagation. |
| **Infrastructure** | Integration | Optional | Real test DB / HTTP fakes as per project; spike OK, then harden. |
| **UI** | Component / e2e | Optional | Mock network; assert rendering and interactions. |

## TDD cycle (Domain & Application)

1. **Docs/spec** — Phase or plan updated if behavior changes (spec-before-code team rule).
2. **Red** — One minimal failing test expressing required behavior.
3. **Verify red** — Run test; failure must be for the **right** reason (missing behavior, not typo).
4. **Green** — Smallest change to pass; no extra features.
5. **Verify green** — Full relevant suite still passes.
6. **Refactor** — Clean up with tests green.
7. **Commit** — Typically **test + implementation** in one logical commit (per GC-01-style spec-driven flow). Repeat per behavior slice.

## Phase checklist mapping (TC-01-02)

When a Phase checklist says “X behaves …”, top-level tests/describes should align **1:1** with those outcomes where feasible so spec ↔ test ↔ code stay linked.

## Exceptions

- **Spike / PoC:** implementation-first allowed; **before merge** to “real” code, add tests and switch to TDD for Domain/Application.
- **Generated code / config-only** changes: agree with the user if TDD is N/A.

## Rationalizations to reject

- “Skip TDD on Domain because it’s small.”
- “Tests after achieve the same thing.” — Not for Domain/Application: you lose fail-first proof.

## Done when

- Layer strategy matches table; Domain/Application changes used R→G→Refactor; verifications run with evidence.

**Rigid** for Domain/Application TDD; **Flexible** for how UI/Infra tests are shaped.

Aligned with basis as of 2026-03 — TC-01 (distilled).
