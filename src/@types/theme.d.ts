/**
 * 테마 이름 (하위 호환 - deprecated, palette/style 사용)
 */
export type ThemeName = 'minimal' | 'neumorphism' | 'brutalism';

/**
 * Palette/Style 이름 (E03)
 * PaletteName은 theme-presets에서 유도 (registry → themePresets 단일 소스)
 */
export type { PaletteName } from '../constants/theme-presets';
export type StyleName = 'minimal' | 'neumorphism' | 'brutalism';

/** E08: 시스템 컬러 프리셋 (Error, Warning, Success, Info) */
export type SystemPresetName = 'default' | 'muted';

/**
 * 액션 색상 (상태별)
 */
export interface ActionColors {
  default: string;
  hover: string;
  active?: string;
}

/**
 * 테마 색상 구조
 */
export interface ThemeColors {
  bg: {
    base: string;
    surface: string;
    surfaceBrand: string;
    elevated: string;
    muted: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
    onAction: string;
  };
  border: {
    default: string;
    subtle: string;
    accent: string;
    focus: string;
  };
  action: {
    primary: ActionColors;
    secondary: ActionColors;
    accent: ActionColors;
  };
  feedback: {
    error: { bg: string; text: string; border: string };
    warning: { bg: string; text: string; border: string };
    success: { bg: string; text: string; border: string };
    info: { bg: string; text: string; border: string };
  };
}

/**
 * 테마 그림자 구조
 */
export interface ThemeShadows {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  inset: string;
}

/**
 * 전체 테마 객체 (E03: palette, style, border 추가)
 */
export interface Theme {
  palette: PaletteName;
  style: StyleName;
  colors: ThemeColors;
  shadows: ThemeShadows;
  border: {
    width: string;
    style: string;
  };
}
