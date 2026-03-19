# Epic E17: 디자인 사조 표현력 강화 및 비교 인프라

## 목표

디자인 사조(Style)별 토큰 표현력을 높이고, 사조-팔레트 간 관계를 메타데이터로 정의하며, Overview·토큰 표시를 데이터 중심으로 재구성하여 사조 연구·비교에 최적화된 시스템을 구축한다.

## 배경 / 맥락

[20-style-system-review.md](../../design/20-style-system-review.md) 분석 결과, 현재 시스템의 세 가지 구조적 빈틈이 확인되었다.

1. **사조별 토큰 표현 부족** — radius, motion, typography가 전역 고정값이어서 Brutalism(0px radius, instant transition)과 Glassmorphism(16px+ radius, smooth transition)의 시각적 차이를 토큰으로 구분할 수 없다.
2. **사조-팔레트 결합 정보 부재** — Glassmorphism + light bgStrategy처럼 효과가 소멸하는 조합에 대한 경고·추천 메커니즘이 없다.
3. **Overview·토큰 표시의 정적 구조** — Lab 페이지의 Overview가 하드코딩된 텍스트 중심이며, 토큰 목록이 카테고리 자동 분류 외에 정렬·필터·비교 기능을 제공하지 않는다.

## 특이점

- **Palette ⊥ Style 직교성 유지가 대원칙.** 사조별 팔레트 제약은 "경고/추천"으로만 표현하고, 조합 자체를 차단하지 않는다.
- `createVars()` 훅을 활용하면 `StyleDefinition` 인터페이스 변경 없이 radius·motion 오버라이드를 구현할 수 있다. 인터페이스 확장보다 관례 확립을 우선한다.
- Overview 데이터 소스는 기존 `StyleDefinition`, `PaletteDefinition`, `ThemeTokenSet`에서 직접 추출한다. 별도 데이터 레이어를 만들지 않는다.

## Phase 목록

- [P01: 사조별 토큰 오버라이드](./P01-style-scoped-token-override.md) — createVars로 radius·motion 사조별 주입
- [P02: 스타일 메타데이터 및 팔레트 어피니티](./P02-style-metadata-palette-affinity.md) — StyleDefinition 메타데이터, bgStrategy 제약
- [P03: 역사적 팔레트 프리셋](./P03-historical-palette-presets.md) — 사조별 대표 배색 프리셋 추가
- [P04: 데이터 중심 Overview 재구성](./P04-data-driven-overview.md) — Lab Overview를 토큰 데이터에서 동적 생성
- [P05: 토큰 표시·정렬 UX 개선](./P05-token-display-sort.md) — 카테고리 그룹핑, 정렬, 필터, diff 하이라이트
- [P06: 사이드바이사이드 비교 뷰](./P06-side-by-side-comparison.md) — 동일 컴포넌트를 복수 사조로 나란히 비교

## 상태

- [ ] P01 완료
- [ ] P02 완료
- [ ] P03 완료
- [ ] P04 완료
- [ ] P05 완료
- [ ] P06 완료
