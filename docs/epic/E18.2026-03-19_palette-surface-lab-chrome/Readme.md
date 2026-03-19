# Epic E18: 팔레트 Surface 계층 및 Lab 크롬 격리

## 목표

팔레트의 Surface 계층(surface-low / surface / surface-high)을 도입하여 카드·컨테이너·모달 등 UI 표면의 색상을 팔레트 단위로 자동 파생하고, Lab 페이지의 정보 영역(헤더, 레이블, 값)이 DS 토큰 변경에 영향받지 않도록 셸 토큰으로 격리한다.

## 배경 / 맥락

현재 시스템의 두 가지 문제:

1. **Surface 계층 부재** — `bg.surface`와 `bg.subtle`이 거의 동일한 neutral-50을 가리켜, 카드 배경·섹션 배경·호버 상태의 시각적 계층이 없다. 팔레트의 primary 색조가 surface에 반영되지 않아 배색 평가가 어렵다.
2. **Lab 크롬 누출** — TokenLab·StyleLab 등의 정보 테이블(헤더, 토큰 이름, 값)이 `--ds-color-*`를 사용하여, 팔레트를 바꾸면 Lab UI 자체의 가독성이 변한다. 컬러 스와치와 프리뷰만 테마 반응형이어야 한다.

## 특이점

- **Surface 파생은 pre-compute 방식.** `resolvePalette()` 단계에서 neutral + primary tint를 혼합하여 surface 레벨을 미리 계산한다. CSS `color-mix()`가 아닌 JS 단에서 hex를 산출.
- **기존 SemanticMapping 구조 확장.** `bg` 필드에 `surfaceLow` / `surfaceHigh`를 추가하되, 기존 `surface` / `surfaceBrand` / `elevated` / `muted`와의 역할을 재정의한다.
- **Shell 토큰 전환 범위는 "정보 영역"만.** 프리뷰 카드(`[data-context="preview"]`), 컬러 스와치(`.tokenSwatch`)는 `--ds-*`를 유지한다.
- **bgStrategy별 tint 비율이 다르다.** light는 3-6-10%, colored는 5-10-15%, dark는 반전 방향으로 적용.

## Phase 목록

- [P01: Lab 크롬 격리](./P01-lab-chrome-isolation.md) — TokenLab/StyleLab/PaletteLab CSS의 정보 영역을 shell 토큰으로 전환
- [P01.5: CSS @layer Cascade 체계](./P01.5-css-layer-cascade.md) — 주석 기반 레이어를 실제 CSS @layer로 전환, shell/ds/preview/override 우선순위 강제
- [P02: Surface 계층 타입 및 자동 파생](./P02-surface-hierarchy-derivation.md) — SemanticMapping bg 확장, colorMix 유틸, resolvePalette 통합
- [P03: bgStrategy별 surface 기본 매핑](./P03-strategy-surface-defaults.md) — light/colored/dark 각각의 surface tint 비율 정의
- [P04: Lab 프리뷰 surface 계층 시각화](./P04-lab-surface-preview.md) — PaletteLab/StyleLab에서 surface 계층을 시각적으로 확인할 수 있는 프리뷰
- [P05: 런타임 literal 0건 및 팔레트/매핑 정비](./P05-runtime-literal-zero-and-palette-mapping-rework.md) — 하드코딩 즉시 제거, 토큰 스키마 보강, 스케일/시맨틱 매핑 단일화

## 상태

- [ ] P01 완료
- [ ] P01.5 완료
- [x] P02 완료
- [x] P03 완료
- [ ] P04 완료
- [ ] P05 완료
