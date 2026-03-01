/**
 * 어두운 배경 전략 (다크모드용)
 * E09: neutral 스케일
 */
import type { GeneratedScales } from '../../@types/tokens';
import type { SemanticColors } from '../types';

export function applyDarkBgStrategy(scales: GeneratedScales): SemanticColors {
  return {
    bg: {
      base: scales.neutral[900],
      surface: scales.neutral[800],
      surfaceBrand: scales.primary[900],
      elevated: scales.neutral[700],
      muted: scales.neutral[800],
    },
    text: {
      primary: scales.neutral[50],
      secondary: scales.neutral[200],
      muted: scales.neutral[400],
      onAction: scales.neutral[900],
    },
    border: {
      default: scales.neutral[600],
      subtle: scales.neutral[700],
      accent: scales.primary[400],
      focus: scales.primary[400],
    },
  };
}
