---
name: branch-completion-options
description: Use when implementation is done and tests are green — verify once more, then offer merge, PR, keep branch, or discard; clean up worktree when appropriate.
source: vibe_boilerplate@E26
---

# Branch Completion Options

**Announce at start:** you are using this skill to close out the branch.

## Step 1 — Verify

Run the project’s full (or agreed) test command. Use **`evidence-before-completion`** discipline.

- If **failing:** list failures; **stop** — do not offer merge/PR until green.

## Step 2 — Base branch

Detect merge base (e.g. `main` or `develop`). Confirm with user if ambiguous.

## Step 3 — Present exactly four options

```
Implementation complete. What next?

1. Merge into <base> locally
2. Push and open a Pull Request
3. Keep branch as-is (I’ll handle later)
4. Discard this work

Which option (1–4)?
```

Keep wording tight; no extra options unless the user asked.

## Step 4 — Execute

**1 — Local merge:** checkout base → pull → merge feature → run tests → delete local feature branch if user wants → remove worktree if used.

**2 — PR:** push `-u origin <branch>` → create PR (host CLI or UI) with short summary + test plan → keep worktree until PR lands unless user says otherwise.

**3 — Keep:** report branch name and path; **do not** remove worktree.

**4 — Discard:** require **explicit** confirmation (e.g. user types `discard` or clearly confirms) → checkout base → `git branch -D` feature → remove worktree.

## Step 5 — Worktree cleanup

If this work used `git worktree`:

- Options **1** and **4:** usually `git worktree remove <path>` after branch handling.
- Options **2** and **3:** keep unless user wants removal.

## Red flags

- Offering merge/PR with failing tests.
- Discarding without confirmation.
- Auto-removing worktree when user chose PR or keep.

## Done when

- User choice executed and worktree state matches table above.

Aligned with basis as of 2026-03 — prior finishing-a-development-branch (distilled).
