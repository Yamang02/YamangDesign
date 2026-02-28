# 12. Component: Input

## Overview

Border와 Focus 스타일을 검증하는 폼 컴포넌트. 테마별 입력 필드 표현 차이 확인.

---

## 역할

- border 토큰 테스트
- focus 스타일 검증
- Minimal (border 강조) vs Neumorphism (inset shadow) 대비
- 접근성 검증

---

## Props 정의

```typescript
// components/Input/Input.types.ts

export interface InputProps {
  /**
   * input 타입
   */
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';

  /**
   * 크기
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * 입력 변형
   * - outline: 테두리 스타일 (Minimal 기본)
   * - filled: 배경색 채움
   * - flushed: 아래 테두리만
   */
  variant?: 'outline' | 'filled' | 'flushed';

  /**
   * 플레이스홀더
   */
  placeholder?: string;

  /**
   * 현재 값
   */
  value?: string;

  /**
   * 기본값 (비제어)
   */
  defaultValue?: string;

  /**
   * 비활성화
   */
  disabled?: boolean;

  /**
   * 읽기 전용
   */
  readOnly?: boolean;

  /**
   * 필수 입력
   */
  required?: boolean;

  /**
   * 에러 상태
   */
  isError?: boolean;

  /**
   * 에러 메시지
   */
  errorMessage?: string;

  /**
   * 전체 너비
   */
  fullWidth?: boolean;

  /**
   * 값 변경 핸들러
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * 포커스 핸들러
   */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;

  /**
   * 블러 핸들러
   */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;

  /**
   * 라벨 (접근성)
   */
  label?: string;

  /**
   * ID (라벨 연결용)
   */
  id?: string;

  /**
   * 추가 클래스명
   */
  className?: string;
}
```

---

## 크기 시스템

| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| sm | 32px | 8px 12px | 14px |
| md | 40px | 10px 16px | 16px |
| lg | 48px | 12px 20px | 18px |

---

## 상태별 스타일

### Default

| 요소 | Minimal | Neumorphism |
|------|---------|-------------|
| 배경 | bg.base (white) | bg.base (배경과 동일) |
| 테두리 | border.default (1px) | none |
| Shadow | none | inset (오목) |

### Hover

| 요소 | Minimal | Neumorphism |
|------|---------|-------------|
| 테두리 | border.focus (살짝 강조) | none |
| Shadow | none | inset (더 깊게) |

### Focus

| 요소 | Minimal | Neumorphism |
|------|---------|-------------|
| 테두리 | border.focus (2px) | none |
| Shadow | focus ring | inset + focus ring |
| Outline | 2px offset | 2px offset |

### Error

| 요소 | Minimal | Neumorphism |
|------|---------|-------------|
| 테두리 | accent.default (error색) | none |
| Shadow | none | inset (error 색상 기반) |
| 텍스트 | accent.default | accent.default |

### Disabled

| 요소 | Minimal | Neumorphism |
|------|---------|-------------|
| 배경 | bg.muted | bg.muted |
| 테두리 | border.subtle | none |
| 텍스트 | text.muted | text.muted |
| Cursor | not-allowed | not-allowed |

---

## 스타일 정의

```typescript
// components/Input/Input.styles.ts

export const inputStyles = {
  // 래퍼 (라벨 + 입력 + 에러메시지)
  wrapper: `
    display: flex;
    flex-direction: column;
    gap: var(--ds-spacing-1);
  `,

  label: `
    font-size: var(--ds-text-sm);
    font-weight: var(--ds-font-medium);
    color: var(--ds-color-text-primary);
  `,

  base: `
    font-family: var(--ds-font-sans);
    border-radius: var(--ds-radius-md);
    color: var(--ds-color-text-primary);
    background-color: var(--ds-color-bg-base);
    transition:
      border-color var(--ds-duration-fast) var(--ds-ease-out),
      box-shadow var(--ds-duration-normal) var(--ds-ease-out),
      background-color var(--ds-duration-fast) var(--ds-ease-out);

    &::placeholder {
      color: var(--ds-color-text-muted);
    }
  `,

  sizes: {
    sm: `
      height: var(--ds-size-sm);
      padding: var(--ds-spacing-1) var(--ds-spacing-3);
      font-size: var(--ds-text-sm);
    `,
    md: `
      height: var(--ds-size-md);
      padding: var(--ds-spacing-2) var(--ds-spacing-4);
      font-size: var(--ds-text-md);
    `,
    lg: `
      height: var(--ds-size-lg);
      padding: var(--ds-spacing-3) var(--ds-spacing-5);
      font-size: var(--ds-text-lg);
    `,
  },

  variants: {
    outline: `
      border: var(--ds-border-thin) solid var(--ds-color-border-default);
      box-shadow: none;

      &:hover:not(:disabled):not(:focus) {
        border-color: var(--ds-color-border-focus);
      }

      &:focus {
        border-color: var(--ds-color-border-focus);
        outline: none;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
      }
    `,

    filled: `
      border: var(--ds-border-thin) solid transparent;
      background-color: var(--ds-color-bg-muted);

      &:hover:not(:disabled):not(:focus) {
        background-color: var(--ds-color-bg-surface);
      }

      &:focus {
        background-color: var(--ds-color-bg-base);
        border-color: var(--ds-color-border-focus);
        outline: none;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
      }
    `,

    flushed: `
      border: none;
      border-bottom: var(--ds-border-medium) solid var(--ds-color-border-default);
      border-radius: 0;
      padding-left: 0;
      padding-right: 0;

      &:hover:not(:disabled):not(:focus) {
        border-bottom-color: var(--ds-color-border-focus);
      }

      &:focus {
        border-bottom-color: var(--ds-color-border-focus);
        outline: none;
        box-shadow: 0 1px 0 0 var(--ds-color-border-focus);
      }
    `,
  },

  // Neumorphism 전용 오버라이드
  neumorphism: `
    border: none;
    box-shadow: var(--ds-shadow-inset);

    &:hover:not(:disabled):not(:focus) {
      /* inset 더 깊게 */
    }

    &:focus {
      outline: none;
      box-shadow:
        var(--ds-shadow-inset),
        0 0 0 3px rgba(99, 102, 241, 0.2);
    }
  `,

  states: {
    error: `
      border-color: var(--ds-color-action-accent-default);

      &:focus {
        box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
      }
    `,

    disabled: `
      background-color: var(--ds-color-bg-muted);
      border-color: var(--ds-color-border-subtle);
      color: var(--ds-color-text-muted);
      cursor: not-allowed;
      opacity: 0.6;
    `,

    fullWidth: `
      width: 100%;
    `,
  },

  errorMessage: `
    font-size: var(--ds-text-sm);
    color: var(--ds-color-action-accent-default);
    margin-top: var(--ds-spacing-1);
  `,
} as const;
```

