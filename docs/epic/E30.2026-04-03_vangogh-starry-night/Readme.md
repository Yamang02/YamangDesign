# Epic E30: vangogh-starry-night

## 목표

- `/art/starry-night` 라우트에서 Van Gogh — The Starry Night (1889) 아트 페이지가 세 챕터로 렌더된다.
- Ch.2에서 Van Gogh 자화상이 Canvas 소용돌이 붓터치 프레임으로 감싸지고, 마우스로 프레임 두께와 slice inset을 실시간 조정할 수 있다.
- `border-image-slice` 개념이 HUD 수치(slice value, border-width)로 시각적으로 학습 가능한 형태로 노출된다.

## 배경 / 맥락

### 현재 상태

Art Reference Gallery에는 Matisse(Brutalism), Mondrian(Minimalism), Monet(Impressionism), Magritte(Surrealism) 네 작품이 등록되어 있다.

### 문제

Post-Impressionism 사조가 아직 없고, Canvas API를 이용한 인터랙티브 임프레션이 없다. CSS `border-image-slice` 개념을 시각적으로 탐구하는 컴포넌트도 부재한다.

## 특이점

- Ch.2는 두 이미지를 조합한다: Starry Night 팔레트에서 추출한 소용돌이 Canvas 애니메이션이 자화상(`Self-Portrait`) 주변 frame 영역에만 그려진다.
- `border-image-slice`를 CSS 속성으로 직접 쓰지 않는다 — Canvas를 absolute 배치하고 마우스 Y로 frame 두께, X로 inset 비율을 조정하는 방식으로 동일한 시각 효과를 구현한다. 현재 수치는 HUD 레이블로 노출해 교육적 맥락을 유지한다.
- 자화상 이미지: `public/art/starry-night/self-portrait.jpg`
- Starry Night 이미지: `public/art/starry-night/hero.jpg`
- StyleLab 아르누보 프리셋 이식은 이 에픽 범위 밖. 별도 에픽으로 분리 예정.

### 구현 참고 (Ch.2 프레임 — 2026-04 결정)

- **비교 UI**: 동일 슬라이더로 프리뷰 폭을 공유하고, 좌측은 CSS `border-image` 9-slice, 우측은 **Canvas wavy ring**(`StarryNightCanvasBorder`)으로 나란히 비교한다.
- **텍스처 채움**: `seamless_bg.png`는 가로 시머리스 스트립이다. 임의 소형 타일 반복은 왜곡·줄무늬로 보일 수 있어, 링에는 **cover에 가깝게 한 장 덮기**를 우선한다.
- **SVG `pattern` + `fill`**: 브라우저·타이밍에 따라 링이 간헐적으로 비는 보고가 있어, 링 실루엣은 **Canvas 2D**로 고정하고, 합성은 **`clip('evenodd')`(외곽 직사각 − 내부 라운드)** 로 링 영역만 그리기를 우선한다. `destination-out`만으로 안쪽을 뚫는 방식은 합성/알파 환경에서 링 전체가 사라지는 케이스가 있어 지양한다.
- **CSS 폴백**: `.frameCanvas`에 `seamless_bg` 배경을 깔아, 캔버스 지연·실패 시에도 링 영역이 완전히 빈 화면처럼 보이지 않게 한다.
- **패딩 동기**: 캔버스 패딩은 `getComputedStyle`의 `--starryBorderX` / `--starryBorderY`와 `padding`을 함께 참고해 CSS와 맞춘다.
- **별(halo)**: 반짝임 애니메이션 한 사이클마다 위치를 랜덤 갱신한다(`onAnimationIteration`).
- **로컬 개발**: 동일 저장소에서 Vite가 여러 포트에 동시에 뜨면 번들/HMR이 섞여 보일 수 있으니, 확인 시 **한 프로세스·한 포트**만 쓰는 것을 권장한다.
- **에셋**: `Swirl_Halo_C.png`는 halo 목록에서 제외된 경우 저장소에서 삭제해도 된다(현재 코드 기준 3종 halo).

## Phase 목록

- [P01: 셸 + 라우팅 + Ch.1](./P01.shell-routing-ch1.md)
- [P02: Ch.2 StarryNightFrame](./P02.starry-night-frame.md)
- [P03: Ch.3 Application](./P03.application-section.md)

## 상태

- [ ] P01 완료
- [ ] P02 완료
- [ ] P03 완료
