---
name: systematic-debugging
description: Use when hitting any bug, test failure, unexpected behavior, flaky test, or build error — complete root-cause investigation before proposing fixes.
source: vibe_boilerplate@E26
---

# Systematic Debugging

**Iron law:** **No fix before finishing Phase 1 (investigation).** Symptom patches without root cause are failure.

**Rigid** skill — do not shorten the phases.

## Phase 1 — Root cause investigation

Before **any** fix:

1. **Read errors fully** — message, code, stack, file:line; don’t skim.
2. **Reproduce** — exact steps; every time vs intermittent. If not reproducible, gather data; don’t guess.
3. **Recent changes** — `git log`, diff, deps, env, CI vs local.
4. **Multi-component systems** — at each boundary, log inputs/outputs once to see **where** state goes wrong, then drill into that layer only.
5. **Trace data flow** — follow bad values **up** to origin; fix at **source**, not symptom.

## Phase 2 — Pattern analysis

1. Find **similar working** code in this repo.
2. Read reference implementations **completely** when the bug is “pattern misuse.”
3. List **differences** between working and broken (don’t dismiss “small” diffs).
4. List dependencies, config, assumptions.

## Phase 3 — Hypothesis and minimal test

1. State one clear hypothesis: “Root cause is X because Y.”
2. **Smallest** experiment to confirm or falsify — one variable.
3. If falsified, **new** hypothesis — don’t stack unrelated fixes.
4. If unknown — say so; ask; research — don’t pretend.

## Phase 4 — Fix

1. **Failing test first** (automated or smallest repro) — use **`layered-tdd-workflow`** for production code tests.
2. **One** logical fix — no drive-by refactors.
3. Verify: original issue gone; no new failures.
4. If fix fails: count attempts. Fewer than three → back to Phase 1 with new info. Three or more → stop: likely **architecture** problem — discuss with user before more patches.

## Red flags (stop → back to Phase 1)

- “Quick fix for now”
- Changing several things before re-running checks
- Skipping reproduction
- Fix without failing test
- “Probably X” without evidence
- Third failed fix attempt without architecture discussion

## Done when

- Root cause stated with evidence, fix verified, tests cover regression — or you stopped with documented investigation + ask for direction.

Aligned with basis as of 2026-03 — prior systematic-debugging (distilled).