---

## 컴포넌트 구현

```tsx
// components/Input/Input.tsx

import { forwardRef } from 'react';
import type { InputProps } from './Input.types';
import { clsx } from '@/utils/clsx';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      type = 'text',
      size = 'md',
      variant = 'outline',
      placeholder,
      value,
      defaultValue,
      disabled = false,
      readOnly = false,
      required = false,
      isError = false,
      errorMessage,
      fullWidth = false,
      onChange,
      onFocus,
      onBlur,
      label,
      id,
      className,
    },
    ref
  ) {
    const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <div className={clsx('input-wrapper', fullWidth && 'input-wrapper--full-width')}>
        {label && (
          <label htmlFor={inputId} className="input__label">
            {label}
            {required && <span className="input__required">*</span>}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={isError}
          aria-describedby={isError && errorMessage ? `${inputId}-error` : undefined}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className={clsx(
            'input',
            `input--${variant}`,
            `input--${size}`,
            isError && 'input--error',
            disabled && 'input--disabled',
            fullWidth && 'input--full-width',
            className
          )}
        />

        {isError && errorMessage && (
          <span id={`${inputId}-error`} className="input__error-message" role="alert">
            {errorMessage}
          </span>
        )}
      </div>
    );
  }
);
```

---

## 테마별 차이점

### Minimal

```
Default                    Focus
┌──────────────────────┐   ┌──────────────────────┐
│ Placeholder...       │   │ Typing here...       │ ← border 색상 변화
└──────────────────────┘   └──────────────────────┘
  ↑ 1px border               ↑ 2px border + focus ring
```

### Neumorphism

```
Default (오목)              Focus (오목 + ring)
┌──────────────────────┐   ┌──────────────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│   │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│ Placeholder...       │   │ Typing here...       │
│                    ░░│   │                    ░░│
└──────────────────────┘   └──────────────────────┘
  ↑ inset shadow             ↑ inset shadow + focus ring
```

---

## 접근성

### 라벨 연결

```tsx
<Input
  id="email"
  label="이메일"
  required
/>
// 결과:
// <label for="email">이메일<span>*</span></label>
// <input id="email" aria-required="true" />
```

### 에러 상태

```tsx
<Input
  isError
  errorMessage="올바른 이메일을 입력하세요"
/>
// 결과:
// <input aria-invalid="true" aria-describedby="input-xxx-error" />
// <span id="input-xxx-error" role="alert">올바른 이메일을 입력하세요</span>
```

### Focus 관리

```css
.input:focus-visible {
  /* outline 대신 box-shadow 사용 */
  outline: none;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}
```

---

## 사용 예시

### 기본 사용

```tsx
<Input placeholder="이름을 입력하세요" />
<Input type="email" placeholder="이메일" />
<Input type="password" placeholder="비밀번호" />
```

### 라벨과 함께

```tsx
<Input
  label="이메일"
  type="email"
  placeholder="example@email.com"
  required
/>
```

### 에러 상태

```tsx
<Input
  label="이메일"
  type="email"
  isError
  errorMessage="올바른 이메일 형식이 아닙니다"
/>
```

### Variant

```tsx
<Input variant="outline" placeholder="Outline" />
<Input variant="filled" placeholder="Filled" />
<Input variant="flushed" placeholder="Flushed" />
```

### 크기

```tsx
<Input size="sm" placeholder="Small" />
<Input size="md" placeholder="Medium" />
<Input size="lg" placeholder="Large" />
```

### 상태

```tsx
<Input disabled placeholder="Disabled" />
<Input readOnly value="Read only" />
```

---

## 검증 항목

POC에서 확인할 것:

- [ ] border 색상이 토큰에서 올바르게 참조
- [ ] focus 상태에서 focus ring 표시
- [ ] Minimal: border 강조, Neumorphism: inset shadow
- [ ] error 상태에서 accent 색상 적용
- [ ] disabled 상태에서 입력 차단 및 시각적 구분
- [ ] 라벨-입력 필드 연결 (접근성)
