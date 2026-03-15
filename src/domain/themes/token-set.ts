/**
 * E11 P01: ThemeTokenSet — Palette × Style 조합의 CSS 변수 전체를 담는 Value Object
 * ThemeProvider와 getThemeVariables 모두 이 단일 경로를 사용한다.
 * P05: buildThemeAndTokenSet으로 createPalette 중복 호출 제거
 */
import type { PaletteDefinition } from '../palettes';
import type { StyleDefinition } from '../styles';
import { createPalette } from '../palettes';
import { createStyle } from '../styles';
import type { Theme } from '@shared/@types/theme';
import { flattenToCSSVars } from '@shared/utils/css';
import { PALETTE_SCALES } from '../constants/palette-scales';
import type { SystemColorPreset } from '../tokens/global/system-colors';
import { systemColorPresets } from '../tokens/global/system-colors';
import type { SystemPresetName } from '@shared/@types/theme';

/**
 * 특정 Palette+Style 조합이 내보내는 테마 반응형 CSS 변수 전체.
 * Primitive 변수(spacing, typography 등)는 포함하지 않는다.
 */
export interface ThemeTokenSet {
  /** --ds-color-{scale}-{step} (primary/secondary/accent/neutral/sub × 50~900) */
  scaleVars: Record<string, string>;
  /** --ds-color-{bg|text|border|action|feedback}-* */
  semanticVars: Record<string, string>;
  /** --ds-shadow-*, --ds-border-* */
  styleVars: Record<string, string>;
  /** --ds-surface-*, --ds-filter, --ds-perspective 등 style.createVars 산출물 */
  surfaceVars: Record<string, string>;
}

/**
 * 모든 슬롯을 합친 flat CSS 변수 맵
 * (inline style / injectCSSVariables 직접 사용)
 */
export function flattenTokenSet(set: ThemeTokenSet): Record<string, string> {
  return {
    ...set.scaleVars,
    ...set.semanticVars,
    ...set.styleVars,
    ...set.surfaceVars,
  };
}

/**
 * Palette + Style 정의로부터 ThemeTokenSet을 생성하는 팩토리.
 * ThemeProvider와 getThemeVariables 양쪽에서 단일 경로로 사용된다.
 *
 * @param palette - 팔레트 정의
 * @param style - 스타일 정의
 * @param options.systemPreset - 시스템 컬러 프리셋 (제공 시 feedback 색상에 반영)
 */
export function buildTokenSet(
  palette: PaletteDefinition,
  style: StyleDefinition,
  options?: { systemPreset?: SystemColorPreset | SystemPresetName }
): ThemeTokenSet {
  const expanded = createPalette(palette);
  const resolved = createStyle(style, expanded.semantic.bg.base);

  // Resolve systemPreset: accept name string or object
  const resolvedSystemPreset: SystemColorPreset | undefined = (() => {
    if (!options?.systemPreset) return undefined;
    if (typeof options.systemPreset === 'string') {
      return systemColorPresets[options.systemPreset as SystemPresetName];
    }
    return options.systemPreset;
  })();

  // 1. Scale vars — --ds-color-{scale}-{step}
  const scaleVars: Record<string, string> = {};
  PALETTE_SCALES.forEach((key) => {
    const scale = expanded.scales[key];
    if (scale) {
      Object.entries(scale).forEach(([step, color]) => {
        scaleVars[`--ds-color-${key}-${step}`] = color as string;
      });
    }
  });

  // Compute feedback colors: use systemPreset overrides when provided
  const feedbackColors = resolvedSystemPreset
    ? {
        error: {
          bg: resolvedSystemPreset.colors.error[50],
          border: resolvedSystemPreset.colors.error[500],
          text: resolvedSystemPreset.colors.error[700],
        },
        warning: {
          bg: resolvedSystemPreset.colors.warning[50],
          border: resolvedSystemPreset.colors.warning[500],
          text: resolvedSystemPreset.colors.warning[700],
        },
        success: {
          bg: resolvedSystemPreset.colors.success[50],
          border: resolvedSystemPreset.colors.success[500],
          text: resolvedSystemPreset.colors.success[700],
        },
        info: {
          bg: resolvedSystemPreset.colors.info[50],
          border: resolvedSystemPreset.colors.info[500],
          text: resolvedSystemPreset.colors.info[700],
        },
      }
    : expanded.semantic.feedback;

  // 2. Semantic vars — --ds-color-{bg|text|border|action|feedback}-*
  const semanticVars = flattenToCSSVars({
    color: {
      bg: expanded.semantic.bg,
      text: {
        ...expanded.semantic.text,
        inverse:
          palette.bgStrategy === 'dark'
            ? expanded.semantic.text.primary
            : '#FFFFFF',
      },
      border: expanded.semantic.border,
      action: expanded.semantic.action,
      feedback: feedbackColors,
    },
  });

  // 3. Style vars — --ds-shadow-*, --ds-border-*
  const styleVars = flattenToCSSVars({
    shadow: resolved.shadows,
    border: resolved.border,
  });

  // 4. Surface vars — --ds-surface-*, --ds-filter, --ds-perspective, etc.
  const surfaceVars = resolved.vars;

  return { scaleVars, semanticVars, styleVars, surfaceVars };
}

