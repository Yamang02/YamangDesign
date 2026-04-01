---
name: in-session-parallel-implementation
description: Use when executing an implementation plan in the current session with mostly independent tasks — fresh subagent per task, spec-then-quality review loops, no parallel implementers on the same files.
source: vibe_boilerplate@E26
---

# In-Session Parallel Implementation

Execute a plan **in one session** using **one implementer subagent per task**, with **two review passes** after each task: **spec compliance**, then **code quality**. Do **not** run multiple implementer subagents in parallel on overlapping code.

**vs. `plan-execution-checkpoints`:** same session, faster loop, automated review gates between tasks instead of human batch gates.

## When to use

- A written plan exists (`docs/plans/...`).
- Tasks are **mostly independent** (tight coupling → execute sequentially without subagents or use checkpoints).
- You stay in **this** session (otherwise use `plan-execution-checkpoints`).

## Preparation

1. Read the plan once; extract **full text** of each task + any global constraints.
2. Create todos for all tasks.

## Per-task loop

1. **Implementer** — Dispatch with: full task text, repo constraints, branch name, “ask before coding if unclear”.
2. If implementer asks questions — answer, then re-dispatch or continue.
3. Implementer implements, runs tests per plan, commits per project rules, self-reviews briefly.
4. **Spec reviewer** — Dispatch (or second pass) with: task text vs diff; must confirm no missing requirements and no unrequested scope.
5. If spec fails — implementer fixes; **re-run spec review** until pass.
6. **Quality reviewer** — Style, structure, edge cases, magic numbers; **only after spec is ✅**.
7. If quality fails — implementer fixes; **re-run quality review** until pass.
8. Mark task todo complete.

**Never** start quality review before spec is ✅. **Never** move to the next task with open review issues.

## After all tasks

- Optional **final holistic review** pass on the whole diff.
- Then **`branch-completion-options`** (and **`evidence-before-completion`** before success claims).

## Red flags

- Skipping either review type.
- Multiple implementer subagents editing the **same** files concurrently.
- Letting implementer re-read the whole plan file instead of you pasting **task-local** context (reduces drift).
- Starting on `main` / `master` without explicit user consent.

## Integration

- Plans from **`implementation-plan-authoring`**.
- Isolation: **`git-worktree-isolation`** when required.
- Implementer should follow **`layered-tdd-workflow`** for Domain/Application code in this repo.

## Done when

- All tasks pass both reviews and todos are complete, or you stopped with a documented blocker.

Aligned with basis as of 2026-03 — prior subagent-driven-development (distilled).
