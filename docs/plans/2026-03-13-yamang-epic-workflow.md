# Yamang Epic Workflow Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 글로벌 `yamang-epic` 스킬을 등록하고, 새 epic/phase 체계를 수립한 뒤 기존 docs를 정리한다.

**Architecture:** `~/.claude/skills/yamang-epic/SKILL.md`에 에픽 라이프사이클(생성/Phase관리/아카이브) 스킬을 등록한다. 이후 첫 에픽 E01을 생성하여 v7 아카이브·루트 문서 편입 작업을 기록하고 실행한다.

**Tech Stack:** Markdown, bash (mv/mkdir), Claude Skills system

---

### Task 1: 글로벌 스킬 디렉토리 생성

**Files:**
- Create: `~/.claude/skills/yamang-epic/SKILL.md`

**Step 1: 디렉토리 생성**

```bash
mkdir -p ~/.claude/skills/yamang-epic
```

Expected: 오류 없이 생성됨

**Step 2: SKILL.md 작성**

아래 내용으로 `~/.claude/skills/yamang-epic/SKILL.md` 생성:

```markdown
---
name: yamang-epic
description: Use when creating epics, writing or updating phase docs, or archiving completed epics in YamangDesign docs workflow
---

# Yamang Epic Workflow

## Overview

YamangDesign 문서화 워크플로우. 에픽 생성 → Phase 작성 → 완료 시 아카이브까지 전 과정을 커버한다.

## Document Structure

```
docs/epic/
  E##.YYYY-MM-DD_{epic명}/
    Readme.md          # 고수준: 목표, 배경, 특이점, Phase 목록
    P##.{phase명}.md   # 저수준: 구현 상세 + 체크리스트

docs/archive/
  {epic명}/            # 완료된 에픽 (원본 파일 그대로 유지)
```

---

## Operation: CREATE_EPIC

에픽을 새로 생성할 때 사용.

**체크리스트:**
- [ ] `docs/epic/` 안에서 가장 큰 E## 번호 확인 → 다음 번호 결정
- [ ] 디렉토리 `docs/epic/E##.YYYY-MM-DD_{epic명}/` 생성
- [ ] 아래 템플릿으로 `Readme.md` 작성

**Readme.md 템플릿:**

```markdown
# Epic E##: {epic명}

## 목표
(이 에픽이 달성하려는 것 — 2~4줄)

## 배경 / 맥락
(왜 이 작업이 필요한가, 이전 상태)

## 특이점
(설계 결정, 트레이드오프, 주의사항)

## Phase 목록
- [P01: {phase명}](./P01-{phase명}.md)

## 상태
- [ ] P01 완료
```

---

## Operation: CREATE_PHASE

에픽에 Phase를 추가할 때 사용.

**체크리스트:**
- [ ] 에픽 디렉토리 안에서 가장 큰 P## 번호 확인 → 다음 번호 결정
- [ ] `P##.{phase명}.md` 생성
- [ ] 에픽 `Readme.md`의 Phase 목록 및 상태 체크리스트에 항목 추가

**P##.md 템플릿:**

```markdown
# P##: {phase명}

## 목표
(이 Phase가 끝나면 달성되는 것)

## 구현 상세
(접근 방법, 변경 파일, 주요 결정)

## 체크리스트
- [ ] 항목 1
- [ ] 항목 2
```

---

## Operation: ARCHIVE_EPIC

에픽의 모든 Phase가 완료되었을 때 사용.

**체크리스트:**
- [ ] 모든 Phase의 체크리스트 항목이 완료되었는지 확인
- [ ] `docs/epic/E##.날짜_이름/` → `docs/archive/{이름}/` 이동
- [ ] `docs/archive/{이름}/Readme.md` 맨 아래에 완료일 기록:
  ```
  ## 완료
  아카이브일: YYYY-MM-DD
  ```
- [ ] 이동 후 `docs/epic/` 안에 에픽 디렉토리가 없는지 확인

---

## E## 번호 규칙

