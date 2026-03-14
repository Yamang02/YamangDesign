# E03: Select 컴포넌트 마이그레이션

## 목표

Select 컴포넌트를 CSS Modules로 마이그레이션.
드롭다운 옵션의 hover 상태 관리 개선.

---

## 현재 문제

```typescript
// ❌ 현재 Select.tsx
const [isHovered, setIsHovered] = useState(false);
const [highlightedIndex, setHighlightedIndex] = useState(-1);

// 각 옵션마다 hover 상태 계산
onMouseEnter={() => setHighlightedIndex(index)}
```

- 키보드 네비게이션과 마우스 hover 상태 혼합
- highlight는 JS로 관리 필요 (키보드 지원)
- 단, 순수 hover 스타일은 CSS로 분리 가능

---

## 설계 결정

### Keyboard highlight vs Mouse hover

| 상태 | 관리 방식 | 이유 |
|------|-----------|------|
| trigger hover | CSS `:hover` | 순수 마우스 상태 |
| trigger focus | CSS `:focus-visible` | 키보드 focus |
| dropdown open | JS state | 토글 로직 필요 |
| option hover | CSS `:hover` | 순수 마우스 상태 |
| option highlight | JS state + `data-highlighted` | 키보드 네비게이션 |
| option selected | `aria-selected` + CSS | 접근성 + 스타일 |

---

## 마이그레이션

### Select.module.css

```css
/* Trigger */
.trigger {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ds-spacing-2);
  height: var(--ds-size-md);
  padding: 0 var(--ds-spacing-3);
  font-family: var(--ds-font-sans);
  font-size: var(--ds-text-md);
  background-color: var(--ds-color-bg-surface);
  border: 1px solid var(--ds-color-border-default);
  border-radius: var(--ds-radius-md);
  cursor: pointer;
  transition:
    border-color var(--ds-transition-fast),
    box-shadow var(--ds-transition-normal);
}

.trigger:hover:not(:disabled) {
  border-color: var(--ds-color-border-focus);
  box-shadow: var(--ds-shadow-sm);
}

.trigger:focus-visible {
  outline: none;
  border-color: var(--ds-color-action-primary-default);
  box-shadow: 0 0 0 2px var(--ds-color-action-primary-default);
}

.trigger[data-open="true"] {
  border-color: var(--ds-color-action-primary-default);
  box-shadow: 0 0 0 2px var(--ds-color-action-primary-default);
}

.trigger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Size variants */
.trigger[data-size="sm"] {
  height: var(--ds-size-sm);
  padding: 0 var(--ds-spacing-2);
  font-size: var(--ds-text-sm);
  min-width: 120px;
}

.trigger[data-size="lg"] {
  height: var(--ds-size-lg);
  padding: 0 var(--ds-spacing-4);
  font-size: var(--ds-text-lg);
  min-width: 200px;
}

/* Chevron */
.chevron {
  display: inline-flex;
  color: var(--ds-color-text-secondary);
  transition: transform var(--ds-transition-normal);
}

.chevron[data-open="true"] {
  transform: rotate(180deg);
}

/* Dropdown */
.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: var(--ds-spacing-1);
  padding: var(--ds-spacing-1);
  background-color: var(--ds-color-bg-elevated);
  border: 1px solid var(--ds-color-border-default);
  border-radius: var(--ds-radius-md);
  box-shadow: var(--ds-shadow-lg);
  z-index: var(--ds-z-dropdown);
  max-height: 240px;
  overflow-y: auto;
}

/* Option */
.option {
  display: flex;
  align-items: center;
  gap: var(--ds-spacing-2);
  padding: var(--ds-spacing-2) var(--ds-spacing-3);
  border-radius: var(--ds-radius-sm);
  color: var(--ds-color-text-primary);
  cursor: pointer;
  transition: background-color var(--ds-transition-fast);
}

/* Mouse hover - CSS */
.option:hover:not([aria-disabled="true"]):not([aria-selected="true"]) {
  background-color: var(--ds-color-bg-muted);
}

/* Keyboard highlight - JS controlled */
.option[data-highlighted="true"]:not([aria-selected="true"]) {
  background-color: var(--ds-color-bg-muted);
}

/* Selected */
.option[aria-selected="true"] {
  background-color: var(--ds-color-action-primary-default);
  color: var(--ds-color-text-onAction);
  font-weight: var(--ds-font-weight-medium);
}

/* Disabled option */
.option[aria-disabled="true"] {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Selected value display */
.selectedValue {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.placeholder {
  color: var(--ds-color-text-muted);
}

/* Label */
.label {
  font-size: var(--ds-text-sm);
  font-weight: var(--ds-font-weight-medium);
  color: var(--ds-color-text-secondary);
  margin-bottom: var(--ds-spacing-1);
}

/* Wrapper */
.wrapper {
  display: inline-flex;
  flex-direction: column;
  position: relative;
}

.wrapper[data-full-width="true"] {
  width: 100%;
}

.wrapper[data-full-width="true"] .trigger {
  width: 100%;
}
```

### Select.tsx (간소화)

```tsx
import { useState, useRef, useEffect, useCallback } from 'react';
import type { SelectProps } from './Select.types';
import styles from './Select.module.css';

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  size = 'md',
  fullWidth = false,
  label,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (isOpen && highlightedIndex >= 0) {
            const option = options[highlightedIndex];
            if (!option.disabled) {
              onChange(option.value);
              setIsOpen(false);
            }
          } else {
            setIsOpen(!isOpen);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setHighlightedIndex((prev) =>
              prev + 1 >= options.length ? 0 : prev + 1
            );
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (isOpen) {
            setHighlightedIndex((prev) =>
              prev - 1 < 0 ? options.length - 1 : prev - 1
            );
          }
          break;
      }
    },
    [disabled, isOpen, highlightedIndex, options, onChange]
  );

  // Reset highlight on open
  useEffect(() => {
    if (isOpen) {
      const idx = options.findIndex((opt) => opt.value === value);
      setHighlightedIndex(idx >= 0 ? idx : 0);
    }
  }, [isOpen, options, value]);

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      data-full-width={fullWidth || undefined}
    >
      {label && <label className={styles.label}>{label}</label>}

      <button
        type="button"
        className={styles.trigger}
        data-size={size}
        data-open={isOpen || undefined}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
      >
        <span className={selectedOption ? styles.selectedValue : styles.placeholder}>
          {selectedOption?.label ?? placeholder}
        </span>
        <span className={styles.chevron} data-open={isOpen || undefined}>
          <ChevronIcon />
        </span>
      </button>

      {isOpen && (
        <ul ref={listRef} className={styles.dropdown} role="listbox">
          {options.map((option, index) => (
            <li
              key={option.value}
              className={styles.option}
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled}
              data-highlighted={index === highlightedIndex || undefined}
              onClick={() => {
                if (!option.disabled) {
                  onChange(option.value);
                  setIsOpen(false);
                }
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
```

---

## 제거되는 코드

- `Select.styles.ts` 전체 삭제
- trigger의 `isHovered` state
- 복잡한 스타일 스프레드 로직

---

## 완료 기준

- [ ] trigger hover/focus 스타일 CSS로 처리
- [ ] option hover 스타일 CSS로 처리
- [ ] 키보드 네비게이션 정상 동작
- [ ] `Select.styles.ts` 삭제됨
- [ ] 접근성 속성 유지 (`aria-*`)
