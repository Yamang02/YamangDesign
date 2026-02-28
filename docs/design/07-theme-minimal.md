# 07. Theme: Minimal

## Overview

깔끔하고 현대적인 플랫 디자인. 미세한 그림자와 명확한 경계로 구분.

---

## 디자인 원칙

```
1. 단순함 - 불필요한 장식 제거
2. 명확성 - 요소 간 경계 분명
3. 여백 활용 - 공간으로 그룹핑
4. 가벼운 깊이감 - 미세한 drop shadow
```

---

## 시각적 특징

| 요소 | Minimal 특징 |
|------|--------------|
| 배경 | 흰색 또는 매우 밝은 색 |
| 표면 | 배경과 구분되는 밝은 회색 |
| 그림자 | 가벼운 drop shadow (아래 방향) |
| 테두리 | 필요시 얇은 1px 라인 |
| 상태 변화 | 색상/그림자 미세 변화 |

---

## 테마 토큰 정의

```typescript
// themes/minimal/tokens.ts

import type { Theme } from '@/@types/theme';
import type { ResolvedPalette } from '@/@types/tokens';
import { generateColorScales } from '@/tokens/primitives/colors';

export function createMinimalTheme(palette: ResolvedPalette): Theme {
  const scales = generateColorScales(palette);

  return {
    name: 'minimal',

    colors: {
      bg: {
        base: '#FFFFFF',
        surface: scales.sub[100],
        elevated: '#FFFFFF',
        muted: scales.sub[200],
      },

      text: {
        primary: scales.sub[900],
        secondary: scales.sub[600],
        muted: scales.sub[400],
        inverse: '#FFFFFF',
        onAction: '#FFFFFF',
      },

      border: {
        default: scales.sub[300],
        subtle: scales.sub[200],
        focus: scales.primary[500],
      },

      action: {
        primary: {
          default: scales.primary[500],
          hover: scales.primary[600],
          active: scales.primary[700],
        },
        secondary: {
          default: scales.secondary[500],
          hover: scales.secondary[600],
          active: scales.secondary[700],
        },
        accent: {
          default: scales.accent[500],
          hover: scales.accent[600],
        },
      },
    },

    shadows: {
      none: 'none',
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      inset: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
    },
  };
}
```

---

## 컴포넌트별 스타일

### Button

```css
/* Primary */
.button-primary {
  background: var(--ds-color-action-primary-default);
  color: var(--ds-color-text-onAction);
  border: none;
  border-radius: var(--ds-radius-md);
  box-shadow: var(--ds-shadow-sm);
}

.button-primary:hover {
  background: var(--ds-color-action-primary-hover);
  box-shadow: var(--ds-shadow-md);
}

.button-primary:active {
  background: var(--ds-color-action-primary-active);
  box-shadow: var(--ds-shadow-inset);
}

/* Secondary */
.button-secondary {
  background: var(--ds-color-action-secondary-default);
  color: var(--ds-color-text-onAction);
  border: none;
}

/* Outline */
.button-outline {
  background: transparent;
  color: var(--ds-color-action-primary-default);
  border: var(--ds-border-thin) solid var(--ds-color-action-primary-default);
  box-shadow: none;
}

.button-outline:hover {
  background: var(--ds-color-action-primary-default);
  color: var(--ds-color-text-onAction);
}

/* Ghost */
.button-ghost {
  background: transparent;
  color: var(--ds-color-text-primary);
  border: none;
  box-shadow: none;
}

.button-ghost:hover {
  background: var(--ds-color-bg-muted);
}
```

### Card

```css
.card {
  background: var(--ds-color-bg-surface);
  border: var(--ds-border-thin) solid var(--ds-color-border-subtle);
  border-radius: var(--ds-radius-lg);
  box-shadow: var(--ds-shadow-md);
  padding: var(--ds-spacing-6);
}

.card:hover {
  box-shadow: var(--ds-shadow-lg);
}
```

### Input

```css
.input {
  background: var(--ds-color-bg-base);
  border: var(--ds-border-thin) solid var(--ds-color-border-default);
  border-radius: var(--ds-radius-md);
  padding: var(--ds-spacing-2) var(--ds-spacing-3);
  color: var(--ds-color-text-primary);
}

.input::placeholder {
  color: var(--ds-color-text-muted);
}

.input:hover {
  border-color: var(--ds-color-border-focus);
}

.input:focus {
  border-color: var(--ds-color-border-focus);
  outline: none;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);  /* focus ring */
}

.input:disabled {
  background: var(--ds-color-bg-muted);
  border-color: var(--ds-color-border-subtle);
  color: var(--ds-color-text-muted);
  cursor: not-allowed;
}
```

### Navigation

```css
.navigation {
  background: var(--ds-color-bg-surface);
  border-bottom: var(--ds-border-thin) solid var(--ds-color-border-subtle);
  box-shadow: var(--ds-shadow-sm);
  padding: var(--ds-spacing-3) var(--ds-spacing-6);
}

.navigation-link {
  color: var(--ds-color-text-primary);
  text-decoration: none;
}

.navigation-link:hover {
  color: var(--ds-color-action-primary-default);
}

.navigation-brand {
  color: var(--ds-color-action-primary-default);
  font-weight: var(--ds-font-semibold);
}
```

---

## 상태 전환

| 상태 | 변화 요소 |
|------|----------|
| hover | 배경 어둡게, 그림자 증가 |
| active | 배경 더 어둡게, inset shadow |
| focus | focus ring 추가 |
| disabled | 색상 흐리게, 그림자 제거 |

### Transition

```css
.minimal-component {
  transition:
    background-color var(--ds-duration-fast) var(--ds-ease-out),
    box-shadow var(--ds-duration-normal) var(--ds-ease-out),
    border-color var(--ds-duration-fast) var(--ds-ease-out);
}
```

---

## 예시 색상 팔레트

### 기본 (Primary만 입력)

```typescript
const input = { primary: '#6366F1' };  // Indigo

// 결과
{
  bg: { base: '#FFFFFF', surface: '#F5F5F5' },
  action: { primary: { default: '#6366F1' } },
  // secondary, accent는 파생
}
```

### 4색 입력

```typescript
const input = {
  primary: '#2563EB',    // Blue
  secondary: '#7C3AED',  // Violet
  accent: '#F59E0B',     // Amber
  sub: '#E5E7EB',        // Gray
};

// 결과
{
  bg: { base: '#FFFFFF', surface: '#F3F4F6' },
  action: {
    primary: { default: '#2563EB' },
    secondary: { default: '#7C3AED' },
    accent: { default: '#F59E0B' },
  },
}
```
