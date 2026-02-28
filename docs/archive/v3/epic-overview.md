# Epic v3: 스타일 아키텍처 현대화 ✅ 완료

## 개요

정적 웹페이지(디자인 시스템 쇼케이스)에 적합한 스타일 관리 아키텍처로 전환.
현재 인라인 스타일 객체 + JS 상태 기반 hover 관리의 문제점을 해결.

---

## 현재 문제점

### 1. 상태 관리의 혼란
```typescript
// ❌ 현재: JS로 CSS 의사 클래스 시뮬레이션
const [isHovered, setIsHovered] = useState(false);
onMouseEnter={() => setIsHovered(true)}
onMouseLeave={() => setIsHovered(false)}
```

- hover 후 영역 이탈 시 상태 불일치 발생
- 불필요한 리렌더링
- 코드 복잡도 증가

### 2. 스타일 조합의 복잡성
```typescript
// ❌ 현재: 조건부 스프레드 연산
const style = {
  ...baseStyles,
  ...(isHovered ? hoverStyles : {}),
  ...(isFocused ? focusStyles : {}),
  ...(isError ? errorStyles : {}),
};
```

- 우선순위 예측 어려움
- 타입 안전성 부족
- 유지보수 어려움

### 3. 하드코딩된 값
```typescript
// ❌ 현재
fontSize: '10px',
borderColor: '#EF4444',
```

---

## 목표 아키텍처

### 원칙

1. **CSS 의사 클래스는 CSS에서 처리** - `:hover`, `:focus`, `:active`
2. **상태 기반 스타일은 data-* 속성** - `[data-error="true"]`
3. **디자인 토큰은 CSS 변수** - `var(--ds-*)`
4. **타입 안전성 유지** - TypeScript 통합

### 선택: CSS Modules

| 방식 | 장점 | 단점 |
|------|------|------|
| **CSS Modules** ✅ | 빌드 타임, 스코프 격리, 설정 최소 | IDE 지원 제한적 |
| Vanilla Extract | 타입 안전, 빌드 타임 | 설정 복잡, 러닝커브 |
| Tailwind | 빠른 개발 | 토큰 시스템과 충돌 |
| styled-components | 동적 스타일링 | 런타임 오버헤드 |

**CSS Modules 선정 이유:**
- Vite 기본 지원 (설정 불필요)
- 정적 웹페이지에 적합 (런타임 오버헤드 없음)
- CSS 변수(`var(--ds-*)`)와 완벽 호환
- 점진적 마이그레이션 가능

---

## 새로운 컴포넌트 패턴

### 폴더 구조

```
Button/
├── Button.tsx           # 컴포넌트 로직
├── Button.module.css    # 스코프 스타일 (NEW)
├── Button.types.ts      # Props 타입
└── index.ts
```

### CSS Module 예시

```css
/* Button.module.css */
.button {
  display: inline-flex;
  align-items: center;
  padding: var(--ds-spacing-2) var(--ds-spacing-4);
  border-radius: var(--ds-radius-md);
  font-weight: var(--ds-font-weight-medium);
  transition:
    background-color 100ms ease-out,
    box-shadow 200ms ease-out;
}

/* 의사 클래스는 CSS에서 */
.button:hover {
  box-shadow: var(--ds-shadow-md);
}

.button:focus-visible {
  outline: 2px solid var(--ds-color-action-primary-default);
  outline-offset: 2px;
}

.button:active {
  transform: translateY(1px);
}

/* 상태는 data 속성으로 */
.button[data-variant="primary"] {
  background: var(--ds-color-action-primary-default);
  color: var(--ds-color-text-onAction);
}

.button[data-variant="primary"]:hover {
  background: var(--ds-color-action-primary-hover);
}

.button[data-disabled="true"] {
  opacity: 0.5;
  pointer-events: none;
}
```

### 컴포넌트 예시

```tsx
// Button.tsx
import styles from './Button.module.css';
import { clsx } from '../../utils/clsx';

export function Button({
  variant = 'primary',
  size = 'md',
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(styles.button, styles[size])}
      data-variant={variant}
      data-disabled={disabled || undefined}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
```

---

## 마이그레이션 전략

### Phase 1: 인프라 구축
- [x] CSS Modules 타입 선언 (`*.module.css.d.ts` 자동 생성 설정)
- [x] clsx 유틸 강화
- [x] 공통 CSS 변수 검증

### Phase 2: 신규 컴포넌트 적용
- [x] 새로 만드는 컴포넌트는 CSS Modules로
- [x] 컨벤션 문서화

