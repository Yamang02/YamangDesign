---
name: backlog-triage-and-epic-promotion
description: Use when triaging docs/backlog.md, deciding epic vs single-branch work before CREATE_EPIC, recording scope drift or design forks, or when an epic As-Is premise is wrong mid-Phase.
source: vibe_boilerplate@E26
---

# Backlog Triage and Epic Promotion

Single file: **`docs/backlog.md`**. Idea inbox stays **outside** the repo; this workflow only manages what already entered the backlog file.

## When to record (collection gate)

Record a row **only if** at least one holds:

| Code | Meaning |
|------|---------|
| **(a) Scope drift** | You found work that does **not** belong in the **current Phase’s stated change scope** (files/areas). |
| **(b) Design fork** | A decision will affect future architecture; deferring loses expensive context later. |

If neither applies:

- **Fix now** if it fits current Phase → no backlog line.
- **Drop** if forgetting it is acceptable.

**No active Phase:** use **(b)** only; **(a)** needs Phase scope to compare.

## Roles

- **(a)** Compare Phase “변경 범위 / 구현 상세” vs files you are about to touch → if out of scope, propose a backlog row.
- **(b)** Present **2–3 realistic options with tradeoffs** for the project scale; the human chooses: decide now, backlog, or discard.

## Row format (`docs/backlog.md`)

Use a table:

```markdown
# Backlog

| # | 설명 | 발견 맥락 | 상태 | 비고 |
|---|------|-----------|------|------|
| 1 | One-line problem or fork | Phase ID, file, or context | 수집됨 | |
```

**States:** `수집됨` → `에픽 승격` | `단건 처리` | `기각` (one-line reason in 비고).

## Promotion review (before CREATE_EPIC)

Run **before** `epic-lifecycle` CREATE_EPIC:

1. Read every open row in `docs/backlog.md`.
2. For each item ask: **Does this need two or more independently verifiable slices (like DC-05 Phase goals)?**
   - **Yes** → epic path: note “에픽 승격”, target epic id when created.
   - **No** → single feature branch / one Phase — mark “단건 처리”, implement under GC-01 branch rules.
3. **Defer:** leave state, re-check next time.
4. **Reject:** “기각” + reason.

**Exception:** urgent epic created without backlog first — create epic, then add a backlog row pointing to that epic id as “에픽 승격”.

**Conflict priority:** protect current epic/Phase scope → preserve context → minimize paperwork.

## As-Is error mid-Phase (WF-03-05)

If epic “배경/맥락” As-Is is **wrong**:

1. Stop Phase work that depends on the false premise.
2. Add backlog row (맥락에 Phase id + what was false).
3. Update epic Readme 배경/맥락 to match reality.
4. Impact:
   - **Phase only** → adjust Phase checklist/구현 상세, resume.
   - **Epic-wide** → redesign Phase list in epic docs.
   - **Goals invalid** → pause epic; new backlog item to redefine.

**Exception:** tiny fix → update Phase doc only, no backlog line.

## Done when

- Collection decisions are recorded or intentionally skipped with reason.
- Pre-epic review updated row states; or As-Is error path completed with docs fixed.

Aligned with basis as of 2026-03 — WF-03 (distilled).
