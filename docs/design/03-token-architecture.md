# 03. Token Architecture

## Overview

디자인 토큰의 계층 구조, 외부 컬러 입력 처리, CSS 변수 변환 메커니즘을 정의한다.

---

## 토큰 계층 구조

```
┌─────────────────────────────────────────────────────────┐
│  Layer 1: External Input (외부 입력)                     │
│  ─────────────────────────────────────────────────────  │
│  사용자가 직접 입력하는 1~4개의 메인 컬러                  │
│  { primary, secondary?, accent?, sub? }                 │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 2: Resolved Palette (파생 포함 팔레트)             │
│  ─────────────────────────────────────────────────────  │
│  미입력 색상은 primary 기반 자동 파생                     │
│  { primary, secondary, accent, sub } - 항상 4개 완성     │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 3: Primitive Tokens (원시 토큰)                   │
│  ─────────────────────────────────────────────────────  │
│  색상 + spacing + typography + borders                  │
│  순수한 값만 정의                                        │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 4: Semantic Tokens (의미 토큰)                    │
│  ─────────────────────────────────────────────────────  │
│  용도별 매핑: bg.primary, text.secondary, action.hover  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 5: Theme Tokens (테마 토큰)                       │
│  ─────────────────────────────────────────────────────  │
│  Minimal / Neumorphism 테마별 최종 값                    │
│  shadow, radius 등 테마 특성 반영                        │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 6: CSS Variables (CSS 변수)                      │
│  ─────────────────────────────────────────────────────  │
│  --ds-color-bg-primary, --ds-shadow-md                  │
│  컴포넌트에서 직접 참조                                   │
└─────────────────────────────────────────────────────────┘
```

---

## External Palette (외부 입력)

### 타입 정의

```typescript
// @types/tokens.d.ts

/**
 * 외부에서 입력되는 색상 팔레트
 * 배색 이론 기반: Primary, Secondary, Accent, Sub
 */
export interface ExternalPalette {
  /** 주조색 - 필수. 브랜드/주요 액션 컬러 */
  primary: string;

  /** 보조색 - 선택. Primary와 조화를 이루는 보조 컬러 */
  secondary?: string;

  /** 강조색 - 선택. 주의 환기, 하이라이트용 */
  accent?: string;

  /** 서브컬러 - 선택. 배경, 중립 요소용 */
  sub?: string;
}
```

### 입력 조합 예시

```typescript
// 1색 (primary만)
{ primary: '#FF6B6B' }

// 2색 (primary + sub)
{ primary: '#FF6B6B', sub: '#F7F7F7' }

// 2색 (primary + accent)
{ primary: '#FF6B6B', accent: '#FFE66D' }

// 3색
{ primary: '#FF6B6B', secondary: '#4ECDC4', sub: '#F7F7F7' }

// 4색 (전부 지정)
{
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  accent: '#FFE66D',
  sub: '#F7F7F7'
}
```

---

## Resolved Palette (파생 처리)

### 타입 정의

```typescript
// @types/tokens.d.ts

/**
 * 파생 처리 완료된 팔레트
 * 항상 4개 색상이 존재함을 보장
 */
export interface ResolvedPalette {
  primary: string;
  secondary: string;
  accent: string;
  sub: string;

  /** 메타 정보: 어떤 색상이 파생인지 추적 */
  _meta: {
    derived: {
      secondary: boolean;
      accent: boolean;
      sub: boolean;
    };
  };
}
```

### 파생 로직

```typescript
// utils/palette.ts

import { adjustHue, desaturate, lighten } from './color';

export function resolvePalette(input: ExternalPalette): ResolvedPalette {
  const { primary, secondary, accent, sub } = input;

  return {
    primary,
    secondary: secondary ?? deriveSecondary(primary),
    accent: accent ?? deriveAccent(primary),
    sub: sub ?? deriveSub(primary),

    _meta: {
      derived: {
        secondary: !secondary,
        accent: !accent,
        sub: !sub,
      },
    },
  };
}

/** Secondary 파생: 색상환 30도 이동 */
function deriveSecondary(primary: string): string {
  return adjustHue(primary, 30);
}

/** Accent 파생: 보색 계열 (180도) 또는 삼각 배색 (120도) */
function deriveAccent(primary: string): string {
  return adjustHue(primary, 180);
}

/** Sub 파생: 채도 낮추고 밝게 */
function deriveSub(primary: string): string {
  return desaturate(lighten(primary, 40), 70);
}
```

---

## Primitive Tokens (원시 토큰)

### Colors

