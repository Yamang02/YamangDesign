/**
 * 밝은 배경 전략 (Minimal 방식)
 * E09: neutral 스케일로 surface/muted/text/border
 */
import type { GeneratedScales } from '../../@types/tokens';
import type { SemanticColors } from '../types';

export function applyLightBgStrategy(scales: GeneratedScales): SemanticColors {
  return {
    bg: {
      base: '#FFFFFF',
      surface: scales.neutral[50],
      surfaceBrand: scales.primary[50],
      elevated: '#FFFFFF',
      muted: scales.neutral[100],
    },
    text: {
      primary: scales.neutral[900],
      secondary: scales.neutral[700],
      muted: scales.neutral[500],
      onAction: '#FFFFFF',
    },
    border: {
      default: scales.neutral[300],
      subtle: scales.neutral[200],
      accent: scales.primary[200],
      focus: scales.primary[500],
    },
  };
}
