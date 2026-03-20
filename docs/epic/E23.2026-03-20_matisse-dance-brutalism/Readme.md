# Epic E23: Matisse Dance II — Brutalism Art Page

## 목표

앙리 마티스의 《춤 II》(1910)를 브루탈리즘 사조로 해석한 아트 레퍼런스 페이지를 구현한다.
원화의 3색(빨강·초록·파랑)을 팔레트 기반으로, 글라스모피즘 요소를 하드 보더·솔리드 색상·오프셋 섀도우 등 브루탈리즘 토큰으로 대체한다.
동시에 두 작품에서 실제로 겹치는 공통 컴포넌트를 `_shared/`로 추출해 재사용 구조를 확립한다.

## 배경 / 맥락

E22에서 모네 《수련》 페이지가 완성되어 아트 레퍼런스 갤러리의 첫 번째 작품이 추가됐다.
두 번째 작품을 추가하면서 실제로 겹치는 패턴(MuseumLabel, PaletteSwatchBar, HeroStage 레이아웃, Ch.3 블록 구조)을 공통 컴포넌트로 추출한다.
마티스 페이지는 모네 페이지의 글라스모피즘과 대조되는 브루탈리즘 사조를 적용해, 갤러리 내 사조 다양성을 확보한다.

## 특이점

- **브루탈리즘 토큰:** `backdrop-filter` 제거, `border-radius: 0`, `border: 3px solid #1C1C1C`, `box-shadow: 4px 4px 0 #1C1C1C` (오프셋 하드섀도우)
- **팔레트:** 원화 3색(Matisse Red `#C8361A`, Dance Green `#2E6B35`, Sky Blue `#1A4F8C`) + 브루탈 중성색(Cement `#B0A89A`, Raw White `#F2EFE8`, Charcoal `#1C1C1C`)
- **Ch.2 인터랙션:** 타이포그래피 기반 — 거대한 텍스트가 마우스 위치에 따라 글자별로 3색 반응
- **공통화 전략(Option 3):** MuseumLabel·PaletteSwatchBar는 즉시 `_shared/`로 이동, ArtHeroStage·ArtApplicationSection은 Matisse 구현하면서 동시에 신규 생성 후 MonetWaterLilies도 업데이트
- **ThemeProvider / token-set 수정 금지** — 작품 전용 색상은 컴포넌트 내 상수로 선언

## Phase 목록

- [P01: 공통 컴포넌트 추출](./P01.shared-components.md)
- [P02: MatisseDanceII 페이지 구현](./P02.matisse-page.md)
- [P03: 라우팅 통합 + 마무리](./P03.routing-finalize.md)

## 상태

- [ ] P01 완료
- [ ] P02 완료
- [ ] P03 완료