```typescript
// tokens/primitives/colors.ts

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;  // base
  600: string;
  700: string;
  800: string;
  900: string;
}

/**
 * 4개 메인 컬러에서 각각 10단계 스케일 생성
 */
export function generateColorScales(palette: ResolvedPalette) {
  return {
    primary: generateScale(palette.primary),
    secondary: generateScale(palette.secondary),
    accent: generateScale(palette.accent),
    sub: generateScale(palette.sub),
  };
}

function generateScale(baseColor: string): ColorScale {
  return {
    50: lighten(baseColor, 45),
    100: lighten(baseColor, 40),
    200: lighten(baseColor, 30),
    300: lighten(baseColor, 20),
    400: lighten(baseColor, 10),
    500: baseColor,
    600: darken(baseColor, 10),
    700: darken(baseColor, 20),
    800: darken(baseColor, 30),
    900: darken(baseColor, 40),
  };
}
```

### Spacing

```typescript
// tokens/primitives/spacing.ts

/** 4px 기반 스케일 */
export const spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
} as const;

export type SpacingKey = keyof typeof spacing;
```

### Typography

```typescript
// tokens/primitives/typography.ts

export const typography = {
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const;
```

### Borders

```typescript
// tokens/primitives/borders.ts

export const borders = {
  radius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  width: {
    none: '0',
    thin: '1px',
    medium: '2px',
    thick: '4px',
  },
} as const;
```

---

## Semantic Tokens (의미 토큰)

```typescript
// tokens/semantic/colors.ts

export interface SemanticColors {
  bg: {
    base: string;       // 페이지 배경
    surface: string;    // 카드/패널 표면
    elevated: string;   // 떠있는 요소
    muted: string;      // 비활성 배경
  };

  text: {
    primary: string;    // 주요 텍스트
    secondary: string;  // 보조 텍스트
    muted: string;      // 흐린 텍스트
    inverse: string;    // 반전 텍스트 (어두운 배경 위)
    onAction: string;   // 액션 버튼 위 텍스트
  };

  border: {
    default: string;
    subtle: string;
    focus: string;
  };

  action: {
    primary: {
      default: string;
      hover: string;
      active: string;
    };
    secondary: {
      default: string;
      hover: string;
      active: string;
    };
    accent: {
      default: string;
      hover: string;
    };
  };
}

export function createSemanticColors(
  scales: ReturnType<typeof generateColorScales>
): SemanticColors {
  return {
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
  };
}
```

---

## CSS 변수 변환

### 네이밍 규칙

```
--ds-{category}-{property}-{variant}

예시:
--ds-color-bg-base
--ds-color-text-primary
--ds-color-action-primary-default
--ds-shadow-md
--ds-spacing-4
--ds-radius-md
```

### 변환 유틸리티

```typescript
// utils/css.ts

const CSS_VAR_PREFIX = 'ds';

/**
 * 중첩 객체를 평탄화하여 CSS 변수명 생성
 */
export function flattenToCSSVars(
  obj: Record<string, unknown>,
  prefix = ''
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    const varName = prefix ? `${prefix}-${key}` : key;

    if (typeof value === 'object' && value !== null && !key.startsWith('_')) {
      Object.assign(result, flattenToCSSVars(value as Record<string, unknown>, varName));
    } else if (typeof value === 'string') {
      result[`--${CSS_VAR_PREFIX}-${varName}`] = value;
    }
  }

  return result;
}

/**
 * CSS 변수를 :root에 주입
 */
export function injectCSSVariables(vars: Record<string, string>): void {
  const root = document.documentElement;

  for (const [name, value] of Object.entries(vars)) {
    root.style.setProperty(name, value);
  }
}
```

### 컴포넌트에서 사용

```css
/* Button.styles.ts에서 생성되는 CSS */
.button-primary {
  background-color: var(--ds-color-action-primary-default);
  color: var(--ds-color-text-onAction);
  border-radius: var(--ds-radius-md);
  padding: var(--ds-spacing-2) var(--ds-spacing-4);
}

.button-primary:hover {
  background-color: var(--ds-color-action-primary-hover);
}
```

---

## 토큰 흐름 요약

```
사용자 입력                        컴포넌트 렌더링
     │                                   ▲
     ▼                                   │
ExternalPalette ──► resolvePalette() ──► generateColorScales()
                          │                      │
                          ▼                      ▼
                    ResolvedPalette ──► SemanticColors
                                              │
                                              ▼
                                        Theme 객체
                                              │
                                              ▼
                                    flattenToCSSVars()
                                              │
                                              ▼
                                    injectCSSVariables()
                                              │
                                              ▼
                                      :root CSS 변수
                                              │
                                              ▼
                                    var(--ds-xxx) 참조
```
