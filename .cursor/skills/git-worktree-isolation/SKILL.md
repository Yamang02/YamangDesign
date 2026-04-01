---
name: git-worktree-isolation
description: Use when starting feature or plan execution that needs a separate checkout of the same repo — pick a worktree directory, ensure it is gitignored if inside the project, add branch, install deps, verify clean tests.
source: vibe_boilerplate@E26
---

# Git Worktree Isolation

**Announce at start:** you are using this skill to create an isolated worktree.

## 1. Choose directory (priority)

1. If `.worktrees/` exists → use it (wins over `worktrees/`).
2. Else if `worktrees/` exists → use it.
3. Else if project docs (e.g. `AGENTS.md`, `.cursor` README) specify a path → follow that.
4. Else **ask** the user: project-local `.worktrees/` vs global path outside repo.

## 2. Safety (project-local only)

For `.worktrees` or `worktrees` **inside** the repo:

```bash
git check-ignore -q .worktrees 2>/dev/null || git check-ignore -q worktrees 2>/dev/null
```

If **not** ignored: add to `.gitignore`, commit, then continue.

## 3. Create worktree

```bash
project=$(basename "$(git rev-parse --show-toplevel)")
# Example — adjust branch name
git worktree add "<chosen-dir>/<branch-slug>" -b "<branch-name>"
cd "<chosen-dir>/<branch-slug>"
```

Use the repo’s real branch naming (e.g. `feat/E##/P01-scope` per GC-01).

## 4. Setup

Auto-detect: `package.json` → `npm install` / `pnpm install`; `Cargo.toml` → `cargo build`; `pyproject.toml` / `requirements.txt` → project standard; `go.mod` → `go mod download`, etc.

## 5. Baseline verify

Run the project’s test (or check) command. If it fails: **report** and ask whether to proceed.

## 6. Report

```
Worktree: <absolute-path>
Branch: <name>
Baseline: <command> → <outcome>
```

## Red flags

- Creating project-local worktree dir **without** ignore check.
- Proceeding with **failing** baseline tests without user OK.
- Assuming directory without following priority / user choice.

## Done when

- Worktree exists, branch checked out, deps installed, baseline outcome recorded.

Aligned with basis as of 2026-03 — prior using-git-worktrees (distilled); pair with **`branch-completion-options`** to remove worktree when finished.
