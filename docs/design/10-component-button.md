# 10. Component: Button

## Overview

가장 기본적인 액션 컴포넌트. 테마별 상태 변화(shadow)를 검증하는 핵심 컴포넌트.

---

## 역할

- 상태(hover/active) 테스트
- elevation/shadow 토큰 검증
- 4색 팔레트 활용 (primary, secondary, accent, subtle)

---

## Props 정의

```typescript
// components/Button/Button.types.ts

export interface ButtonProps {
  /**
   * 버튼 스타일 변형
   * - primary: 주요 액션 (Primary 색상)
   * - secondary: 보조 액션 (Secondary 색상)
   * - accent: 강조 액션 (Accent 색상)
   * - outline: 테두리만 (Primary 색상)
   * - ghost: 투명 배경
   * - subtle: 연한 배경 (Sub 색상)
   */
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'subtle';

  /**
   * 버튼 크기
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * 전체 너비 사용
   */
  fullWidth?: boolean;

  /**
   * 비활성화 상태
   */
  disabled?: boolean;

  /**
   * 로딩 상태 (확장용)
   */
  loading?: boolean;

  /**
   * 버튼 타입
   */
  type?: 'button' | 'submit' | 'reset';

  /**
   * 클릭 핸들러
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * 버튼 내용
   */
  children: React.ReactNode;

  /**
   * 추가 클래스명
   */
  className?: string;
}
```

---

## 크기 시스템

| Size | Height | Padding (px) | Font Size |
|------|--------|--------------|-----------|
| sm | 32px | 12px | 14px |
| md | 40px | 16px | 16px |
| lg | 48px | 20px | 18px |

---

## Variant별 스타일

### Primary

| 상태 | 배경 | 텍스트 | Border | Shadow |
|------|------|--------|--------|--------|
| default | action.primary.default | text.onAction | none | sm |
| hover | action.primary.hover | text.onAction | none | md |
| active | action.primary.active | text.onAction | none | inset |
| disabled | action.primary.default (50% opacity) | text.onAction | none | none |

### Secondary

| 상태 | 배경 | 텍스트 | Border | Shadow |
|------|------|--------|--------|--------|
| default | action.secondary.default | text.onAction | none | sm |
| hover | action.secondary.hover | text.onAction | none | md |
| active | action.secondary.active | text.onAction | none | inset |

### Accent

| 상태 | 배경 | 텍스트 | Border | Shadow |
|------|------|--------|--------|--------|
| default | action.accent.default | text.onAction | none | sm |
| hover | action.accent.hover | text.onAction | none | md |
| active | action.accent.default | text.onAction | none | inset |

### Outline

| 상태 | 배경 | 텍스트 | Border | Shadow |
|------|------|--------|--------|--------|
| default | transparent | action.primary.default | action.primary.default | none |
| hover | action.primary.default | text.onAction | action.primary.default | sm |
| active | action.primary.hover | text.onAction | action.primary.hover | none |

### Ghost

| 상태 | 배경 | 텍스트 | Border | Shadow |
|------|------|--------|--------|--------|
| default | transparent | text.primary | none | none |
| hover | bg.muted | text.primary | none | none |
| active | bg.muted (darker) | text.primary | none | none |

### Subtle

| 상태 | 배경 | 텍스트 | Border | Shadow |
|------|------|--------|--------|--------|
| default | bg.muted | text.primary | none | sm |
| hover | bg.muted (darker) | text.primary | none | md |
| active | bg.muted | text.primary | none | inset |

---

## 스타일 정의

