---
name: implementation-plan-authoring
description: Use when there is an agreed design or clear requirements for a multi-step implementation, before writing or changing application code — produces a bite-sized task plan under docs/plans.
source: vibe_boilerplate@E26
---

# Implementation Plan Authoring

Write an **implementation plan** for someone with **no prior context** on this repo: exact paths, commands, expected outputs, commits. DRY, YAGNI, TDD-minded, small steps.

**Announce once:** you are using this skill to author the plan.

**Save to:** `docs/plans/YYYY-MM-DD-<feature-name>.md`

Optional: run in a **separate git worktree** if the team uses `git-worktree-isolation` for isolation.

## Granularity

Each step is one **short** action (order-of minutes), e.g.:

- Add failing test → run see FAIL → minimal code → run see PASS → commit.

## Plan header (required)

```markdown
# [Feature Name] Implementation Plan

**Goal:** [One sentence]

**Architecture:** [2–3 sentences]

**Tech stack:** [Libraries, frameworks relevant to this repo]

**Execution:** After this plan is saved, follow it with `plan-execution-checkpoints` (separate session) or `in-session-parallel-implementation` (in-session tasks), or execute manually task-by-task.

---
```

## Task block template

Repeat per task group:

````markdown
### Task N: [Component or slice name]

**Files:**
- Create: `path/to/file.ext`
- Modify: `path/to/file.ext` (optional line hint)
- Test: `path/to/test.ext`

**Step 1: Failing test**

```…
```

**Step 2: Run test — expect FAIL**

Command: `…`  
Expected: …

**Step 3: Minimal implementation**

```…
```

**Step 4: Run test — expect PASS**

Command: `…`  
Expected: …

**Step 5: Commit**

```bash
git add …
git commit -m "type(scope): …"
```
````

Use **real paths** for this repository; no vague “add validation”.

## After the file is saved

Offer execution choice:

1. **In this session** — task-by-task with review between tasks → align with **`in-session-parallel-implementation`** if your environment supports it.
2. **Separate session / checkpoints** — **`plan-execution-checkpoints`** for batched execution with review gates.

Do not imply a specific vendor subagent unless the user’s stack provides it.

## Done when

- `docs/plans/YYYY-MM-DD-<feature-name>.md` exists with header + tasks covering the agreed scope, and the user knows how execution will run.

Aligned with basis as of 2026-03 — prior writing-plans workflow (distilled).
