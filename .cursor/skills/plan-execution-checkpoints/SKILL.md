---
name: plan-execution-checkpoints
description: Use when implementing a written plan in a dedicated session or worktree — execute tasks in batches, report for human review between batches, stop on blockers.
source: vibe_boilerplate@E26
---

# Plan Execution with Checkpoints

Load an implementation plan (usually `docs/plans/YYYY-MM-DD-*.md`), execute in **batches** with **human checkpoints** between batches.

**Announce at start:** you are using this skill to execute the plan.

## Process

### 1. Load and review

1. Read the plan file end-to-end.
2. Note risks, missing steps, or unclear verifications — **raise with the user before** starting if blocking.
3. If clear: create todos mirroring tasks (or batches).

### 2. Execute one batch

**Default batch size:** first **3 tasks** (or fewer if the plan groups differently).

Per task:

1. Mark task in progress.
2. Follow plan steps **in order**; run every verification command the plan names.
3. Mark completed when verifications match expected output.

### 3. Report

When the batch finishes:

- Summarize what changed (files, behavior).
- Paste or summarize verification output.
- Say explicitly: **Ready for feedback.**

**Do not** start the next batch until the user responds (unless they asked to continue without pausing).

### 4. Continue

- Apply feedback; adjust plan file if the user updates scope.
- Run the next batch; repeat until all tasks done.

### 5. Finish branch

When all tasks are verified:

- Use **`branch-completion-options`** to merge, open PR, keep branch, or discard — after **`evidence-before-completion`** for final claims.

## Stop conditions

**Stop immediately and ask** when:

- A blocker appears mid-batch (missing dep, failing verification, ambiguous step).
- The plan has critical gaps.
- Verification fails repeatedly.

Do not guess through failures.

## Revisit plan (Step 1)

Return to full plan review if:

- The user changes the plan materially, or
- The approach needs rethinking.

## Rules

- Do not skip verifications.
- Do not implement on `main` / `master` without explicit user consent.
- Prefer an isolated worktree via **`git-worktree-isolation`** when the team uses it.

## Done when

- All plan tasks are done and verified, or execution stopped with a clear blocker report.

Aligned with basis as of 2026-03 — prior executing-plans workflow (distilled).
