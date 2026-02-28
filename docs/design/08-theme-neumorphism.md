# 08. Theme: Neumorphism

## Overview

소프트 UI. 배경과 요소가 동일한 색상에서 빛과 그림자로 입체감 표현.

---

## 디자인 원칙

```
1. 동일 표면 - 배경과 요소가 같은 색
2. 이중 그림자 - 빛(좌상단) + 그림자(우하단)
3. 볼록/오목 - raised(돌출) / inset(눌림) 전환
4. 부드러운 경계 - 선명한 테두리 대신 그림자로 구분
```

---

## 시각적 특징

| 요소 | Neumorphism 특징 |
|------|------------------|
| 배경 | 밝은 회색/베이지 계열 |
| 표면 | 배경과 동일 색상 |
| 그림자 | 좌상단 밝음 + 우하단 어두움 |
| 테두리 | 없음 (그림자로 대체) |
| 상태 변화 | raised ↔ inset 전환 |

---

## 핵심: 배경색 기반 Shadow

```
     밝은 하이라이트 (빛 방향)
          ↖
    ┌──────────────┐
    │              │
    │    요소      │
    │              │
    └──────────────┘
                    ↘
              어두운 그림자
```

### Shadow 계산

```typescript
// 배경색에서 밝은/어두운 색상 파생
const bgColor = '#E0E5EC';
const lightShadow = lighten(bgColor, 15);  // #FFFFFF에 가까움
const darkShadow = darken(bgColor, 15);    // #B8BEC5

// Raised (돌출)
shadow: `
  6px 6px 12px ${darkShadow},
  -6px -6px 12px ${lightShadow}
`;

// Inset (눌림)
shadow: `
  inset 4px 4px 8px ${darkShadow},
  inset -4px -4px 8px ${lightShadow}
`;
```

---

## 테마 토큰 정의

```typescript
// themes/neumorphism/tokens.ts

import type { Theme } from '@/@types/theme';
import type { ResolvedPalette } from '@/@types/tokens';
import { generateColorScales } from '@/tokens/primitives/colors';
import { lighten, darken } from '@/utils/color';

export function createNeumorphismTheme(palette: ResolvedPalette): Theme {
  const scales = generateColorScales(palette);

  // Neumorphism 배경색 = sub 컬러 (밝은 회색 계열 권장)
  const bgColor = palette.sub;
  const lightShadow = lighten(bgColor, 15);
  const darkShadow = darken(bgColor, 15);

  return {
    name: 'neumorphism',

    colors: {
      bg: {
        base: bgColor,           // 배경
        surface: bgColor,        // 표면 = 배경과 동일
        elevated: bgColor,       // 떠있는 요소도 동일
        muted: darken(bgColor, 5),
      },

      text: {
        primary: scales.sub[800],
        secondary: scales.sub[600],
        muted: scales.sub[500],
        inverse: '#FFFFFF',
        onAction: '#FFFFFF',
      },

      border: {
        default: 'transparent',   // Neumorphism은 테두리 없음
        subtle: 'transparent',
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

      sm: `
        3px 3px 6px ${darkShadow},
        -3px -3px 6px ${lightShadow}
      `.replace(/\s+/g, ' ').trim(),

      md: `
        6px 6px 12px ${darkShadow},
        -6px -6px 12px ${lightShadow}
      `.replace(/\s+/g, ' ').trim(),

      lg: `
        10px 10px 20px ${darkShadow},
        -10px -10px 20px ${lightShadow}
      `.replace(/\s+/g, ' ').trim(),

      xl: `
        15px 15px 30px ${darkShadow},
        -15px -15px 30px ${lightShadow}
      `.replace(/\s+/g, ' ').trim(),

      inset: `
        inset 4px 4px 8px ${darkShadow},
        inset -4px -4px 8px ${lightShadow}
      `.replace(/\s+/g, ' ').trim(),
    },
  };
}
```

---

## 컴포넌트별 스타일

### Button

```css
/* Primary - Raised 상태 */
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

/* Active - Inset 상태 (눌림) */
.button-primary:active {
  background: var(--ds-color-action-primary-active);
  box-shadow: var(--ds-shadow-inset);
}

/* Soft Button - 배경과 동일 색상 */
.button-soft {
  background: var(--ds-color-bg-base);
  color: var(--ds-color-text-primary);
  border: none;
  box-shadow: var(--ds-shadow-sm);
}

.button-soft:hover {
  box-shadow: var(--ds-shadow-md);
}

.button-soft:active {
  box-shadow: var(--ds-shadow-inset);
}
```

### Card