### Phase 3: 기존 컴포넌트 마이그레이션
- [x] Input (hover/focus 이슈 있음) - 우선순위 높음
- [x] Select (dropdown hover 이슈)
- [x] Button
- [x] Card
- [x] ColorPicker/HexInput
- [x] Navigation

### Phase 4: 스타일 객체 파일 제거
- [x] `*.styles.ts` 파일 삭제
- [x] 문서 업데이트

---

## 에픽 구성

| Epic | 제목 | 우선순위 | 상태 |
|------|------|----------|------|
| E01 | [CSS Modules 인프라 구축](./E01-css-modules-setup.md) | P0 | ✅ 완료 |
| E02 | [Input 컴포넌트 마이그레이션](./E02-input-migration.md) | P0 | ✅ 완료 |
| E03 | [Select 컴포넌트 마이그레이션](./E03-select-migration.md) | P1 | ✅ 완료 |
| E04 | [나머지 컴포넌트 마이그레이션](./E04-remaining-migration.md) | P2 | ✅ 완료 |
| E05 | [Motion & Interaction System 구축](./E05-motion-system.md) | P1 | ✅ 완료 |

---

## 완료 기준

- [x] 모든 컴포넌트가 CSS Modules 사용
- [x] JS state로 hover/focus 관리하는 코드 제거
- [x] `*.styles.ts` 파일 전체 제거
- [x] 하드코딩된 색상/크기 값 제거
- [x] 기존 테마 전환 기능 정상 동작
- [x] 빌드 통과

---

## 기술 제약 (유지)

- 외부 라이브러리 최소화
- CSS 변수 기반 스타일링 (`var(--ds-xxx)`)
- TypeScript 타입 안전성
- Vite 기본 기능만 사용

---

## Motion & Interaction System

CSS Modules 전환과 함께 **전환 효과(Transition)와 상호작용 상태(Interaction States)**를 체계적으로 관리하는 시스템을 도입한다.

