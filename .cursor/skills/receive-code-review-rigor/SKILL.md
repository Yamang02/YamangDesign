---
name: receive-code-review-rigor
description: Use when processing code review feedback — verify each point against the codebase before implementing; clarify ambiguities first; no performative agreement.
source: vibe_boilerplate@E26
---

# Receive Code Review (Rigor)

**Principle:** Feedback is **input to verify**, not automatic orders.

## Response pattern

1. **Read** all comments without implementing.
2. **Understand** — restate each item in technical terms; **ask** if any item is ambiguous.
3. **Verify** against repo reality (tests, callers, constraints).
4. **Evaluate** — correct for this codebase? YAGNI? Conflicts with earlier decisions?
5. **Respond** — concise technical reply or reasoned pushback.
6. **Implement** — one item at a time; test after each; no batching unclear items.

## Forbidden

- Empty praise: “You’re absolutely right”, “Great point”, “Thanks!”
- “Implementing now” before understanding
- Implementing items 1–3 while 4–5 are still unclear

## Unclear feedback

If **any** item is unclear: **stop**; ask for clarification on **all** unclear items before coding.

## External reviewers

Before implementing:

- Correct for **this** stack and repo?
- Breaks callers or public API?
- Reason the current code exists?
- If wrong: push back with evidence.

If suggestion adds “proper” features: **grep for usage** — unused → propose delete (YAGNI).

## Push back when

- Breaks behavior or contracts
- Reviewer lacks context
- Violates YAGNI
- Conflicts with maintainer’s prior architecture call

## Good acknowledgments

- “Fixed: [what changed] in [where].”
- “Verified: you were correct about X; implementing.”
- Or **just the fix** in code without praise.

## Order for many items

1. Clarify all
2. Blocking / security
3. Simple fixes
4. Larger refactors  
Test each.

## Done when

- Each item is resolved, deferred with reason, or pushed back with technical justification.

**Rigid** on “verify before implement” and “no performative agreement.”

Aligned with basis as of 2026-03 — prior receiving-code-review (distilled).
