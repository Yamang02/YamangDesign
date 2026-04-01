---
name: epic-lifecycle
description: Use when creating or updating epic docs under docs/epic, adding or refreshing Phase files, running pre-archive epic review, or moving a completed epic to docs/archive — including E## numbering and directory layout.
source: vibe_boilerplate@E26
---

# Epic Lifecycle

Manage the **epic document lifecycle**: new epic, Phase files, checklist honesty, and archive. This skill encodes WF-02 procedures and DC-05 writing quality. It does **not** replace Git policy detail — branch names below are the minimum expected alongside epics (GC-01).

## Preconditions (read once per session)

1. **`basis-skill-gate`** already ran or applies: resolve which skills apply before acting.
2. **Docs vs Git:** Epic/Phase markdown describes **current intended state**. Change history lives in Git only — no change logs inside epic docs.
3. **Conflict priority:** (1) Document state matches reality (checkboxes, Phase status) → (2) `E##` / paths / filenames → (3) Each Phase is independently verifiable.

## Quality bar for text (DC-05 distill)

When writing or reviewing epic/Phase content, enforce:

| Area | Rule |
|------|------|
| Epic `## 목표` | State **finished outcomes** (what is true when done), not vague process. Exception: exploratory epics may use verifiable hypotheses. |
| Epic `## 배경 / 맥락` | Separate **current state (As-Is)** from **why change / problem**. |
| Epic `## 특이점` | Capture constraints, design decisions, tradeoffs, and **why** they exist. |
| Phase `## 목표` | Outcomes **verifiable within that Phase alone**; subset of epic intent; no hidden dependency on a later Phase for “done”. |
| Phase `## 구현 상세` | **Approach** + **change scope** (files to create/modify). No code-level dump. Exception: spike Phase may start with approach only and refine. |
| Phase `## 체크리스트` | **Result-based** items (“X renders”, “Y returns Z”), not “implement X”. Each item independently checkable. |

Propagation: if epic-level goals change, **update epic Readme first**, then affected Phase docs, then implementation.

## Document layout (fixed)

```
docs/epic/
  E##.YYYY-MM-DD_{epic-name}/
    Readme.md
    P##.{phase-name}.md

docs/archive/
  E##.YYYY-MM-DD_{epic-name}/   # same folder name after move; E## preserved
```

## E## numbering

1. Scan **`docs/epic/`** and **`docs/archive/`** directory names.
2. Extract `E##` (integer: E01, E02, …).
3. New epic id = **max + 1** across both trees.

## Git branches (expected with epics)

- Epic branch: `epic/E##-{scope}` when creating an epic (per project Git convention).
- Phase work branches: `{type}/E##/P##-{scope}` (e.g. `feat/E05/P01-cart-summary`).

Create or switch branches per team rules; naming must stay traceable to `E##` / `P##`.

---

## Operation A — CREATE_EPIC

**When:** A **new** epic folder is needed (not “add Phase to existing epic” — use Operation B).

**Steps:**

1. Compute next `E##` (see numbering above).
2. Create `docs/epic/E##.YYYY-MM-DD_{epic-name}/`.
3. Write `Readme.md`:

```markdown
# Epic E##: {epic-name}

## 목표
(2–4 lines: outcome states per DC-05)

## 배경 / 맥락
### 현재 상태
…
### 문제
…

## 특이점
…

## Phase 목록
- [P01: {phase-name}](./P01.{phase-name}.md)

## 상태
- [ ] P01 완료
```

4. Create epic branch `epic/E##-{scope}` if your workflow requires it.

**Done when:** Folder exists, `Readme.md` populated, first Phase linked (create `P01` file in Operation B if not done yet).

---

## Operation B — CREATE_PHASE

**When:** Adding a Phase or updating Phase docs while implementing.

**Steps:**

1. Inside the epic directory, find max `P##` → next index.
2. Create `P##.{phase-name}.md` using DC-05 sections (목표, 구현 상세, 체크리스트).
3. Update epic `Readme.md`: Phase list link + status checkbox for that Phase.
4. During implementation: after substantive code/docs changes, **update checklist items to match reality** immediately.
5. When the Phase is truly done: every checklist item `[x]`, then mark the Phase complete in epic `Readme.md`.

