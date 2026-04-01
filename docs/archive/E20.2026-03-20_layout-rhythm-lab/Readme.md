# Epic E20: Layout & Rhythm Lab

## 목표

디자인 시스템의 레이아웃과 리듬 토큰(Spacing, Grid, Motion)을 시각적으로 탐색하고 검증할 수 있는 랩 페이지를 추가한다.
TokenLab에 값만 나열되어 있는 상태에서 벗어나, 실제 토큰이 어떻게 공간과 움직임을 만드는지 체감할 수 있는 인터랙티브한 경험을 제공한다.

## 배경 / 맥락

기존 랩 페이지는 색상(PaletteLab), 스타일(StyleLab), 타이포그래피(FontLab)를 커버하지만,
공간과 리듬에 해당하는 Spacing / Grid / Motion 토큰은 TokenLab의 테이블 뷰에서만 값으로 확인 가능하다.
레이아웃 설계 시 실제 토큰이 어떻게 보이는지 시각적으로 확인할 수단이 없어 불편함이 있었다.

## 특이점

- Spacing, Grid, Motion 세 카테고리는 성격이 다르지만 "레이아웃과 리듬"이라는 공통 맥락을 가져 하나의 랩으로 묶는다.
- Grid 토큰은 현재 정의되지 않아 Phase 내에서 도메인 토큰 정의와 랩 UI를 함께 작업한다.
- Motion 시각화는 실제 CSS 애니메이션을 사용해 easing 커브와 duration 차이를 체감할 수 있게 한다.
- 기존 Lab 페이지 패턴(섹션 패널 + 선택 상태 + 디테일)을 따른다.

## Phase 목록

- [P01: Spacing Lab](./P01.spacing-lab.md)
- [P02: Grid Lab](./P02.grid-lab.md)
- [P03: Motion Lab](./P03.motion-lab.md)

## 상태

- [x] P01 완료
- [x] P02 완료
- [x] P03 완료

## 완료
아카이브일: 2026-04-01
