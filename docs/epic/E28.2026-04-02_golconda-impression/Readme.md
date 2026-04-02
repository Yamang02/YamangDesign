# Epic E28: Golconda — Impression Art Page

## 목표

- `src/app/pages/art/Golconda/` 페이지가 라우팅에 등록되어 브라우저에서 접근 가능하다.
- Ch.1에서 원화(`Golconda.jpg`)가 MuseumLabel·PaletteSwatchBar와 함께 표시된다.
- Ch.2에서 마이크로텍스트로 채운 신사 실루엣이 `Golconda_bg.png` 위에 비처럼 내려가고, Pretext 줄 단위로 지붕선 아래부터 순서대로 사라진다.
- 우산 커서(`cursor: none`)가 Canvas에 렌더된다. M·L만 우산에 반응해 줄 단위로 미끄러지고, XS·S는 낙하·지붕 클립만 적용한다.
- Ch.3에서 GOLCONDA_PALETTE 8색이 Color Tokens / Buttons / Typography / Art Card 4블록에 적용된다.

## 배경 / 맥락

### 현재 상태
Art Reference Gallery에 Monet·Matisse·Mondrian 세 작품 페이지가 있다.
각 페이지는 디자인 사조(글라스모피즘·브루탈리즘·미니멀리즘)를 중심으로 구성된다.

### 문제
Golconda(Magritte, 1953)는 특정 디자인 사조보다 **Pretext 기반 텍스트 정밀 측정** 인터랙션 자체가 콘셉트다.
기존 패턴의 스타일 사조를 그대로 대입하기 어렵고, Canvas + Pretext 조합의 신규 기술 패턴이 필요하다.

## 특이점

- **실루엣·텍스트**: 정규화 좌표로 신사 형상을 정의하고, 격자를 아주 작은 문자로 채운 뒤 **`@chenglou/pretext`**의 `prepareWithSegments` → `layoutWithLines`로 줄·폭을 측정한다 (`whiteSpace: 'pre-wrap'`). Canvas clip 없이 줄 단위로 지붕선 아래는 그리지 않음.
- **깊이 4단계(XS/S/M/L)**: 실루엣 크기·낙하 속도·불투명도 차이. **XS·S만** 지붕선 클립 대상이며 **우산과는 상호작용하지 않음**. **M·L**만 줄별 가로 슬라이드·인접 줄 전파·감쇠로 우산을 피한다.
- **티어 상수**: `gentlemen.ts`의 `GENTLEMAN_TIERS`로 분리해 교체·튜닝 가능.
- **지붕선**: `buildingMask.ts`에서 배경 `Golconda_bg.png`를 표시 크기로 그린 뒤 열별로 하늘↔비하늘을 스캔해 LUT를 만들고, 없거나 실패 시 해석 곡선으로 폴백한다. 시각 보정을 위해 **`ROOFLINE_SHIFT_DOWN_PX`**로 선을 아래로 밀 수 있음.
- **에셋**: Ch.1 `Golconda.jpg`, Ch.2 배경 `Golconda_bg.png`(신사 제거본).
- **Ch.3**: `ArtHeroStage` / `ArtApplicationSection`은 **`variant="glass"`**.

## Phase 목록

- [P01: 라우팅 & Ch.1 HeroStage](./P01.routing-ch1-herostage.md)
- [P02: 신사 파티클 시스템](./P02.gentleman-particle-system.md)
- [P03: 우산 인터랙션](./P03.umbrella-interaction.md)
- [P04: Ch.3 Application](./P04.ch3-application.md)

## 상태

- [x] P01 완료
- [x] P02 완료
- [x] P03 완료
- [x] P04 완료
