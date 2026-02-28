# Motion & Transition 가이드

## 개요

- **Motion 토큰**: `tokens/primitives/motion.ts` → ThemeProvider가 `--ds-duration-*`, `--ds-ease-*`, `--ds-state-*-opacity` 로 주입
- **Transition recipe**: `styles/transitions.css` 에서 위 토큰을 조합한 `--ds-transition-*` 제공
- 컴포넌트는 **recipe만 참조**하고, duration/easing을 직접 하드코딩하지 않음

## Transition Recipe 매핑

| Recipe | 용도 | 사용 컴포넌트 예 |
|--------|------|------------------|
| `--ds-transition-color` | background, color, border-color | Input, HexInput, option hover |
| `--ds-transition-shadow` | box-shadow | Button, Card, Select |
| `--ds-transition-transform` | transform | Button active, Card hover, Chevron |
| `--ds-transition-opacity` | opacity | Navigation brand, close 버튼 |
| `--ds-transition-interactive` | color + shadow | Select trigger, 버튼 기본 |
| `--ds-transition-interactive-full` | color + shadow + transform | Button |
| `--ds-transition-all` | interactive + transform | 필요 시 한 번에 |
| `--ds-transition-theme` | 테마/배경 느린 전환 | :root, Navigation bar |

## CSS Module 사용 패턴

### Before (인라인/스타일 객체)

```ts
transition: 'background-color 100ms ease-out, box-shadow 200ms ease-out'
```

### After (CSS Module + Motion 토큰)

```css
/* *.module.css */
.trigger {
  transition: var(--ds-transition-interactive);
}

.card {
  transition: var(--ds-transition-shadow), var(--ds-transition-transform), var(--ds-transition-color);
}

.button {
  transition: var(--ds-transition-interactive-full);
}
```

- `:hover` / `:active` 에서는 **transition을 다시 지정하지 않음** (base에서 상속).
- `transform`만 추가로 쓸 때는 base에 `--ds-transition-interactive-full` 또는 `--ds-transition-all` 사용.

## State Layer (선택)

hover/pressed를 **반투명 오버레이**로 처리할 때:

```css
.button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: currentColor;
  opacity: 0;
  transition: var(--ds-transition-opacity);
}
.button:hover::before {
  opacity: var(--ds-state-hover-opacity);
}
.button:active::before {
  opacity: var(--ds-state-pressed-opacity);
}
```

현재 컴포넌트는 배경색 변경 방식이므로 필수는 아님. State layer 도입 시 위 변수 사용 권장.

## Focus Ring

- 전역 `:focus-visible` 은 `--ds-focus-ring-width`, `--ds-focus-ring-offset`, `--ds-focus-ring-color` 사용.
- 컴포넌트가 **자체 focus 스타일**을 가진 경우 (예: outline 대신 box-shadow):  
  루트에 `.no-focus-ring` 클래스를 주어 전역 focus ring을 제거하고, 컴포넌트에서 `:focus-visible` 로 스타일 지정.

## Reduced Motion

`prefers-reduced-motion: reduce` 시 `styles/transitions.css` 에서  
transition-duration, animation-duration, scroll-behavior 를 최소화.  
별도 조치 없이 전역 적용됨.

## 참고

- Epic v3 E05: Motion & Interaction System (`docs/epic/v3/E05-motion-system.md`)
- [ARCHITECTURE.md](./ARCHITECTURE.md) — 토큰 흐름
