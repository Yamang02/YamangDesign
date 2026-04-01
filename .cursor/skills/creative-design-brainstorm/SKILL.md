---
name: creative-design-brainstorm
description: Use before any creative work — new features, new components, new behavior, or meaningful behavior changes — until a written design is approved by the user.
source: vibe_boilerplate@E26
---

# Creative Design Brainstorm

Turn an idea into an agreed design **before** implementation. Uses dialogue, not code.

## Hard gate

Do **not** write or change production code, scaffold projects, run implementation-focused refactors, or invoke stack-specific implementation skills until:

1. You have presented a design sized to the task, and  
2. The user has **approved** it (explicit OK or equivalent).

Short tasks still need a **short** design + approval — “too simple” is invalid.

## Checklist (in order)

Create todos for each step when useful; complete in order.

1. **Explore context** — relevant files, docs, recent commits.
2. **Clarify** — **one question per message** where possible; purpose, constraints, success criteria. Prefer multiple-choice when it helps.
3. **Propose 2–3 approaches** — tradeoffs + your recommendation.
4. **Present design** — section by section; pause for approval per section when complexity warrants. Cover architecture, main components, data flow, errors, testing intent.
5. **Write design doc** — `docs/plans/YYYY-MM-DD-<topic>-design.md` and commit if the repo uses git for docs.
6. **Hand off to planning** — invoke **`implementation-plan-authoring`** to produce the step-by-step implementation plan. Do **not** jump to implementation skills before that.

## After step 6

The normal next skill is **`implementation-plan-authoring`** only.  
If the work is **epic-shaped** (multi-Phase, docs in `docs/epic/`), you may use **`epic-lifecycle`** after design approval instead of or in addition to a single plan file — follow user direction.

## Principles

- One question at a time; avoid question dumps.
- YAGNI — drop unnecessary scope from every option.
- Alternatives before commitment.
- Revisit earlier steps when new facts appear.

## Done when

- Design doc exists (or user waived file with explicit note), user approved, and **`implementation-plan-authoring`** was offered or completed.

Aligned with basis as of 2026-03 — prior brainstorming workflow (distilled).
