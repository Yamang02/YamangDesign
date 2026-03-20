# Epic E22: Art Reference Gallery

## 목표

회화 작품을 디자인 인스피레이션 소스로 활용하는 Art Reference Gallery를 신설한다.
각 작품 페이지는 해당 작품의 시각적 철학을 반영한 고유한 스타일(글라스모피즘, 미니멀리즘 등)로 제작되며,
직접 이미지 참조 구간과 심상만 차용한 인터랙티브 구간으로 나뉜다.
첫 작품은 Claude Monet — Water Lilies (1906)이며, 글라스모피즘 스타일을 적용한다.

## 배경 / 맥락

YamangDesign은 디자인 시스템 도구로서 색상·타이포·간격·모션을 다루는 Labs를 보유한다.
Art Reference Gallery는 이를 확장하여, 실제 미술 작품에서 디자인 DNA를 추출·시각화하는
새로운 카테고리를 추가한다. Labs가 시스템을 "설명"한다면, Art는 시스템에 "영감"을 부여한다.

## 특이점

- Art 페이지는 기존 LabLayout을 사용하지 않는 풀블리드 커스텀 레이아웃이다.
- `_shared/ArtShell`은 모든 아트 페이지가 공유하는 레이아웃 shell이다 (좌측 sticky 챕터 네비 전용).
  챕터 콘텐츠는 각 작품 페이지가 완전히 자급자족한다.
- 기존 DS CSS 변수(`--ds-spacing-*`, `--ds-text-*`)는 레이아웃/타이포 일관성 용도로만 참조한다.
  ThemeProvider·token-set에는 변경을 가하지 않는다.
- 페이지는 세 챕터로 구성: Chapter 1(직접 이미지 참조) + Chapter 2(심상 차용 인터랙티브) + Chapter 3(팔레트 × DS 토큰 컴포넌트 적용).
- Art 카테고리는 Nav 최상위 드롭다운으로 추가되며, 작품이 늘어나면 항목이 쌓인다.

## Phase 목록

- [P01: Nav 통합 및 라우팅](./P01.nav-routing.md)
- [P02: Chapter 1 — The Painting](./P02.chapter1-painting.md)
- [P03: Chapter 2 — The Impression](./P03.chapter2-impression.md)
- [P04: ArtShell + Chapter 3 — The Application](./P04.art-shell-chapter3.md)

## 상태

- [x] P01 완료
- [x] P02 완료
- [x] P03 완료
- [ ] P04 완료
