---
name: parallel-agent-dispatch
description: Use when there are two or more independent failures or work items with no shared mutable state — dispatch one focused agent (or session) per domain, then integrate results.
source: vibe_boilerplate@E26
---

# Parallel Agent Dispatch

**Principle:** One independent problem domain → one parallel worker. Integrate only after each returns.

## When to use

**Use when:**

- Several failures (e.g. different test files, subsystems) with **different** root causes.
- Each investigation needs **no** live context from the others.
- No **shared files** or resources that workers would fight over.

**Do not use when:**

- Failures are likely related (fix one may fix others) — investigate together first.
- You need full-system state to decide anything.
- Workers would edit the **same** paths or shared locks.

## Steps

### 1. Group by domain

Example: file A = auth flow, file B = batch jobs, file C = race — three domains.

### 2. Write one brief per worker

Each prompt must include:

- **Scope** — one file, one subsystem, or one test file.
- **Goal** — e.g. “make listed tests pass” or “find root cause of X”.
- **Constraints** — e.g. “do not change production API surface” or “tests only”.
- **Expected return** — short summary: cause, files touched, verification run.

### 3. Dispatch in parallel

Use the host’s parallel task mechanism (e.g. multiple Task invocations). Do **not** parallelize two implementers on the **same** branch without merge discipline.

### 4. Integrate

When workers return:

1. Read each summary.
2. Check for **overlapping file edits** — resolve conflicts before merging.
3. Run the **full** project verification suite (or agreed subset).
4. Spot-check: workers can share systematic mistakes.

## Prompt anti-patterns

| Bad | Good |
|-----|------|
| “Fix all tests” | “Fix failures in `path/to/file.test.ts` only” |
| “Fix the race” (no location) | Paste errors + test names + file |
| No constraints | “Do not refactor outside `src/foo/`” |
| “Fix it” | “Return: root cause + files changed + command run” |

## Done when

- All dispatched domains are resolved or explicitly blocked, integration suite outcome is reported with evidence.

Aligned with basis as of 2026-03 — prior dispatching-parallel-agents (distilled).
