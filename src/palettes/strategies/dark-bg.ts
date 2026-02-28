/**
 * 어두운 배경 전략 (다크모드용)
 */
import type { GeneratedScales } from '../../@types/tokens';
import type { SemanticColors } from '../types';

export function applyDarkBgStrategy(scales: GeneratedScales): SemanticColors {
  return {
    bg: {
      base: scales.sub[900],
      surface: scales.sub[800],
      elevated: scales.sub[700],
      muted: scales.sub[800],
    },
    text: {
      primary: scales.sub[50],
      secondary: scales.sub[200],
      muted: scales.sub[400],
      onAction: scales.sub[900],
    },
    border: {
      default: scales.sub[600],
      subtle: scales.sub[700],
      focus: scales.primary[400],
    },
  };
}
