# E02: Input 컴포넌트 마이그레이션

## 목표

Input 컴포넌트를 CSS Modules로 마이그레이션하여 hover/focus 상태 버그 해결.

---

## 현재 문제

```typescript
// ❌ 현재 Input.tsx
const [isFocused, setIsFocused] = useState(false);
const [isHovered, setIsHovered] = useState(false);

// hover 후 영역 이탈 시 상태 불일치
onMouseEnter={() => setIsHovered(true)}
onMouseLeave={() => setIsHovered(false)}
```

---

## 마이그레이션

### Before: Input.styles.ts

```typescript
export const inputStyles = {
  input: {
    border: '1px solid var(--ds-color-border-default)',
    // ...
  },
  inputHover: {
    borderColor: 'var(--ds-color-border-focus)',
  },
  inputFocus: {
    borderColor: 'var(--ds-color-action-primary-default)',
    boxShadow: '0 0 0 2px var(--ds-color-action-primary-default)',
  },
};
```

### After: Input.module.css

```css
.wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--ds-spacing-1);
}

.label {
  font-size: var(--ds-text-sm);
  font-weight: var(--ds-font-weight-medium);
  color: var(--ds-color-text-secondary);
}

.inputWrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input {
  width: 100%;
  height: var(--ds-size-md);
  padding: 0 var(--ds-spacing-3);
  font-size: var(--ds-text-md);
  color: var(--ds-color-text-primary);
  background-color: var(--ds-color-bg-surface);
  border: 1px solid var(--ds-color-border-default);
  border-radius: var(--ds-radius-md);
  outline: none;
  transition:
    border-color var(--ds-transition-fast),
    box-shadow var(--ds-transition-normal);
}

/* Hover - CSS에서 처리 */
.input:hover:not(:focus):not(:disabled) {
  border-color: var(--ds-color-border-focus);
}

/* Focus - CSS에서 처리 */
.input:focus {
  border-color: var(--ds-color-action-primary-default);
  box-shadow: 0 0 0 2px var(--ds-color-action-primary-default);
}

/* Disabled */
.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Error state - data 속성 */
.input[data-error="true"] {
  border-color: var(--ds-color-danger);
}

.input[data-error="true"]:focus {
  box-shadow: 0 0 0 2px var(--ds-color-danger);
}

/* Size variants */
.input[data-size="sm"] {
  height: var(--ds-size-sm);
  padding: 0 var(--ds-spacing-2);
  font-size: var(--ds-text-sm);
}

.input[data-size="lg"] {
  height: var(--ds-size-lg);
  padding: 0 var(--ds-spacing-4);
  font-size: var(--ds-text-lg);
}

/* Prefix/Suffix */
.prefix,
.suffix {
  position: absolute;
  display: flex;
  align-items: center;
  color: var(--ds-color-text-muted);
}

.prefix {
  left: var(--ds-spacing-3);
}

.suffix {
  right: var(--ds-spacing-3);
}

.input[data-has-prefix="true"] {
  padding-left: calc(var(--ds-spacing-3) + 24px);
}

.input[data-has-suffix="true"] {
  padding-right: calc(var(--ds-spacing-3) + 24px);
}

/* Helper text */
.helperText {
  font-size: var(--ds-text-xs);
  color: var(--ds-color-text-muted);
}

.helperText[data-error="true"] {
  color: var(--ds-color-danger);
}
```

### After: Input.tsx

```tsx
import { forwardRef } from 'react';
import type { InputProps } from './Input.types';
import styles from './Input.module.css';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      size = 'md',
      error,
      helperText,
      prefix,
      suffix,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className={styles.wrapper}>
        {label && <label className={styles.label}>{label}</label>}

        <div className={styles.inputWrapper}>
          {prefix && <span className={styles.prefix}>{prefix}</span>}

          <input
            ref={ref}
            className={styles.input}
            data-size={size}
            data-error={error || undefined}
            data-has-prefix={prefix ? true : undefined}
            data-has-suffix={suffix ? true : undefined}
            disabled={disabled}
            {...props}
          />

          {suffix && <span className={styles.suffix}>{suffix}</span>}
        </div>

        {helperText && (
          <span className={styles.helperText} data-error={error || undefined}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

---

## 제거되는 코드

- `Input.styles.ts` 전체 삭제
- `useState(false)` for `isHovered`, `isFocused`
- `onMouseEnter`, `onMouseLeave` 핸들러
- 인라인 스타일 객체 스프레드 로직

---

## 완료 기준

- [ ] hover → focus → blur 사이클에서 border 색상 일관성
- [ ] 모든 상태 조합 정상 동작 (hover + error, focus + disabled 등)
- [ ] JS state로 hover/focus 관리하는 코드 없음
- [ ] `Input.styles.ts` 삭제됨
- [ ] 기존 Input 사용처 정상 동작

---

## 테스트 시나리오

1. **기본 hover**: 마우스 올림 → border 변경 → 마우스 내림 → 원래대로
2. **focus 상태**: 클릭 → focus ring → 다른 곳 클릭 → focus 해제
3. **hover → focus**: 마우스 올린 상태에서 클릭 → focus 스타일 유지
4. **빠른 이동**: 빠르게 hover in/out 반복 → 상태 불일치 없음
5. **error 상태**: error prop 전달 시 빨간 border
6. **disabled**: 클릭/hover 불가
