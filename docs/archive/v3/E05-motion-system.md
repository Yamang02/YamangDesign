# E05: Motion & Interaction System 구축

## 개요

전환 효과(Transition)와 상호작용 상태(Interaction States)를 체계적으로 관리하는 토큰 시스템을 구축한다.

**우선순위**: P1 (E01 CSS Modules 인프라 구축 이후 진행)

---

## 배경

### 현재 문제

```typescript
// ❌ 현재: 컴포넌트마다 하드코딩된 transition
transition: 'background-color 100ms ease-out, box-shadow 200ms ease-out'

// ❌ 현재: 일관성 없는 duration/easing 조합
// Button: 100ms ease-out
// Card: 200ms ease-out
// Navigation: 300ms ease-in-out
```

- 전환 시간/곡선이 컴포넌트마다 다름
- 수정 시 모든 파일 개별 수정 필요
- `prefers-reduced-motion` 미지원

### 목표

- Motion 토큰을 CSS 변수로 중앙 관리
- Transition recipe로 일관된 조합 제공
- 접근성 (reduced motion) 지원

---

## 참고 자료

| 디자인 시스템 | 주요 특징 |
|--------------|----------|
| [IBM Carbon](https://carbondesignsystem.com/elements/motion/overview/) | Productive vs Expressive 이원화 |
| [Shopify Polaris](https://polaris-react.shopify.com/tokens/motion) | Duration 토큰 + Keyframe 애니메이션 |
| [Material Design 3](https://m3.material.io/styles/motion/overview) | Emphasized easing curve |
| [Dynatrace](https://developer.dynatrace.com/design/interaction-states/) | Exclusive vs Additive states 분류 |

---

## 작업 상세

### Task 1: Motion Primitive 토큰 정의

**파일**: `src/tokens/primitives/motion.ts` (기존 `transition.ts` 확장)

```typescript
// src/tokens/primitives/motion.ts
export const duration = {
  instant: '0ms',
  fast: '100ms',      // 색상, 테두리, opacity
  normal: '200ms',    // 그림자, transform
  slow: '300ms',      // 복합 전환, 테마 변경
  slower: '500ms',    // 페이지/모달 전환
} as const;

export const easing = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  // 신규 추가
  productive: 'cubic-bezier(0.2, 0, 0.38, 0.9)',   // 빠르고 실용적
  expressive: 'cubic-bezier(0.4, 0.14, 0.3, 1)',  // 느리고 강조
} as const;

// State layer opacity
export const stateLayer = {
  hover: 0.08,
  pressed: 0.12,
  focus: 0.12,
  selected: 0.08,
  disabled: 0.38,
} as const;
```

**완료 조건**:
- [ ] `motion.ts` 파일 생성
- [ ] 기존 `transition.ts`에서 import 호환 유지
- [ ] TypeScript 타입 export

---

### Task 2: CSS 변수 주입 확장

**파일**: `src/utils/css.ts` 또는 `src/themes/ThemeProvider.tsx`

Motion 토큰을 CSS 변수로 주입:

```css
:root {
  /* Duration */
  --ds-duration-instant: 0ms;
  --ds-duration-fast: 100ms;
  --ds-duration-normal: 200ms;
  --ds-duration-slow: 300ms;
  --ds-duration-slower: 500ms;

  /* Easing */
  --ds-ease-linear: linear;
  --ds-ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ds-ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ds-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ds-ease-productive: cubic-bezier(0.2, 0, 0.38, 0.9);
  --ds-ease-expressive: cubic-bezier(0.4, 0.14, 0.3, 1);

  /* State Layer */
  --ds-state-hover-opacity: 0.08;
  --ds-state-pressed-opacity: 0.12;
  --ds-state-focus-opacity: 0.12;
  --ds-state-selected-opacity: 0.08;
  --ds-state-disabled-opacity: 0.38;
}
```

**완료 조건**:
- [ ] Motion 토큰 CSS 변수 주입 로직 추가
- [ ] 테마 전환 시에도 motion 변수 유지 확인

---

### Task 3: Transition Recipe 토큰 정의

**파일**: `src/tokens/semantic/transitions.ts` (신규)

```typescript
// src/tokens/semantic/transitions.ts
export const transition = {
  // 단일 속성
  color: 'background-color var(--ds-duration-fast) var(--ds-ease-out), color var(--ds-duration-fast) var(--ds-ease-out), border-color var(--ds-duration-fast) var(--ds-ease-out)',
  shadow: 'box-shadow var(--ds-duration-normal) var(--ds-ease-out)',
  transform: 'transform var(--ds-duration-fast) var(--ds-ease-out)',
  opacity: 'opacity var(--ds-duration-fast) var(--ds-ease-out)',

  // 복합 전환
  interactive: 'background-color var(--ds-duration-fast) var(--ds-ease-out), color var(--ds-duration-fast) var(--ds-ease-out), border-color var(--ds-duration-fast) var(--ds-ease-out), box-shadow var(--ds-duration-normal) var(--ds-ease-out)',
  all: 'background-color var(--ds-duration-fast) var(--ds-ease-out), color var(--ds-duration-fast) var(--ds-ease-out), border-color var(--ds-duration-fast) var(--ds-ease-out), box-shadow var(--ds-duration-normal) var(--ds-ease-out), transform var(--ds-duration-fast) var(--ds-ease-out)',
} as const;
```

CSS 변수로도 제공:

```css
:root {
  --ds-transition-color: background-color var(--ds-duration-fast) var(--ds-ease-out),
                         color var(--ds-duration-fast) var(--ds-ease-out),
                         border-color var(--ds-duration-fast) var(--ds-ease-out);
  --ds-transition-shadow: box-shadow var(--ds-duration-normal) var(--ds-ease-out);
  --ds-transition-transform: transform var(--ds-duration-fast) var(--ds-ease-out);
  --ds-transition-opacity: opacity var(--ds-duration-fast) var(--ds-ease-out);
  --ds-transition-interactive: var(--ds-transition-color), var(--ds-transition-shadow);
  --ds-transition-all: var(--ds-transition-interactive), var(--ds-transition-transform);
}
```

**완료 조건**:
- [ ] Transition recipe 토큰 파일 생성
- [ ] CSS 변수 주입 추가
- [ ] 사용 예시 문서화

---

### Task 4: Reduced Motion 지원

**파일**: `src/index.css` 또는 별도 CSS

```css
/* src/styles/accessibility.css */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**완료 조건**:
- [ ] `prefers-reduced-motion` 미디어 쿼리 추가
- [ ] 모든 transition/animation 영향 확인

---

### Task 5: Focus Ring 표준화

**파일**: `src/index.css`

```css
:root {
  --ds-focus-ring-width: 2px;
  --ds-focus-ring-offset: 2px;
  --ds-focus-ring-color: var(--ds-color-border-focus);
}

/* 전역 focus 스타일 */
:focus-visible {
  outline: var(--ds-focus-ring-width) solid var(--ds-focus-ring-color);
  outline-offset: var(--ds-focus-ring-offset);
}

/* focus 스타일 제거가 필요한 경우 */
.no-focus-ring:focus-visible {
  outline: none;
}
```

**완료 조건**:
- [ ] Focus ring 토큰 정의
- [ ] 전역 `:focus-visible` 스타일 추가
- [ ] 기존 컴포넌트별 focus 스타일과 충돌 확인

---

### Task 6: 컴포넌트 마이그레이션 가이드

CSS Modules 마이그레이션 시 적용할 motion 패턴 문서화:

#### Before (인라인 스타일)

```typescript
// Button.styles.ts
export const buttonStyles = {
  base: {
    transition: 'background-color 100ms ease-out, box-shadow 200ms ease-out',
  },
};
```

#### After (CSS Modules + Motion Tokens)

```css
/* Button.module.css */
.button {
  transition: var(--ds-transition-interactive);
}

.button:hover {
  /* 별도 transition 불필요 - base에서 상속 */
}

.button:active {
  transform: translateY(1px);
  /* transform은 --ds-transition-interactive에 미포함 */
  /* 필요시 --ds-transition-all 사용 또는 개별 추가 */
}
```

**완료 조건**:
- [ ] 마이그레이션 가이드 문서 작성
- [ ] 컴포넌트별 권장 transition recipe 매핑

---

## 의존성

```
E01 (CSS Modules 인프라) → E05 (Motion System)
                              ↓
                         E02, E03, E04 (컴포넌트 마이그레이션)
```

- E01 완료 후 E05 진행 권장
- E05의 토큰은 E02-E04 컴포넌트 마이그레이션에서 활용

---

## 완료 기준

- [ ] Motion primitive 토큰 정의 (`duration`, `easing`, `stateLayer`)
- [ ] CSS 변수 주입 (`--ds-duration-*`, `--ds-ease-*`, `--ds-state-*`)
- [ ] Transition recipe 토큰 정의 (`--ds-transition-*`)
- [ ] `prefers-reduced-motion` 지원
- [ ] Focus ring 표준화
- [ ] 마이그레이션 가이드 문서화
- [ ] 빌드 통과

---

## 향후 확장 (Out of Scope)

- Keyframe 애니메이션 토큰 (fade-in, slide-up 등)
- Spring physics 기반 애니메이션
- 컴포넌트별 exit animation
