---
name: request-code-review
description: Use after a meaningful slice of work — task in a plan, feature chunk, or before merge — to obtain a structured review of the diff against requirements.
source: vibe_boilerplate@E26
---

# Request Code Review

**Principle:** Review before defects compound.

## When

**Strongly recommended:**

- After each task in **`in-session-parallel-implementation`**
- After each batch in **`plan-execution-checkpoints`**
- Before merging to shared mainline
- When stuck (fresh eyes)

## How

1. **Scope** — state what changed (paths, behavior) and what it **should** satisfy (plan section, Phase checklist, ticket).
2. **Diff range** — `BASE_SHA`..`HEAD_SHA` or equivalent (e.g. `origin/main...HEAD`).
3. **Run review** — either:
   - a **second pass** by the same agent with a “reviewer” system prompt and no implementer hat, or  
   - a **subagent / Task** in your environment, with the same inputs.
4. **Template for the reviewer:**
   - What was implemented?
   - What was required?
   - Strengths
   - Issues: **Critical** / **Important** / **Minor**
   - Verdict: block / proceed with fixes / proceed

5. **Act** — fix Critical before continue; fix Important before merge unless waived; track Minor.

## If feedback is wrong

Push back with **technical** reasons, tests, or links to requirements — not tone debate.

## Red flags

- Skipping review “because it’s small”
- Ignoring Critical items
- Proceeding with open Important items without user OK

## Done when

- Review notes are addressed or explicitly deferred with user agreement; **`evidence-before-completion`** before “all good.”

Aligned with basis as of 2026-03 — prior requesting-code-review (distilled).
