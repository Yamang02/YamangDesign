---
name: evidence-before-completion
description: Use immediately before claiming work is complete, tests pass, builds succeed, or bugs are fixed — run the real verification commands in this session and cite outcomes.
source: vibe_boilerplate@E26
---

# Evidence Before Completion

**Iron law:** **No success claim without fresh command output** you just ran and read.

## Gate (every completion claim)

1. **Identify** the command(s) that **prove** the claim (tests, lint, build, manual repro script).
2. **Run** the full command(s) now — not “earlier”, not “should”.
3. **Read** exit code and output; count failures.
4. **Match** output to the claim — if mismatch, state actual result with evidence.
5. **Only then** phrase success.

Skipping a step = misrepresentation.

## Claim → evidence

| Claim | Need |
|-------|------|
| Tests pass | Test runner output: 0 failures |
| Lint clean | Linter: 0 errors (scoped as project defines) |
| Build OK | Build command exit 0 |
| Bug fixed | Repro gone + regression test if applicable |
| Requirements met | Checklist vs behavior, not “tests green” alone |

## Forbidden

- “Should work”, “probably”, “seems fine”
- Celebratory “Done!” before verification
- Trusting another agent’s “success” without local check
- Partial suite as proof of full claim

## Regression test

For bugfixes: prefer **fail → fix → pass**; optional revert fix to see test fail again when practical.

## Done when

- You either ran verification and quoted outcome, or you explicitly said work is **not** verified and what’s missing.

**Rigid** skill.

Aligned with basis as of 2026-03 — prior verification-before-completion (distilled).