```css
.card {
  background: var(--ds-color-bg-surface);
  border: none;  /* 테두리 없음 */
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
/* Input은 오목하게 (Inset) */
.input {
  background: var(--ds-color-bg-base);
  border: none;
  border-radius: var(--ds-radius-md);
  box-shadow: var(--ds-shadow-inset);  /* 눌린 느낌 */
  padding: var(--ds-spacing-2) var(--ds-spacing-3);
  color: var(--ds-color-text-primary);
}

.input::placeholder {
  color: var(--ds-color-text-muted);
}

.input:focus {
  outline: none;
  box-shadow:
    var(--ds-shadow-inset),
    0 0 0 3px rgba(99, 102, 241, 0.3);  /* focus ring 추가 */
}

.input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

### Navigation

```css
.navigation {
  background: var(--ds-color-bg-surface);
  border: none;
  box-shadow: var(--ds-shadow-sm);
  padding: var(--ds-spacing-3) var(--ds-spacing-6);
}

.navigation-link {
  color: var(--ds-color-text-primary);
  text-decoration: none;
  padding: var(--ds-spacing-2) var(--ds-spacing-3);
  border-radius: var(--ds-radius-md);
}

.navigation-link:hover {
  box-shadow: var(--ds-shadow-sm);
}

.navigation-link:active {
  box-shadow: var(--ds-shadow-inset);
}
```

---

## 상태 전환

Neumorphism의 핵심: **Raised ↔ Inset 전환**

| 상태 | Shadow | 느낌 |
|------|--------|------|
| default | `sm` (raised) | 살짝 떠있음 |
| hover | `md` (raised) | 더 떠오름 |
| active | `inset` | 눌림 |
| disabled | `none` | 평평함 |

### 시각적 전환

```
Default (Raised)         Active (Inset)

░░░░┌────────┐           ┌────────┐░░░░
░░░░│        │           │▓▓▓▓▓▓▓▓│░░░░
░░░░│ Button │    →      │ Button │░░░░
░░░░│        │           │        │░░░░
░░░░└────────┘▓▓▓▓       └────────┘▓▓▓▓
         ▓▓▓▓▓▓▓▓               (눌림)
      (떠있음)
```

### Transition

```css
.neumorphism-component {
  transition:
    box-shadow var(--ds-duration-normal) var(--ds-ease-out),
    background-color var(--ds-duration-fast) var(--ds-ease-out);
}
```

---

## 배경색 권장 가이드

Neumorphism이 잘 동작하는 배경색:

| 색상 | Hex | 권장도 |
|------|-----|--------|
| 연한 회색 | `#E0E5EC` | **최적** |
| 밝은 회색 | `#F0F0F3` | 좋음 |
| 연한 베이지 | `#EDE7DC` | 좋음 |
| 연한 블루 | `#E3F2FD` | 좋음 |
| 순백 | `#FFFFFF` | 비권장 (대비 부족) |
| 어두운 색 | `#333333` | 다크 뉴모피즘 (별도 처리 필요) |

### 외부 입력 검증

```typescript
// Sub 컬러가 Neumorphism에 적합한지 검증
function isValidNeumorphismBg(color: string): boolean {
  const lightness = getLightness(color);
  // 밝기 80-95% 범위가 최적
  return lightness >= 0.8 && lightness <= 0.95;
}
```

---

## 예시 색상 팔레트

### Neumorphism 최적 입력

```typescript
const input = {
  primary: '#6366F1',    // Indigo
  secondary: '#8B5CF6',  // Violet
  accent: '#F59E0B',     // Amber
  sub: '#E0E5EC',        // Neumorphism 배경 (연한 회색)
};

// 결과
{
  bg: { base: '#E0E5EC', surface: '#E0E5EC' },
  shadows: {
    md: '6px 6px 12px #B8BEC5, -6px -6px 12px #FFFFFF',
    inset: 'inset 4px 4px 8px #B8BEC5, inset -4px -4px 8px #FFFFFF',
  }
}
```

### 컬러풀 Neumorphism

```typescript
const input = {
  primary: '#E17055',    // Coral
  sub: '#FBE9E7',        // 연한 코랄 배경
};

// 결과 - 따뜻한 느낌의 Neumorphism
{
  bg: { base: '#FBE9E7' },
  shadows: {
    md: '6px 6px 12px #D4C4BE, -6px -6px 12px #FFFFFF',
  }
}
```

---

## Minimal vs Neumorphism 비교

| 요소 | Minimal | Neumorphism |
|------|---------|-------------|
| 배경 | 흰색 | 밝은 회색/베이지 |
| 표면 | 배경과 다름 | 배경과 동일 |
| 그림자 | 단방향 drop | 양방향 (빛+그림자) |
| 테두리 | 있음 (1px) | 없음 |
| 버튼 active | 어두운 배경 | inset shadow |
| Input | border 강조 | inset (오목) |
