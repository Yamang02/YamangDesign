/**
 * E01: Lab 비교용 CSS 변수 프리셋
 * 각 Lab에서 프리셋을 나란히 비교하기 위한 inline style 오버라이드
 */
import { minimalStyle, neumorphismStyle } from '../styles';
import { palettePresets, stylePresets } from '../themes/presets';
import { createPalette } from '../palettes';
import { combineTheme } from '../themes/combine';
import { flattenToCSSVars } from '../utils/css';
import type { StyleName, PaletteName } from '../@types/theme';

/** CSS 변수 객체 타입 */
type CSSVariables = Record<string, string>;

const styleMap = {
  minimal: minimalStyle,
  neumorphism: neumorphismStyle,
} as const;

/**
 * Style 프리셋 → CSS 변수 객체
 * 배경색을 받아 해당 스타일의 shadow 변수들 생성
 */
export function getStyleVariables(
  styleName: StyleName,
  bgColor: string = '#f5f5f5'
): CSSVariables {
  const style = styleMap[styleName as keyof typeof styleMap];
  if (!style) return {};

  const shadows = style.createShadows(bgColor);

  return {
    '--ds-shadow-none': shadows.none,
    '--ds-shadow-sm': shadows.sm,
    '--ds-shadow-md': shadows.md,
    '--ds-shadow-lg': shadows.lg,
    '--ds-shadow-xl': shadows.xl,
    '--ds-shadow-inset': shadows.inset,
    '--ds-border-width': style.border.width,
  };
}

/**
 * Palette 프리셋 → CSS 변수 객체 (스케일 변수)
 * Color Scales 스와치 표시용
 */
export function getPaletteVariables(paletteName: PaletteName): CSSVariables {
  if (paletteName === 'custom') return {};

  const preset = palettePresets[paletteName as Exclude<PaletteName, 'custom'>];
  if (!preset) return {};

  const expanded = createPalette(preset);
  const vars: CSSVariables = {};

  (['primary', 'secondary', 'accent', 'sub'] as const).forEach((key) => {
    const scale = expanded.scales[key];
    if (scale) {
      Object.entries(scale).forEach(([step, color]) => {
        vars[`--ds-color-${key}-${step}`] = color;
      });
    }
  });

  return vars;
}

/**
 * Palette + Style 조합 → 전체 테마 CSS 변수
 * Playground 매트릭스에서 Button/Card 시맨틱 변수 적용용
 */
export function getThemeVariables(
  paletteName: PaletteName,
  styleName: StyleName
): CSSVariables {
  if (paletteName === 'custom') return {};

  const paletteDef = palettePresets[paletteName as Exclude<PaletteName, 'custom'>];
  const styleDef = stylePresets[styleName];
  if (!paletteDef || !styleDef) return {};

  const theme = combineTheme(paletteDef, styleDef);
  return flattenToCSSVars({
    color: theme.colors,
    shadow: theme.shadows,
    border: theme.border,
  });
}

/** 비교 대상 프리셋 목록 */
export const comparisonPresets = {
  styles: ['minimal', 'neumorphism'] as StyleName[],
  palettes: ['default', 'vivid', 'pastel', 'monochrome', 'earth'] as PaletteName[],
};
