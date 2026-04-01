---
name: refactoring-workflow
description: Use when refactoring code or structure without intended behavior change — safe steps, tests, small commits, and coordination with schema migrations.
source: vibe_boilerplate@E26
---

# Refactoring Workflow

Follow **behavior-preserving** change discipline from RF-01: fix scope, add safety nets, keep commits single-intent, and order schema work with DS-01 when persistence is involved.

## Instructions

1. **Define “same behavior”** — List observable outputs, API surfaces, and persisted effects that must stay equivalent. If the user actually wants a behavior change, stop calling this a refactor; switch to feature/plan workflow.

2. **Safety net** — Before large moves: ensure tests, compile, or static checks cover the touched paths. If coverage is thin, add a minimal test or a manual verification checklist **before** the structural change.

3. **Small steps** — One refactor intent per commit or PR (rename-only commits may be isolated). Do not mix rename + extract + module move in one undifferentiated change.

4. **Schema coupling** — If DDL or data migration is involved, follow DS-01 expand/contract ordering; do not combine incompatible app deploy and schema deploy in one unplanned step.

5. **Wrong premise** — If the work reveals the As-Is assumption was wrong, pause and route to backlog/epic triage (WF-03) instead of “refactoring” toward a moving target.

6. **Large efforts** — Multi-session work should align with implementation-plan checkpoints when the repo uses them.

## Done when

- Behavior scope is explicit and unchanged unless the user revised goals.
- Each step has a verifiable safety net (automated or documented manual).
- Commits/PRs stay reviewable; schema and code changes are ordered safely.
- No silent mixing of refactor with feature work.

## Further reading (humans)

- `docs/basis/workflow/RF-01-refactoring-workflow.md`

Aligned with basis as of 2026-03 — RF-01 (distilled).
