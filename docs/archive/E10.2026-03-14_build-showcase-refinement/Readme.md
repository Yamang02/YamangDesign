# Epic E10: build-showcase-refinement

## 목표
Build 메뉴(Atoms / Molecules / Organisms) 페이지와 컴포넌트 상세 모달을 정비한다.
UI 4가지(Examples 제거, 1행 레이아웃, 토큰 스타일, 명칭)와 코드 리팩토링(공유 TokenSection, ComponentCard 레이블, shell 토큰 정리)을 한 번에 처리한다.

## 배경 / 맥락
- Atoms 페이지에 Examples 섹션이 남아 있어 Atom 쇼케이스와 섞임
- 모달 내 Design Tokens 섹션 스타일이 다른 Lab 페이지의 DetailPanel과 시각적으로 어울리지 않음
- Molecules / Organisms 모달의 "Design tokens" 명칭이 실제 의미(조합 레벨 핵심 토큰)와 불일치
- Organisms 카드가 Atom과 같은 그리드에 배치되어 복잡한 요소가 작은 카드에 압축됨
- `ComponentDetail` / `MoleculeTokenDetail` / `OrganismTokenDetail`이 3벌로 중복
- Organisms의 `build-content.ts`에 `--shell-*` 토큰이 포함되어 palette/style 선택기에 반응하지 않음
- `ComponentCard`의 "Atoms:" 레이블이 하드코딩되어 Organism 카드에도 그대로 노출

## 특이점
- Design Tokens 섹션 스타일은 DetailPanel 느낌으로 리디자인: 카테고리 타이틀 배경·테두리 제거, 행 구조를 flex column으로 단순화
- Molecules / Organisms 섹션 타이틀은 "Design tokens" → "Key tokens"로 변경 (Atoms는 유지)
- 공유 `TokenSection` 컴포넌트는 prefix strip(`--ds-`, `--sys-`, `--shell-`)과 카테고리 분류를 6개 슈퍼셋으로 통합
- `form-example` 관련 코드(EXAMPLES_IDS, tocItems, VARIANT_COUNTS)는 깔끔하게 전부 제거

## Phase 목록
- [P01: ui-quick-wins](./P01.ui-quick-wins.md)
- [P02: token-section-restyle](./P02.token-section-restyle.md)

## 상태
- [x] P01 완료
- [x] P02 완료

## 완료
아카이브일: 2026-03-18
