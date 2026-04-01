/**
 * ThemeTokenSet — Palette × Style 조합의 CSS 변수 전체를 담는 Value Object.
 * ThemeProvider·getThemeVariables는 이 단일 경로를 사용한다. `buildThemeAndTokenSet`은 createPalette/createStyle 중복 호출을 막는다.
 * 처리 순서: systemPreset 해석(이름 또는 객체) → 스케일 변수 → 시맨틱(피드백은 시스템 프리셋 시 덮어씀) → 스타일·서피스 변수.
 */
import type { PaletteDefinition } from '../palettes';
import type { StyleDefinition } from '../styles';
import { createPalette } from '../palettes';
import { createStyle } from '../styles';
import type { Theme, SystemPresetName } from '@shared/@types/theme';
import { flattenToCSSVars } from '@shared/utils/css';
import { PALETTE_SCALES } from '../constants/palette-scales';
import type { SystemColorPreset } from '../tokens/global/system-colors';
import { systemColorPresets } from '../tokens/global/system-colors';
import { neutralPresets } from '../tokens/global/neutral-presets';
import type { NeutralPresetName } from '../tokens/global/neutral-presets';

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
  options?: { systemPreset?: SystemColorPreset | SystemPresetName; neutralPreset?: NeutralPresetName }
): ThemeTokenSet {
  const neutralScale = options?.neutralPreset ? neutralPresets[options.neutralPreset]?.scale : undefined;
  const expanded = createPalette(palette, { neutralScale });
  const resolved = createStyle(style, expanded.semantic.bg.base);

  const resolvedSystemPreset: SystemColorPreset | undefined = (() => {
    if (!options?.systemPreset) return undefined;
    if (typeof options.systemPreset === 'string') {
      return systemColorPresets[options.systemPreset];
    }
    return options.systemPreset;
  })();

  const scaleVars: Record<string, string> = {};
  PALETTE_SCALES.forEach((key) => {
    const scale = expanded.scales[key];
    if (scale) {
      Object.entries(scale).forEach(([step, color]) => {
        scaleVars[`--ds-color-${key}-${step}`] = color as string;
      });
    }
  });

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
      text: expanded.semantic.text,
      border: expanded.semantic.border,
      action: expanded.semantic.action,
      feedback: feedbackColors,
      badge: {
        custom: expanded.scales.accent[500],
        semantic: expanded.scales.secondary[500],
        natural: expanded.scales.sub[500],
      },
      demo: {
        glass: {
          start: expanded.scales.primary[100],
          mid: expanded.scales.accent[100],
          end: expanded.scales.secondary[100],
        },
      },
    },
  });

  const styleVars = flattenToCSSVars({
    shadow: resolved.shadows,
    border: resolved.border,
  });

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
  options?: { systemPreset?: SystemColorPreset | SystemPresetName; neutralPreset?: NeutralPresetName }
): { theme: Theme; tokenSet: ThemeTokenSet } {
  const neutralScale = options?.neutralPreset ? neutralPresets[options.neutralPreset]?.scale : undefined;
  const expanded = createPalette(palette, { neutralScale });
  const resolved = createStyle(style, expanded.semantic.bg.base);

  const resolvedSystemPreset: SystemColorPreset | undefined = (() => {
    if (!options?.systemPreset) return undefined;
    if (typeof options.systemPreset === 'string') {
      return systemColorPresets[options.systemPreset];
    }
    return options.systemPreset;
  })();

  const scaleVars: Record<string, string> = {};
  PALETTE_SCALES.forEach((key) => {
    const scale = expanded.scales[key];
    if (scale) {
      Object.entries(scale).forEach(([step, color]) => {
        scaleVars[`--ds-color-${key}-${step}`] = color as string;
      });
    }
  });

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
      text: expanded.semantic.text,
      border: expanded.semantic.border,
      action: expanded.semantic.action,
      feedback: feedbackColors,
      badge: {
        custom: expanded.scales.accent[500],
        semantic: expanded.scales.secondary[500],
        natural: expanded.scales.sub[500],
      },
      demo: {
        glass: {
          start: expanded.scales.primary[100],
          mid: expanded.scales.accent[100],
          end: expanded.scales.secondary[100],
        },
      },
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
      text: expanded.semantic.text,
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
