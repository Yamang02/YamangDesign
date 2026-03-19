/**
 * 앱 레이어 — Lab/Build 페이지용 CSS 변수 생성 헬퍼 (E11 P07)
 *
 * 역할: 도메인 프리셋(palettePresets, stylePresets)을 받아
 * 페이지 inline style에 주입할 CSS 변수 객체를 생성한다.
 * 도메인 레이어가 아닌 앱 레이어다. 페이지·컴포넌트에서만 import할 것.
 *
 * 도메인 프리셋 참조: themes/presets → palettes/presets/registry (단일 소스)
 * E01: Lab 비교용 CSS 변수 프리셋
 */
import { palettePresets, stylePresets } from '../themes/presets';
import { systemColorPresets } from '../tokens/global/system-colors';
import { neutralPresets, type NeutralPresetName } from '../tokens/global/neutral-presets';
import { generateSystemColorVars } from '@domain/tokens/system-colors';
import { createPalette } from '../palettes';
import { createStyle } from '../styles';
import { buildTokenSet, flattenTokenSet } from '../themes/token-set';
import type { PaletteDefinition } from '../palettes';
import type { StyleName, PaletteName, SystemPresetName } from '@shared/@types/theme';

/** CSS 변수 객체 타입 */
type CSSVariables = Record<string, string>;

/**
 * Style 프리셋 → CSS 변수 객체
 * 배경색을 받아 해당 스타일의 shadow 변수들 생성
 */
export function getStyleVariables(
  styleName: StyleName,
  bgColor?: string
): CSSVariables {
  const styleDef = stylePresets[styleName];
  if (!styleDef) return {};

  const resolvedBgColor =
    bgColor ?? createPalette(palettePresets.default).semantic.bg.base;

  const resolved = createStyle(styleDef, resolvedBgColor);

  return {
    '--ds-shadow-none': resolved.shadows.none,
    '--ds-shadow-sm': resolved.shadows.sm,
    '--ds-shadow-md': resolved.shadows.md,
    '--ds-shadow-lg': resolved.shadows.lg,
    '--ds-shadow-xl': resolved.shadows.xl,
    '--ds-shadow-inset': resolved.shadows.inset,
    '--ds-border-width': resolved.border.width,
    ...resolved.vars,
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

  return flattenTokenSet(buildTokenSet(paletteDef, styleDef));
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