**Exception:** If “done” is unclear, split checklist items until each is verifiable.

**Done when:** Phase file exists, epic index updated, and checklists stay honest during work.

---

## Operation C — ARCHIVE_EPIC

**When:** All Phases are complete **and** epic completion review passed.

### C1 — Epic completion review (hard gate)

Do **not** move folders until all three pass:

1. **Epic goals:** Each bullet under epic `## 목표` is satisfied; traceability to Phase completion exists.
2. **Cross-Phase consistency:** No conflicting decisions; shared interfaces/types align.
3. **Backlog / deferrals:** Any deferred items from WF-03-style backlog or epic `특이점` are acknowledged (not silently dropped).

### C2 — Archive steps

4. Re-verify every Phase checklist against the codebase.
5. Re-verify epic `Readme.md` Phase checkboxes vs reality.
6. Move **`docs/epic/E##.YYYY-MM-DD_{epic-name}/`** → **`docs/archive/`** with the **same** directory name.
7. Append to archived `Readme.md`:

```markdown
## 완료
아카이브일: YYYY-MM-DD
```

(use the project’s locale if the repo standard differs; date required)

8. Confirm `docs/epic/` no longer contains this epic directory.

**Exception:** Without archive date, treat archive as invalid.

**Done when:** Folder only under `docs/archive/`, completion date recorded, epic tree clean.

---

## Phase design rules (WF-02-04)

- If an epic spans unrelated subsystems, **split epics** first.
- Each Phase delivers a **standalone demonstrable** increment.
- In `구현 상세`, list files to create/change; prefer single responsibility files; follow existing repo patterns.
- Checklist items: concrete, outcome-based, independently completable.

---

## Interleaving with other skills

- **Pure document operations** (A/B/C above): finish the document steps before unrelated code churn in the same turn unless the user explicitly combined requests — then complete epic-doc edits first, then code.
- **Design before implementation:** If requirements are not agreed, use **`creative-design-brainstorm`** before locking epic text.
- After epic docs for a slice are stable, implementation may use **`layered-tdd-workflow`**, **`systematic-debugging`**, etc., per routing table.

---

## Optional routing (same epic context)

Use these **additional** skills when the situation matches (names match `.cursor/skills/` folders). Load via `basis-skill-gate` order.

| Situation | Skill `name` |
|-----------|----------------|
| Need design agreement before implementation | `creative-design-brainstorm` |
| Items not yet promoted from backlog | `backlog-triage-and-epic-promotion` |
| Implementation plan file under `docs/plans/` | `implementation-plan-authoring` |
| Long-running plan outside Phase rhythm | `plan-execution-checkpoints` |
| Parallel agents / parallel implementation | `parallel-agent-dispatch`, `in-session-parallel-implementation` |
| Two checkouts for two branches | `git-worktree-isolation` |
| Domain/Application implementation & commit order | `layered-tdd-workflow` |
| TypeScript or React (not Next.js) | `typescript-stack`, `react-stack` |
| Java or Spring Boot | `java-stack`, `spring-boot-stack` |
| Python or FastAPI | `python-stack`, `fastapi-stack` |
| Unexpected behavior / bug hunt | `systematic-debugging` |
| Local SonarQube scan, triage, re-analysis, Sonar-informed review | `local-sonarqube-agent-workflow` |
| Before claiming work complete | `evidence-before-completion` |
| Merge / PR / branch cleanup | `branch-completion-options` |
| Sending or processing code review | `request-code-review`, `receive-code-review-rigor` |
| Yamang art gallery pages (if applicable) | `yamang-art-page-workflow` |

---

## Done when (whole skill)

- The active operation (A, B, or C) reached its **Done when** above, and DC-05 quality checks were applied to any text you wrote or edited.

Aligned with basis as of 2026-03 — WF-02 Epic Lifecycle Workflow, DC-05 (distilled).