```typescript
// components/Button/Button.styles.ts

export const buttonStyles = {
  base: `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: var(--ds-font-sans);
    font-weight: var(--ds-font-medium);
    border-radius: var(--ds-radius-md);
    cursor: pointer;
    transition:
      background-color var(--ds-duration-fast) var(--ds-ease-out),
      box-shadow var(--ds-duration-normal) var(--ds-ease-out),
      border-color var(--ds-duration-fast) var(--ds-ease-out),
      transform var(--ds-duration-fast) var(--ds-ease-out);
  `,

  sizes: {
    sm: `
      height: var(--ds-size-sm);
      padding: 0 var(--ds-spacing-3);
      font-size: var(--ds-text-sm);
    `,
    md: `
      height: var(--ds-size-md);
      padding: 0 var(--ds-spacing-4);
      font-size: var(--ds-text-md);
    `,
    lg: `
      height: var(--ds-size-lg);
      padding: 0 var(--ds-spacing-5);
      font-size: var(--ds-text-lg);
    `,
  },

  variants: {
    primary: `
      background-color: var(--ds-color-action-primary-default);
      color: var(--ds-color-text-onAction);
      border: none;
      box-shadow: var(--ds-shadow-sm);

      &:hover:not(:disabled) {
        background-color: var(--ds-color-action-primary-hover);
        box-shadow: var(--ds-shadow-md);
      }

      &:active:not(:disabled) {
        background-color: var(--ds-color-action-primary-active);
        box-shadow: var(--ds-shadow-inset);
      }
    `,

    secondary: `
      background-color: var(--ds-color-action-secondary-default);
      color: var(--ds-color-text-onAction);
      border: none;
      box-shadow: var(--ds-shadow-sm);

      &:hover:not(:disabled) {
        background-color: var(--ds-color-action-secondary-hover);
        box-shadow: var(--ds-shadow-md);
      }

      &:active:not(:disabled) {
        background-color: var(--ds-color-action-secondary-active);
        box-shadow: var(--ds-shadow-inset);
      }
    `,

    accent: `
      background-color: var(--ds-color-action-accent-default);
      color: var(--ds-color-text-onAction);
      border: none;
      box-shadow: var(--ds-shadow-sm);

      &:hover:not(:disabled) {
        background-color: var(--ds-color-action-accent-hover);
        box-shadow: var(--ds-shadow-md);
      }

      &:active:not(:disabled) {
        box-shadow: var(--ds-shadow-inset);
      }
    `,

    outline: `
      background-color: transparent;
      color: var(--ds-color-action-primary-default);
      border: var(--ds-border-thin) solid var(--ds-color-action-primary-default);
      box-shadow: none;

      &:hover:not(:disabled) {
        background-color: var(--ds-color-action-primary-default);
        color: var(--ds-color-text-onAction);
        box-shadow: var(--ds-shadow-sm);
      }

      &:active:not(:disabled) {
        background-color: var(--ds-color-action-primary-hover);
      }
    `,

    ghost: `
      background-color: transparent;
      color: var(--ds-color-text-primary);
      border: none;
      box-shadow: none;

      &:hover:not(:disabled) {
        background-color: var(--ds-color-bg-muted);
      }

      &:active:not(:disabled) {
        background-color: var(--ds-color-bg-muted);
        opacity: 0.8;
      }
    `,

    subtle: `
      background-color: var(--ds-color-bg-muted);
      color: var(--ds-color-text-primary);
      border: none;
      box-shadow: var(--ds-shadow-sm);

      &:hover:not(:disabled) {
        box-shadow: var(--ds-shadow-md);
      }

      &:active:not(:disabled) {
        box-shadow: var(--ds-shadow-inset);
      }
    `,
  },

  states: {
    disabled: `
      opacity: 0.5;
      cursor: not-allowed;
      box-shadow: none;
    `,
    fullWidth: `
      width: 100%;
    `,
  },
} as const;
```

---

## 컴포넌트 구현

```tsx
// components/Button/Button.tsx

import type { ButtonProps } from './Button.types';
import { buttonStyles } from './Button.styles';
import { clsx } from '@/utils/clsx';

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  children,
  className,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={clsx(
        'button',
        `button--${variant}`,
        `button--${size}`,
        fullWidth && 'button--full-width',
        isDisabled && 'button--disabled',
        className
      )}
    >
      {loading ? <span className="button__spinner" /> : children}
    </button>
  );
}
```

---

## 테마별 차이점

### Minimal

```
Default          Hover            Active
┌─────────┐     ┌─────────┐     ┌─────────┐
│ Button  │     │ Button  │     │ Button  │
└─────────┘     └─────────┘     └─────────┘
    ░░░             ▓▓▓             ▓▓▓
 (drop shadow)  (더 진한 shadow)  (inset shadow)
```

### Neumorphism

```
Default          Hover            Active (눌림)
░░░┌─────────┐  ░░░┌─────────┐  ┌─────────┐▓▓▓
░░░│ Button  │  ░░░│ Button  │  │▓▓▓▓▓▓▓▓▓│░░░
░░░└─────────┘▓ ░░░└─────────┘▓ │ Button  │░░░
         ▓▓▓▓▓          ▓▓▓▓▓▓ │         │░░░
  (양각-raised)   (더 강한 양각)  └─────────┘
                                  (음각-inset)
```

---

## 접근성

### 키보드

- `Enter` / `Space`: 클릭 실행
- `Tab`: 포커스 이동

### Focus 스타일

```css
.button:focus-visible {
  outline: 2px solid var(--ds-color-border-focus);
  outline-offset: 2px;
}
```

### ARIA

```tsx
<button
  aria-disabled={disabled}
  aria-busy={loading}
>
  {children}
</button>
```

---

## 사용 예시

```tsx
// 기본 사용
<Button variant="primary">확인</Button>
<Button variant="secondary">취소</Button>
<Button variant="accent">특별 액션</Button>

// 크기
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// 스타일 변형
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="subtle">Subtle</Button>

// 상태
<Button disabled>Disabled</Button>
<Button loading>Loading</Button>
<Button fullWidth>Full Width</Button>
```

---

## 검증 항목

POC에서 확인할 것:

- [ ] 4가지 variant가 각 색상 토큰 올바르게 사용
- [ ] hover/active 상태 전환 시 shadow 변화
- [ ] Minimal ↔ Neumorphism 테마 전환 시 shadow 완전히 다르게 동작
- [ ] disabled 상태에서 인터랙션 차단
- [ ] 크기별 패딩/높이 일관성