> 참고: [IBM Carbon](https://carbondesignsystem.com/elements/motion/overview/), [Shopify Polaris](https://polaris-react.shopify.com/tokens/motion), [Material Design 3](https://m3.material.io/styles/motion/overview), [Dynatrace Design System](https://developer.dynatrace.com/design/interaction-states/)

---

### 1. Interaction States (상호작용 상태)

UI 요소의 상태를 **Exclusive States(배타적)**와 **Additive States(누적 가능)**로 구분한다.

#### Exclusive States (한 번에 하나만 활성화)

| 상태 | 설명 | 트리거 |
|------|------|--------|
| `rest` | 기본 상태 | - |
| `hover` | 포인터가 요소 위에 있음 | `:hover` |
| `active` / `pressed` | 눌림 상태 (100-150ms 내 피드백 필수) | `:active` |
| `drag` | 드래그 중 | JS 핸들링 필요 |
| `disabled` | 비활성화 (숨기지 않고 표시 권장) | `[data-disabled]`, `:disabled` |

#### Additive States (동시 적용 가능)

| 상태 | 설명 | 트리거 |
|------|------|--------|
| `focus` | 키보드 포커스 (접근성 필수) | `:focus-visible` |
| `selected` | 선택됨 (체크박스, 탭 등) | `[data-selected]`, `[aria-selected]` |
| `error` | 유효성 검증 실패 | `[data-error]`, `[aria-invalid]` |

#### 상태 조합 예시

```css
/* rest + focus */
.input:focus-visible { ... }

/* hover + selected */
.tab[data-selected="true"]:hover { ... }

/* disabled는 다른 상태를 무시 */
.button[data-disabled="true"] {
  pointer-events: none;
  opacity: 0.5;
}
```

---

### 2. Motion Tokens (모션 토큰)

#### Duration (지속 시간)

```css
:root {
  /* 기존 토큰 유지 */
  --ds-duration-instant: 0ms;
  --ds-duration-fast: 100ms;      /* 색상, 테두리 변화 */
  --ds-duration-normal: 200ms;    /* 그림자, 트랜스폼 */
  --ds-duration-slow: 300ms;      /* 전체 테마 전환 */
  --ds-duration-slower: 500ms;    /* 페이지 전환 */
}
```

#### Easing (가속도 곡선)

```css
:root {
  /* 기존 토큰 유지 */
  --ds-ease-linear: linear;
  --ds-ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ds-ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ds-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

  /* 신규 추가 (선택) */
  --ds-ease-productive: cubic-bezier(0.2, 0, 0.38, 0.9);  /* 빠르고 실용적 */
  --ds-ease-expressive: cubic-bezier(0.4, 0.14, 0.3, 1); /* 느리고 강조 */
}
```

#### Motion Style Categories (IBM Carbon 참고)

| 스타일 | 용도 | Duration | Easing |
|--------|------|----------|--------|
| **Productive** | 일반 UI 반응 (hover, focus) | `fast`, `normal` | `ease-out` |
| **Expressive** | 중요한 순간 (모달, 알림) | `slow`, `slower` | `ease-in-out` |

---

### 3. Transition Recipes (전환 레시피)

속성별로 적절한 duration과 easing 조합을 표준화한다.

#### 속성별 기본 전환

```css
:root {
  /* Transition Shorthand Tokens */
  --ds-transition-color: background-color var(--ds-duration-fast) var(--ds-ease-out),
                         color var(--ds-duration-fast) var(--ds-ease-out),
                         border-color var(--ds-duration-fast) var(--ds-ease-out);

  --ds-transition-shadow: box-shadow var(--ds-duration-normal) var(--ds-ease-out);

  --ds-transition-transform: transform var(--ds-duration-fast) var(--ds-ease-out);

  --ds-transition-opacity: opacity var(--ds-duration-fast) var(--ds-ease-out);

  /* 복합 전환 */
  --ds-transition-interactive: var(--ds-transition-color),
                                var(--ds-transition-shadow);

  --ds-transition-all: var(--ds-transition-color),
                       var(--ds-transition-shadow),
                       var(--ds-transition-transform);
}
```

#### 컴포넌트별 사용

```css
/* Button */
.button {
  transition: var(--ds-transition-interactive);
}

/* Card (hoverable) */
.card[data-hoverable="true"] {
  transition: var(--ds-transition-all);
}

/* Input */
.input {
  transition: var(--ds-transition-color), var(--ds-transition-shadow);
}
```

---

### 4. State Layer System

Hover/Pressed 상태를 **반투명 오버레이**로 처리하여 토큰 수를 최소화한다.

```css
:root {
  /* State Overlays */
  --ds-state-hover-opacity: 0.08;
  --ds-state-pressed-opacity: 0.12;
  --ds-state-focus-opacity: 0.12;
  --ds-state-selected-opacity: 0.08;

  /* 오버레이 색상 (기본: 현재 텍스트 색상) */
  --ds-state-layer-color: currentColor;
}

/* 사용 예시 */
.button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--ds-state-layer-color);
  opacity: 0;
  transition: opacity var(--ds-duration-fast) var(--ds-ease-out);
}

.button:hover::before {
  opacity: var(--ds-state-hover-opacity);
}

.button:active::before {
  opacity: var(--ds-state-pressed-opacity);
}
```

> **장점**: `primary-hover`, `secondary-hover` 같은 파생 토큰을 줄일 수 있음

---

### 5. 접근성 고려사항

#### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

#### Focus Visible 일관성

```css
/* 전역 focus 스타일 */
:root {
  --ds-focus-ring-width: 2px;
  --ds-focus-ring-offset: 2px;
  --ds-focus-ring-color: var(--ds-color-border-focus);
}

*:focus-visible {
  outline: var(--ds-focus-ring-width) solid var(--ds-focus-ring-color);
  outline-offset: var(--ds-focus-ring-offset);
}
```

---

### 6. 마이그레이션 체크리스트

#### Phase 1에 추가

- [x] Motion 토큰 CSS 변수 정의 (`tokens/primitives/transition.ts` → CSS 변수 주입)
- [x] Transition recipe 토큰 정의
- [x] `prefers-reduced-motion` 미디어 쿼리 추가

#### 컴포넌트 마이그레이션 시

- [x] `useState` 기반 hover/active → CSS `:hover`, `:active`로 전환
- [x] 하드코딩된 transition 값 → `var(--ds-transition-*)` 토큰 사용
- [x] focus 스타일 → `:focus-visible` 통일

---

## 참고: data-* 속성 vs className 조합

```tsx
// ✅ 권장: data 속성
<button data-variant="primary" data-size="md">

// CSS
.button[data-variant="primary"] { ... }
.button[data-size="md"] { ... }
```

```tsx
// ❌ 지양: className 조합
<button className={`${styles.button} ${styles.primary} ${styles.md}`}>
```

**이유:**
- data 속성은 의미적으로 명확
- CSS 선택자 우선순위 예측 쉬움
- DevTools에서 상태 확인 용이
- JS에서 조건부 className 조합 불필요
