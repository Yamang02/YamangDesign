# Epic E21: Responsive & Palette Composability

## 목표

디자인 시스템의 두 가지 핵심 조합 가능성을 완성한다.
- 뷰포트에 따른 크롬/레이아웃의 반응형 적응 (브레이크포인트 토큰 → 크롬 수정 → 레이아웃 → 랩)
- 브랜드 색상과 중립 색상을 독립적으로 선택·조합 가능한 팔레트 구조로 분리

## 배경 / 맥락

현재 Header/Nav는 모바일 뷰포트에서 메뉴와 글자가 깨지며, 레이아웃들도 반응형이 없는 상태다.
브레이크포인트 토큰이 도메인에 존재하지 않아 CSS 미디어 쿼리 기준값이 산발적으로 정의될 위험이 있다.

팔레트 쪽에서는 `PaletteDefinition.colors.neutral`이 브랜드 색상과 함께 번들로 묶여 있어,
neutral을 독립 축으로 자유롭게 조합하기 어렵다.
`LayoutPreviewControlsContext`에서 이미 `neutralPreset`을 별도 축으로 운영하고 있어
도메인 모델이 그 의도를 따라가지 못하는 상태다.

## 특이점

- 반응형 Phase는 토큰 → 크롬 → 레이아웃 → 랩 순서로 진행한다. 랩은 완성된 반응형을 검증하는 무대가 된다.
- ResponsiveLab은 미리보기 컨테이너 방식(뷰포트 시뮬레이터)으로 구현한다. iframe이 아닌 resizable div 기반.
- `PaletteDefinition.colors`에서 `neutral`을 제거하고 `recommendedNeutral?: NeutralPresetName` 힌트 필드로 대체한다.
- 팔레트 분리는 기존 타입 구조를 크게 바꾸지 않고, 모델이 이미 존재하는 Context의 의도를 따라가도록 맞춘다.

## Phase 목록

- [P01: 브레이크포인트 토큰](./P01-breakpoint-tokens.md)
- [P02: 크롬 반응형](./P02-chrome-responsive.md)
- [P03: 레이아웃 반응형](./P03-layout-responsive.md)
- [P04: ResponsiveLab](./P04-responsive-lab.md)
- [P05: PaletteDefinition neutral 분리](./P05-palette-neutral-split.md)
- [P06: 프리셋 마이그레이션](./P06-preset-migration.md)
- [P07: PaletteLab UI 브랜드/중립 독립 축](./P07-palettelab-ui.md)

## 상태

- [x] P01 완료
- [x] P02 완료
- [x] P03 완료
- [x] P04 완료
- [x] P05 완료
- [x] P06 완료
- [x] P07 완료
