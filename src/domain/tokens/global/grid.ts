/**
 * E20 P02: Grid primitive tokens (Global Layer)
 * 컬럼 그리드, 거터, 마진, 브레이크포인트 정의
 */

export const gridColumns = {
  compact: 4,
  tablet: 8,
  desktop: 12,
} as const;

export const gridGutter = {
  compact: '16px',
  tablet: '24px',
  desktop: '32px',
} as const;

export const gridMargin = {
  compact: '16px',
  tablet: '32px',
  desktop: '64px',
} as const;

export const breakpoints = {
  sm: '480px',
  md: '768px',
  lg: '1024px',
  xl: '1440px',
} as const;

export type GridBreakpoint = keyof typeof gridColumns;
export type Breakpoint = keyof typeof breakpoints;