- `docs/epic/` 안의 디렉토리 이름에서 `E##` 추출
- `docs/archive/` 안은 번호 없음 (이름만)
- 번호는 에픽 생성 시점의 `docs/epic/` 기준으로만 산정
```

**Step 3: 스킬 파일 존재 확인**

```bash
ls ~/.claude/skills/yamang-epic/SKILL.md
```

Expected: 파일 경로 출력

---

### Task 2: 첫 에픽 E01 생성

**Files:**
- Create: `docs/epic/E01.2026-03-13_doc-restructure/Readme.md`

**Step 1: 에픽 디렉토리 생성**

```bash
mkdir -p docs/epic/E01.2026-03-13_doc-restructure
```

**Step 2: Readme.md 작성**

아래 내용으로 `docs/epic/E01.2026-03-13_doc-restructure/Readme.md` 생성:

```markdown
# Epic E01: doc-restructure

## 목표

기존에 산발적으로 관리되던 docs 파일들을 epic/phase 체계로 통합한다.
v7까지 사용하던 `docs/v7-token-redesign/` 패턴을 마무리하고,
`docs/epic/` 중심의 표준 워크플로우를 확립한다.

## 배경 / 맥락

- v2~v6: `docs/archive/{버전}/` 구조로 관리
- v7: `docs/v7-token-redesign/` (epic-overview + E0#.md) — 완료됨
- 루트에 `FEATURES.md`, `EPIC-PALETTE-SELECTION.md`, `TUTORIAL.md` 등 산발 문서 존재
- 이번부터 `docs/epic/E##.날짜_이름/` 구조로 통일

## 특이점

- v7 문서는 이미 구현 완료 → 내용 변경 없이 archive로 이동
- `TUTORIAL.md`는 에픽이 아닌 참조 문서 → `docs/design/`에 유지
- `FEATURES.md` 처리 방향은 P03 실행 시 내용 보고 결정

## Phase 목록

- [P01: v7-archive](./P01-v7-archive.md)
- [P02: epic-structure-setup](./P02-epic-structure-setup.md)
- [P03: root-docs-migration](./P03-root-docs-migration.md)

## 상태

- [ ] P01 완료
- [ ] P02 완료
- [ ] P03 완료
```

**Step 3: 확인**

```bash
cat docs/epic/E01.2026-03-13_doc-restructure/Readme.md
```

Expected: 위 내용 출력

**Step 4: Commit**

```bash
git add docs/epic/ ~/.claude/skills/
git commit -m "chore(docs): add yamang-epic skill and E01 epic directory"
```

---

### Task 3: Phase 파일 3개 생성

**Files:**
- Create: `docs/epic/E01.2026-03-13_doc-restructure/P01-v7-archive.md`
- Create: `docs/epic/E01.2026-03-13_doc-restructure/P02-epic-structure-setup.md`
- Create: `docs/epic/E01.2026-03-13_doc-restructure/P03-root-docs-migration.md`

**Step 1: P01-v7-archive.md 작성**

```markdown
# P01: v7-archive

## 목표

`docs/v7-token-redesign/`을 `docs/archive/v7-token-redesign/`으로 이동하여
완료된 v7 에픽을 공식 아카이브한다.

## 구현 상세

- 이동 대상: `docs/v7-token-redesign/` 전체 (epic-overview.md + E01~E04.md)
- 이동 위치: `docs/archive/v7-token-redesign/`
- 내용 변경 없음 (파일 이동만)
- 이동 후 `docs/v7-token-redesign/`에 대한 내부 링크가 있다면 수정

## 체크리스트

- [ ] `docs/archive/v7-token-redesign/` 디렉토리 생성
- [ ] `docs/v7-token-redesign/` 전체 이동
- [ ] `docs/design/17-token-3tier-reference.md`의 v7 링크 확인 및 수정
- [ ] `docs/TUTORIAL.md` 등 루트 문서의 v7 링크 확인 및 수정
- [ ] `git mv` 또는 이동 후 git 추적 확인
- [ ] Commit: `chore(docs): archive v7-token-redesign epic`
```

**Step 2: P02-epic-structure-setup.md 작성**

```markdown
# P02: epic-structure-setup

## 목표

`docs/epic/` 디렉토리 구조가 올바르게 수립되었음을 확인하고,
E01 에픽 자체가 새 체계의 첫 사례로 동작하는지 검증한다.

## 구현 상세

- Task 2~3에서 `docs/epic/E01.2026-03-13_doc-restructure/` 생성됨
- 이 Phase는 구조 수립 자체를 검증하는 Phase

## 체크리스트

- [ ] `docs/epic/E01.2026-03-13_doc-restructure/Readme.md` 존재 확인
- [ ] `P01`, `P02`, `P03` Phase 파일 존재 확인
- [ ] `docs/plans/` 디렉토리에 이 구현 계획 문서 존재 확인
- [ ] `~/.claude/skills/yamang-epic/SKILL.md` 존재 확인
- [ ] Commit: `chore(docs): verify epic structure setup`
```

**Step 3: P03-root-docs-migration.md 작성**

```markdown
# P03: root-docs-migration

## 목표

`docs/` 루트에 산발적으로 있는 문서들을 에픽 체계에 맞게 정리한다.

## 구현 상세

- `EPIC-PALETTE-SELECTION.md` → `docs/archive/palette-selection/Readme.md`
- `FEATURES.md` → 내용 검토 후 `docs/design/`으로 이동 또는 신규 에픽 생성
- `TUTORIAL.md` → `docs/design/TUTORIAL.md`로 이동 (참조 문서 유지)

## 체크리스트

- [ ] `EPIC-PALETTE-SELECTION.md` 내용 확인
- [ ] `docs/archive/palette-selection/` 디렉토리 생성
- [ ] `EPIC-PALETTE-SELECTION.md` → `docs/archive/palette-selection/Readme.md` 이동
- [ ] `FEATURES.md` 내용 확인 → 처리 방향 결정 (design/ 유지 or 새 에픽)
- [ ] `TUTORIAL.md` → `docs/design/TUTORIAL.md` 이동
- [ ] 이동된 파일들의 내부 링크 확인 및 수정
- [ ] Commit: `chore(docs): migrate root docs to epic structure`
```

**Step 4: 파일 존재 확인**

```bash
ls docs/epic/E01.2026-03-13_doc-restructure/
```

Expected: `P01-v7-archive.md  P02-epic-structure-setup.md  P03-root-docs-migration.md  Readme.md`

**Step 5: Commit**

```bash
git add docs/epic/E01.2026-03-13_doc-restructure/
git commit -m "chore(docs): add E01 phase files (P01-P03)"
```

---

### Task 4: P01 실행 — v7 아카이브

**Files:**
- Move: `docs/v7-token-redesign/` → `docs/archive/v7-token-redesign/`
- Check: `docs/design/17-token-3tier-reference.md`

**Step 1: v7 이동**

```bash
mkdir -p docs/archive/v7-token-redesign
git mv docs/v7-token-redesign/epic-overview.md docs/archive/v7-token-redesign/epic-overview.md
git mv docs/v7-token-redesign/E01-global-layer.md docs/archive/v7-token-redesign/E01-global-layer.md
git mv docs/v7-token-redesign/E02-alias-layer.md docs/archive/v7-token-redesign/E02-alias-layer.md
git mv docs/v7-token-redesign/E03-css-token-consistency.md docs/archive/v7-token-redesign/E03-css-token-consistency.md
git mv docs/v7-token-redesign/E04-token-lab.md docs/archive/v7-token-redesign/E04-token-lab.md
```

**Step 2: 루트 링크 검사**

```bash
grep -r "v7-token-redesign" docs/ --include="*.md"
```

Expected: 결과가 없거나 archive 내부 참조만 있어야 함. 외부 참조가 있으면 경로 수정.

**Step 3: P01 체크리스트 완료 처리**

`docs/epic/E01.2026-03-13_doc-restructure/P01-v7-archive.md` 내 체크리스트의 모든 항목을 `[x]`로 변경.

**Step 4: Readme.md 상태 업데이트**

`docs/epic/E01.2026-03-13_doc-restructure/Readme.md`에서:
```
- [ ] P01 완료
```
→
```
- [x] P01 완료
```

**Step 5: Commit**

```bash
git add docs/archive/v7-token-redesign/ docs/epic/E01.2026-03-13_doc-restructure/
git commit -m "chore(docs): archive v7-token-redesign (P01 complete)"
```

---

### Task 5: P02 실행 — 구조 검증

**Step 1: 구조 확인**

```bash
ls docs/epic/E01.2026-03-13_doc-restructure/
ls ~/.claude/skills/yamang-epic/
ls docs/plans/
```

Expected:
- epic 디렉토리: Readme.md + P01~P03.md 4개
- skills: SKILL.md
- plans: 이 문서

**Step 2: P02 체크리스트 완료 처리 + Readme.md 상태 업데이트**

`P02-epic-structure-setup.md` 체크리스트 전체 `[x]` 처리.
`Readme.md`에서 `- [ ] P02 완료` → `- [x] P02 완료`.

**Step 3: Commit**

```bash
git add docs/epic/E01.2026-03-13_doc-restructure/
git commit -m "chore(docs): verify epic structure setup (P02 complete)"
```

---

### Task 6: P03 실행 — 루트 문서 편입

**Files:**
- Read: `docs/EPIC-PALETTE-SELECTION.md`
- Read: `docs/FEATURES.md`
- Move: `docs/TUTORIAL.md` → `docs/design/TUTORIAL.md`
- Move: `docs/EPIC-PALETTE-SELECTION.md` → `docs/archive/palette-selection/Readme.md`

**Step 1: EPIC-PALETTE-SELECTION.md 이동**

```bash
mkdir -p docs/archive/palette-selection
git mv docs/EPIC-PALETTE-SELECTION.md docs/archive/palette-selection/Readme.md
```

**Step 2: TUTORIAL.md 이동**

```bash
git mv docs/TUTORIAL.md docs/design/TUTORIAL.md
```

**Step 3: FEATURES.md 처리**

파일 내용 확인 후:
- 에픽 성격이면 → `docs/archive/features/Readme.md` 이동
- 설계 참조 문서이면 → `docs/design/FEATURES.md` 이동

**Step 4: 링크 확인**

```bash
grep -r "TUTORIAL\|FEATURES\|EPIC-PALETTE" docs/ --include="*.md" | grep -v archive
```

외부 참조가 있으면 경로 수정.

**Step 5: P03 체크리스트 + Readme.md 상태 업데이트**

`P03-root-docs-migration.md` 전체 `[x]` 처리.
`Readme.md`에서 `- [ ] P03 완료` → `- [x] P03 완료`.

**Step 6: Commit**

```bash
git add -A
git commit -m "chore(docs): migrate root docs to epic structure (P03 complete)"
```

---

### Task 7: E01 아카이브

모든 Phase 완료 후 E01 자체를 아카이브한다.

**Step 1: 완료 확인**

`docs/epic/E01.2026-03-13_doc-restructure/Readme.md`에서 상태 섹션이 모두 `[x]`인지 확인.

**Step 2: 완료일 기록**

`Readme.md` 맨 아래에 추가:

```markdown
## 완료
아카이브일: 2026-03-13
```

**Step 3: 이동**

```bash
mkdir -p docs/archive/doc-restructure
git mv docs/epic/E01.2026-03-13_doc-restructure/* docs/archive/doc-restructure/
rmdir docs/epic/E01.2026-03-13_doc-restructure
```

**Step 4: Commit**

```bash
git add docs/archive/doc-restructure/ docs/epic/
git commit -m "chore(docs): archive E01 doc-restructure epic"
```
