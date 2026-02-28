# 06. Spacing, Typography & Borders

## Overview

레이아웃과 타이포그래피, 테두리 관련 토큰을 정의한다.
테마에 무관하게 일관된 값을 사용한다.

---

# Spacing

## 스케일 시스템

4px 기반 스케일. 대부분의 디자인 시스템 표준.

```typescript
// tokens/primitives/spacing.ts

export const spacing = {
  0: '0px',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  2.5: '10px',
  3: '12px',
  3.5: '14px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  11: '44px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
} as const;

export type SpacingKey = keyof typeof spacing;
export type SpacingValue = typeof spacing[SpacingKey];
```

## 시각화

```
0.5  ██                           2px
1    ████                         4px
2    ████████                     8px
3    ████████████                 12px
4    ████████████████             16px   ← 기본 단위
6    ████████████████████████     24px
8    ████████████████████████████████  32px
```

## 용도별 가이드

| 용도 | 권장 값 | 예시 |
|------|---------|------|
| 아이콘-텍스트 간격 | `1` ~ `2` | 버튼 내 아이콘 |
| 인라인 요소 간격 | `2` ~ `3` | 태그 목록 |
| 요소 내부 패딩 | `3` ~ `4` | 버튼, 입력 필드 |
| 카드 내부 패딩 | `4` ~ `6` | 카드 컨텐츠 |
| 섹션 간격 | `8` ~ `12` | 페이지 섹션 |
| 페이지 마진 | `4` ~ `8` | 좌우 여백 |

## CSS 변수

```css
:root {
  --ds-spacing-0: 0px;
  --ds-spacing-1: 4px;
  --ds-spacing-2: 8px;
  --ds-spacing-3: 12px;
  --ds-spacing-4: 16px;
  --ds-spacing-5: 20px;
  --ds-spacing-6: 24px;
  --ds-spacing-8: 32px;
  --ds-spacing-10: 40px;
  --ds-spacing-12: 48px;
  --ds-spacing-16: 64px;
}
```

---

# Typography

## Font Family

```typescript
// tokens/primitives/typography.ts

export const fontFamily = {
  /** 기본 UI 폰트 */
  sans: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(', '),

  /** 코드/숫자 폰트 */
  mono: [
    'ui-monospace',
    'SFMono-Regular',
    'Menlo',
    'Monaco',
    'Consolas',
    'monospace',
  ].join(', '),
} as const;
```

## Font Size

```typescript
export const fontSize = {
  xs: '12px',    // 캡션, 라벨
  sm: '14px',    // 보조 텍스트
  md: '16px',    // 본문 (base)
  lg: '18px',    // 강조 본문
  xl: '20px',    // 소제목
  '2xl': '24px', // 제목
  '3xl': '30px', // 대제목
  '4xl': '36px', // 히어로
} as const;
```

## Font Weight

```typescript
export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;
```

## Line Height

```typescript
export const lineHeight = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
} as const;
```

## Letter Spacing

```typescript
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
} as const;
```

## 텍스트 스타일 조합

| 용도 | Size | Weight | Line Height |
|------|------|--------|-------------|
| 본문 | `md` (16px) | `normal` | `normal` |
| 캡션 | `xs` (12px) | `normal` | `normal` |
| 라벨 | `sm` (14px) | `medium` | `tight` |
| 버튼 | `sm` ~ `md` | `medium` | `tight` |
| 소제목 | `lg` ~ `xl` | `semibold` | `tight` |
| 제목 | `2xl` ~ `3xl` | `bold` | `tight` |

## CSS 변수

