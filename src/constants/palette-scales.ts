/**
 * 팔레트 스케일 및 스텝 상수
 * 여러 컴포넌트에서 공유되는 상수를 중앙화
 */

/** 팔레트 스케일 키 (UI 표시 순서) */
export const PALETTE_SCALES = [
  'primary',
  'secondary',
  'accent',
  'sub',
  'neutral',
] as const;
export type PaletteScale = (typeof PALETTE_SCALES)[number];

/** 스케일 스텝 (50-900) */
export const SCALE_STEPS = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900,
] as const;
export type ScaleStep = (typeof SCALE_STEPS)[number];

/** 시스템 컬러 키 */
export const SYSTEM_COLOR_KEYS = [
  'error',
  'warning',
  'success',
  'info',
] as const;
export type SystemColorKey = (typeof SYSTEM_COLOR_KEYS)[number];

/** 시스템 컬러에서 사용하는 스텝 */
export const SYSTEM_SCALE_STEPS = [50, 500, 700] as const;
export type SystemScaleStep = (typeof SYSTEM_SCALE_STEPS)[number];