/**
 * P05: Palette + Style 정의로부터 Theme 객체와 ThemeTokenSet을 한 번의
 * createPalette / createStyle 호출로 함께 생성한다.
 *
 * ThemeProvider가 이 함수를 사용하여 중복 계산을 제거한다.
 */
export function buildThemeAndTokenSet(
  palette: PaletteDefinition,
  style: StyleDefinition,
  options?: { systemPreset?: SystemColorPreset | SystemPresetName }
): { theme: Theme; tokenSet: ThemeTokenSet } {
  const expanded = createPalette(palette);
  const resolved = createStyle(style, expanded.semantic.bg.base);

  // Resolve systemPreset
  const resolvedSystemPreset: SystemColorPreset | undefined = (() => {
    if (!options?.systemPreset) return undefined;
    if (typeof options.systemPreset === 'string') {
      return systemColorPresets[options.systemPreset as SystemPresetName];
    }
    return options.systemPreset;
  })();

  // Scale vars
  const scaleVars: Record<string, string> = {};
  PALETTE_SCALES.forEach((key) => {
    const scale = expanded.scales[key];
    if (scale) {
      Object.entries(scale).forEach(([step, color]) => {
        scaleVars[`--ds-color-${key}-${step}`] = color as string;
      });
    }
  });

  // Feedback colors
  const feedbackColors = resolvedSystemPreset
    ? {
        error: {
          bg: resolvedSystemPreset.colors.error[50],
          border: resolvedSystemPreset.colors.error[500],
          text: resolvedSystemPreset.colors.error[700],
        },
        warning: {
          bg: resolvedSystemPreset.colors.warning[50],
          border: resolvedSystemPreset.colors.warning[500],
          text: resolvedSystemPreset.colors.warning[700],
        },
        success: {
          bg: resolvedSystemPreset.colors.success[50],
          border: resolvedSystemPreset.colors.success[500],
          text: resolvedSystemPreset.colors.success[700],
        },
        info: {
          bg: resolvedSystemPreset.colors.info[50],
          border: resolvedSystemPreset.colors.info[500],
          text: resolvedSystemPreset.colors.info[700],
        },
      }
    : expanded.semantic.feedback;

  const semanticVars = flattenToCSSVars({
    color: {
      bg: expanded.semantic.bg,
      text: {
        ...expanded.semantic.text,
        inverse:
          palette.bgStrategy === 'dark'
            ? expanded.semantic.text.primary
            : '#FFFFFF',
      },
      border: expanded.semantic.border,
      action: expanded.semantic.action,
      feedback: feedbackColors,
    },
  });

  const styleVars = flattenToCSSVars({
    shadow: resolved.shadows,
    border: resolved.border,
  });

  const tokenSet: ThemeTokenSet = {
    scaleVars,
    semanticVars,
    styleVars,
    surfaceVars: resolved.vars,
  };

  const theme: Theme = {
    palette: expanded.id,
    style: resolved.name,
    colors: {
      bg: expanded.semantic.bg,
      text: {
        ...expanded.semantic.text,
        inverse:
          palette.bgStrategy === 'dark'
            ? expanded.semantic.text.primary
            : '#FFFFFF',
      },
      border: expanded.semantic.border,
      action: expanded.semantic.action,
      feedback: expanded.semantic.feedback,
    },
    shadows: resolved.shadows,
    border: resolved.border,
    vars: resolved.vars,
  };

  return { theme, tokenSet };
}
