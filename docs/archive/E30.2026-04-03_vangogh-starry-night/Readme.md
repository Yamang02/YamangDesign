# Epic E30: vangogh-starry-night

## 목표

- `/art/starry-night` 라우트에서 Van Gogh — The Starry Night (1889) 아트 페이지가 세 챕터로 렌더된다.
- Ch.2에서 자화상이 `StarryNightFrame`으로 감싸지고, 좌측은 CSS `border-image` 9-slice·우측은 Canvas 물결 링(`StarryNightCanvasBorder`)을 **동일 폭 슬라이더**로 나란히 비교할 수 있다.
- `border-image-repeat` 키워드와 Canvas 쪽 `prefers-reduced-motion` 대체(motion 셀렉트)를 패널에서 바꿀 수 있다.
- Canvas 변형에서 링 텍스처·데칼(별·달·나무)은 `starryNightRingPath`와 동일한 기하로 잘려 테두리 밖으로 새지 않는다.
- Ch.3에서 Starry Night 팔레트 × DS 토큰 적용 섹션이 렌더된다.

## 배경 / 맥락

### 현재 상태

Art Reference Gallery에는 Matisse(Brutalism), Mondrian(Minimalism), Monet(Impressionism), Magritte(Surrealism) 네 작품이 등록되어 있다.

### 문제

Post-Impressionism 사조가 아직 없고, CSS `border-image`와 Canvas 기반 테두리를 **같은 화면에서** 비교할 여지가 없었다.

## 특이점

- Ch.2는 **두 패널 비교 UI**다: 동일 `max-width`·`portraitCrop`(3:4)로 시각 영역을 맞춘다.
- Canvas 링은 **`clip('evenodd')`**(물결 외곽 − 내부 라운드)로 채우고, 데칼 레이어는 **`clip-path: path(evenodd, …)`**로 동일 링만 노출한다. 경로 로직은 `starryNightRingPath.ts`에서 캔버스와 공유한다.
- `border-image-slice`를 HUD 숫자로 맞추는 초기 아이디어는 **폭·repeat·motion** 컨트롤로 대체되었다.
- 자화상: `public/art/starry-night/self-portrait.jpg` — 원화: `public/art/starry-night/hero.jpg`.
- StyleLab 아르누보 프리셋 이식은 이 에픽 범위 밖.

### 구현 참고 (Ch.2 프레임)

- 링 텍스처는 캔버스에만 그린다. `.frameCanvas` 배경은 **단색**(`#152a5c`)으로 자화상 톤과 맞추고, 전면 `seamless` 타일은 쓰지 않는다.
- **에셋**: halo는 PNG 3종; `Swirl_Halo_C.png`는 목록에서 제외된 경우 저장소에서 삭제해도 된다.

## Phase 목록

- [P01: 셸 + 라우팅 + Ch.1](./P01.shell-routing-ch1.md)
- [P02: Ch.2 StarryNightFrame](./P02.starry-night-frame.md)
- [P03: Ch.3 Application](./P03.application-section.md)

## 상태

- [x] P01 완료
- [x] P02 완료
- [x] P03 완료

## 완료

아카이브일: 2026-04-04
