/**
 * Elevation: shadow 원시값
 * 테마(minimal/neumorphism/brutalism)가 이 값을 조합해서 alias 생성
 */
export const elevation = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  inset: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const;

export type ElevationKey = keyof typeof elevation;
