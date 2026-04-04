# Epic E29: CraftLab — CSS/렌더링 기법 레퍼런스 갤러리

## 목표

- 헤더 Labs 내비게이션에서 `craft`를 선택하면 CraftLab이 열리고, `LabLayout` TOC·섹션 스크롤로 각 기법을 탐색할 수 있다 (앱은 `PageName` 기반 SPA이며 별도 URL 라우터 없음)
- 각 Craft 섹션은 기법 설명, 라이브 예시, 코드 스니펫을 포함한다
- `border-image-slice` 기법과 `@chenglou/pretext` 텍스트 레이아웃 기법 각각 1개 섹션이 구현되어 있다
- 새 Craft를 추가하는 절차를 정의한 `yamang-craft` 스킬(레포 `.cursor/skills`)이 존재하고, 다음 기법 추가 시 사용 가능하다

## 배경 / 맥락

### 현재 상태

Design Labs는 전부 Design System 토큰 탐색 도구(PaletteLab, StyleLab, FontLab 등)다. 아트 페이지(Golconda 등)에서 `border-image-slice`, `@chenglou/pretext` 같은 창의적 렌더링 기법을 사용했으나 해당 기법을 학습·참조할 공간이 없다.

### 문제

기법을 쓸 때마다 MDN이나 외부 자료를 새로 찾아야 하고, 직접 구현한 예시가 프로젝트 안에 남지 않아 재사용 및 영감 획득이 어렵다.

## 특이점

- CraftLab은 DS 토큰을 탐색하는 공간이 아니라 **기법 자체를 카탈로그화**하는 공간이다. DS 변수(`--ds-spacing-*` 등)는 레이아웃 일관성 목적으로만 사용하고, craft 예시 내 스타일은 독립 상수로 선언한다.
- 각 Craft는 `src/app/pages/labs/CraftLab/crafts/{CraftName}/` 폴더에 완전 자급자족한다 — 아트 작품 폴더 패턴과 동일한 원칙.
- `yamang-craft` 스킬은 `yamang-art-page-workflow` 스킬 구조를 기준 삼아 작성하되, art의 "3챕터"에 대응하는 Craft의 "3구성요소"(설명 / 라이브 예시 / 코드 스니펫)를 정의한다.
- 스킬 원본은 레포 `.cursor/skills/yamang-craft/SKILL.md`에 두고, 필요 시 로컬 `.claude/skills` 등으로 복사·심링크하는 것은 팀/개인 워크플로에 따른다.

## Phase 목록

- [P01: 기반 구조 및 라우팅](./P01.foundation-routing.md)
- [P02: border-image-slice Craft](./P02.border-image-craft.md)
- [P03: Pretext 텍스트 레이아웃 Craft](./P03.pretext-craft.md)
- [P04: yamang-craft 스킬 작성](./P04.yamang-craft-skill.md)

## 상태

- [x] P01 완료
- [x] P02 완료
- [x] P03 완료
- [x] P04 완료

## 완료

아카이브일: 2026-04-04
