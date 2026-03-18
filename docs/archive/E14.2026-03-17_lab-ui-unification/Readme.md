# Epic E14: Lab UI 통일 & 동적 구조 점검

## 목표

각 랩(Style / Token / Font / Palette)의 UI 양식을 통일하고,
새로운 요소가 추가되었을 때 Overview를 비롯한 각종 섹션이
자동으로 반영될 수 있는 동적 구조인지 점검한다.
또한 렌더링되는 데이터가 산재 없이 충분히 그룹화되어 있는지 평가하고 개선한다.

## 배경 / 맥락

E13(Design System Standardization)에서 섹션 컴포넌트(ComparisonGrid, TokenValueRow,
MetadataTable 등)를 도입하고 TabBar까지 적용했으나, 각 랩의 실제 렌더링 결과를
일관된 기준으로 점검한 적은 없다.

- 랩마다 Overview 카드 구조·정보 밀도·섹션 구분이 다르게 구현된 상태
- 토큰/스타일/폰트 항목 추가 시 Overview가 자동 반영되는 랩과 수동 수정이 필요한 랩 혼재
- 일부 데이터는 카테고리 없이 나열되거나, 연관 항목이 서로 다른 섹션에 산재

## 특이점

- **UI 양식 통일 기준**: E13 P04에서 확립된 섹션 시스템(ComparisonGrid, TokenValueRow,
  MetadataTable, TabBar)을 기준점으로 삼는다. 컴포넌트가 없는 패턴만 신규 도입.
- **동적 구조 기준**: 항목 추가 시 JSON/데이터 편집만으로 Overview + 본문 섹션이
  함께 업데이트되면 "동적"으로 본다. 컴포넌트 수정 없이 반영 가능해야 함.
- **데이터 그룹화 기준**: 사용자가 한 화면에서 연관 정보를 한눈에 볼 수 있는지가
  판단 기준. 스크롤 없이 컨텍스트가 완결되어야 하는 정보는 동일 섹션에 배치.

## Phase 목록

- [P01: 랩 UI 현황 감사](./P01-lab-ui-audit.md)
- [P02: UI 양식 통일 적용](./P02-ui-form-unification.md)
- [P03: 동적 섹션 구조 점검 및 보완](./P03-dynamic-section-check.md)
- [P04: 데이터 그룹화 평가 및 개선](./P04-data-grouping.md)

## 상태

- [x] P01 완료
- [x] P02 완료
- [x] P03 완료
- [x] P04 완료 (코드 변경 없음 — 데이터 그룹화 이미 적절)

## 완료
아카이브일: 2026-03-18