```css
:root {
  /* Font Family */
  --ds-font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --ds-font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;

  /* Font Size */
  --ds-text-xs: 12px;
  --ds-text-sm: 14px;
  --ds-text-md: 16px;
  --ds-text-lg: 18px;
  --ds-text-xl: 20px;
  --ds-text-2xl: 24px;
  --ds-text-3xl: 30px;
  --ds-text-4xl: 36px;

  /* Font Weight */
  --ds-font-normal: 400;
  --ds-font-medium: 500;
  --ds-font-semibold: 600;
  --ds-font-bold: 700;

  /* Line Height */
  --ds-leading-tight: 1.25;
  --ds-leading-normal: 1.5;
  --ds-leading-relaxed: 1.625;
}
```

---

# Borders

## Border Radius

```typescript
// tokens/primitives/borders.ts

export const borderRadius = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  full: '9999px',
} as const;
```

### 용도별 가이드

| 용도 | 권장 값 | 예시 |
|------|---------|------|
| 버튼 | `md` | 일반 버튼 |
| 카드 | `lg` | 카드 컨테이너 |
| 입력 필드 | `md` | input, select |
| 뱃지/태그 | `full` | 작은 라벨 |
| 아바타 | `full` | 원형 이미지 |

## Border Width

```typescript
export const borderWidth = {
  none: '0px',
  thin: '1px',
  medium: '2px',
  thick: '4px',
} as const;
```

## Border Style

```typescript
export const borderStyle = {
  solid: 'solid',
  dashed: 'dashed',
  dotted: 'dotted',
} as const;
```

## CSS 변수

```css
:root {
  /* Border Radius */
  --ds-radius-none: 0px;
  --ds-radius-sm: 4px;
  --ds-radius-md: 8px;
  --ds-radius-lg: 12px;
  --ds-radius-xl: 16px;
  --ds-radius-2xl: 24px;
  --ds-radius-full: 9999px;

  /* Border Width */
  --ds-border-none: 0px;
  --ds-border-thin: 1px;
  --ds-border-medium: 2px;
  --ds-border-thick: 4px;
}
```

---

# Component Sizes

## 높이 시스템

```typescript
// tokens/primitives/sizes.ts

export const componentHeight = {
  xs: '24px',
  sm: '32px',
  md: '40px',
  lg: '48px',
  xl: '56px',
} as const;
```

## 컴포넌트별 적용

| 컴포넌트 | sm | md | lg |
|----------|-----|-----|-----|
| Button | 32px | 40px | 48px |
| Input | 32px | 40px | 48px |
| Select | 32px | 40px | 48px |

### 패딩 규칙

```typescript
// 높이에 따른 수평 패딩
export const componentPadding = {
  sm: { px: spacing[3], py: spacing[1] },   // 12px, 4px
  md: { px: spacing[4], py: spacing[2] },   // 16px, 8px
  lg: { px: spacing[5], py: spacing[3] },   // 20px, 12px
} as const;
```

## CSS 변수

```css
:root {
  /* Component Heights */
  --ds-size-xs: 24px;
  --ds-size-sm: 32px;
  --ds-size-md: 40px;
  --ds-size-lg: 48px;
  --ds-size-xl: 56px;
}
```

---

# Z-Index

레이어 순서 관리:

```typescript
// tokens/primitives/zIndex.ts

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  popover: 500,
  tooltip: 600,
} as const;
```

## CSS 변수

```css
:root {
  --ds-z-base: 0;
  --ds-z-dropdown: 100;
  --ds-z-sticky: 200;
  --ds-z-overlay: 300;
  --ds-z-modal: 400;
  --ds-z-popover: 500;
  --ds-z-tooltip: 600;
}
```

---

# Transition

애니메이션 타이밍:

```typescript
// tokens/primitives/transition.ts

export const duration = {
  instant: '0ms',
  fast: '100ms',
  normal: '200ms',
  slow: '300ms',
  slower: '500ms',
} as const;

export const easing = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;
```

## CSS 변수

```css
:root {
  /* Duration */
  --ds-duration-fast: 100ms;
  --ds-duration-normal: 200ms;
  --ds-duration-slow: 300ms;

  /* Easing */
  --ds-ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ds-ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ds-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```
