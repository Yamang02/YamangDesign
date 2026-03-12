/**
 * E01: Lab 비교용 CSS 변수 프리셋
 * 각 Lab에서 프리셋을 나란히 비교하기 위한 inline style 오버라이드
 */
import { palettePresets, stylePresets } from '../themes/presets';
import { systemColorPresets } from '../tokens/global/system-colors';
import { neutralPresets, type NeutralPresetName } from '../tokens/global/neutral-presets';
import { generateSystemColorVars } from '../utils/system-colors';
import { createPalette } from '../palettes';
import { combineTheme } from '../themes/combine';
import { flattenToCSSVars } from '../utils/css';
import type { PaletteDefinition } from '../palettes';
import type { StyleName, PaletteName, SystemPresetName } from '../@types/theme';

/** CSS 변수 객체 타입 */
type CSSVariables = Record<string, string>;

/**
 * Style 프리셋 → CSS 변수 객체
 * 배경색을 받아 해당 스타일의 shadow 변수들 생성
 */
export function getStyleVariables(
  styleName: StyleName,
  bgColor: string = '#f5f5f5'
): CSSVariables {
  const style = stylePresets[styleName];
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
 * PaletteDefinition → CSS 변수 객체 (스케일 변수)
 * P05: Custom 팔레트 등 임의 정의용
 */
export function getPaletteVariablesFromDefinition(
  preset: PaletteDefinition
): CSSVariables {
  const expanded = createPalette(preset);
  const vars: CSSVariables = {};

  (['primary', 'secondary', 'accent', 'sub', 'neutral'] as const).forEach(
    (key) => {
      const scale = expanded.scales[key];
      if (scale) {
        Object.entries(scale).forEach(([step, color]) => {
          vars[`--ds-color-${key}-${step}`] = color;
        });
      }
    }
  );

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

/**
 * E08: System preset → CSS 변수 객체
 */
export function getSystemColorVariables(
  presetName: SystemPresetName
): CSSVariables {
  const preset = systemColorPresets[presetName];
  return preset ? generateSystemColorVars(preset) : {};
}

/**
 * E09: Neutral preset → CSS 변수 객체 (--ds-color-neutral-*)
 * Neutral Presets 섹션 비교용
 */
export function getNeutralPresetVariables(
  presetName: NeutralPresetName
): CSSVariables {
  const preset = neutralPresets[presetName];
  if (!preset) return {};
  const vars: CSSVariables = {};
  Object.entries(preset.scale).forEach(([step, color]) => {
    vars[`--ds-color-neutral-${step}`] = color;
  });
  return vars;
}

/** 비교 대상 프리셋 목록 (SOT: 각 preset 객체의 key에서 파생) */
export const comparisonPresets = {
  styles: Object.keys(stylePresets) as StyleName[],
  palettes: Object.keys(palettePresets) as Exclude<PaletteName, 'custom'>[],
  systemPresets: Object.keys(systemColorPresets) as SystemPresetName[],
  neutralPresets: Object.keys(neutralPresets) as NeutralPresetName[],
};
