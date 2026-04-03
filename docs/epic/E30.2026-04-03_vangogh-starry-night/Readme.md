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

## Phase 목록

- [P01: 셸 + 라우팅 + Ch.1](./P01.shell-routing-ch1.md)
- [P02: Ch.2 StarryNightFrame](./P02.starry-night-frame.md)
- [P03: Ch.3 Application](./P03.application-section.md)

## 상태

- [ ] P01 완료
- [ ] P02 완료
- [ ] P03 완료
