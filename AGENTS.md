# Agent Instructions

## Skills

- **Source of truth:** `.cursor/skills/<name>/SKILL.md` in this repo.
- **Common skills:** Ported from `vibe_boilerplate@E26`. Each file has `source:` metadata for traceability.
- **Project-specific skills:** `yamang-design-stack`, `yamang-art-page-workflow`.

## Exclusivity

- Prefer **only** this tree's skills for the workspace. If you also attach other global or per-project skill folders, overlapping `description` triggers can fire twice — disable duplicates in your editor settings.

## Suggested Routing

1. Start turns with **`basis-skill-gate`** (invoke or follow its rules).
2. Epic / Phase / archive docs → **`epic-lifecycle`**.
3. **Project conventions** (styling, tokens, components, path aliases) → **`yamang-design-stack`**.
4. Code by stack → `typescript-stack`, `react-stack` as applicable.
5. Behavior-preserving refactor → `refactoring-workflow`.
6. Local SonarQube analysis, triage, re-analysis → `local-sonarqube-agent-workflow`; pair with `evidence-before-completion` and `request-code-review` as needed.
7. Security by development stage:
   - Implementation → `secure-coding-checklist`
   - Review / pre-merge → `security-review` (pair with `request-code-review`)
8. Art gallery pages → `yamang-art-page-workflow`.
9. See **`epic-lifecycle`** optional routing table for the rest of the workflow skills.

## 프로젝트 규모

- **티어:** S — 단일 저장소 POC, 소규모·에이전틱 워크플로 중심.

## Git 브랜치 (GC-01)

- 에픽: `epic/E##-{scope}`
- Phase/기능: `feat/E##/P##-{scope}`, `fix/E##/…` 등 — `docs/epic`의 E##·P##와 대응.

## AI Policy Generation

Ignore file generation (`.claudeignore`, `.cursorignore`) is managed by:

```bash
node ai/generate.js
```

Source: `ai/rules.yaml` (ignore patterns only).
