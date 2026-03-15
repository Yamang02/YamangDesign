/**
 * P03: 시맨틱 매핑 해석
 * ScaleReference 또는 직접 색상 → 실제 hex/rgb 문자열
 */
import type { GeneratedScales } from '../../@types/tokens';
import type { ScaleReference, SemanticMapping, SemanticColors } from '../types';
import type { SemanticTokenPath } from './recommendations';

/** ScaleReference 여부 판별 */
function isScaleReference(
  value: string | ScaleReference
): value is ScaleReference {
  return (
    typeof value === 'object' &&
    value !== null &&
    'scale' in value &&
    'step' in value
  );
}

/**
 * 단일 값을 해석: ScaleReference → scales에서 조회, string → 그대로 반환
 * sub는 항상 scales에 포함됨
 */
export function resolveColorValue(
  value: string | ScaleReference,
  scales: GeneratedScales
): string {
  if (!isScaleReference(value)) {
    return value;
  }

  const { scale, step } = value;
  const targetScale = scales[scale];
  if (!targetScale) {
    if (import.meta.env?.DEV) {
      console.warn(
        `[palette] ScaleReference scale='${scale}' step=${step} not found. Falling back to neutral-500.`
      );
    }
    return scales.neutral[500];
  }

  const color = targetScale[step];
  if (!color) {
    if (import.meta.env?.DEV) {
      console.warn(
        `[palette] ScaleReference scale='${scale}' step=${step} not found. Falling back to neutral-500.`
      );
    }
    return scales.neutral[500];
  }

  return color;
}

/**
 * SemanticMapping → SemanticColors (모든 값 resolve)
 */
export function resolveSemanticMapping(
  mapping: SemanticMapping,
  scales: GeneratedScales
): SemanticColors {
  const resolve = (v: string | ScaleReference) =>
    resolveColorValue(v, scales);

  return {
    bg: {
      base: resolve(mapping.bg.base),
      subtle: resolve(mapping.bg.subtle),
      surface: resolve(mapping.bg.surface),
      surfaceBrand: resolve(mapping.bg.surfaceBrand),
      elevated: resolve(mapping.bg.elevated),
      muted: resolve(mapping.bg.muted),
    },
    text: {
      primary: resolve(mapping.text.primary),
      secondary: resolve(mapping.text.secondary),
      muted: resolve(mapping.text.muted),
      onAction: resolve(mapping.text.onAction),
    },
    border: {
      default: resolve(mapping.border.default),
      subtle: resolve(mapping.border.subtle),
      accent: resolve(mapping.border.accent),
      focus: resolve(mapping.border.focus),
    },
    action: {
      primary: {
        default: resolve(mapping.action.primary.default),
        hover: resolve(mapping.action.primary.hover),
        active: resolve(mapping.action.primary.active),
      },
      secondary: {
        default: resolve(mapping.action.secondary.default),
        hover: resolve(mapping.action.secondary.hover),
        active: resolve(mapping.action.secondary.active),
      },
      accent: {
        default: resolve(mapping.action.accent.default),
        hover: resolve(mapping.action.accent.hover),
        active: resolve(mapping.action.accent.active),
      },
    },
    feedback: {
      error: {
        bg: resolve(mapping.feedback.error.bg),
        text: resolve(mapping.feedback.error.text),
        border: resolve(mapping.feedback.error.border),
      },
      warning: {
        bg: resolve(mapping.feedback.warning.bg),
        text: resolve(mapping.feedback.warning.text),
        border: resolve(mapping.feedback.warning.border),
      },
      success: {
        bg: resolve(mapping.feedback.success.bg),
        text: resolve(mapping.feedback.success.text),
        border: resolve(mapping.feedback.success.border),
      },
      info: {
        bg: resolve(mapping.feedback.info.bg),
        text: resolve(mapping.feedback.info.text),
        border: resolve(mapping.feedback.info.border),
      },
    },
  };
}

/**
 * 기본 매핑 + 커스텀 오버라이드 병합 (1 depth shallow merge)
 * custom에서 제공한 카테고리(bg/text/border)만 덮어씀
 */
export function getMergedMapping(
  base: SemanticMapping,
  custom?: Partial<SemanticMapping> | null
): SemanticMapping {
  if (!custom) return base;

  return {
    bg: { ...base.bg, ...custom.bg },
    text: { ...base.text, ...custom.text },
    border: { ...base.border, ...custom.border },
    action: { ...base.action, ...custom.action },
    feedback: { ...base.feedback, ...custom.feedback },
  };
}

export type { SemanticTokenPath };
export type SemanticMappingValue = string | ScaleReference;

export function updateMappingAtPath(
  mapping: SemanticMapping,
  path: SemanticTokenPath,
  value: SemanticMappingValue
): SemanticMapping {
  const [cat, key] = path.split('.');
  const category = mapping[cat as keyof SemanticMapping];
  if (!category || typeof category !== 'object') return mapping;

  return {
    ...mapping,
    [cat]: { ...category, [key]: value },
  };
}
