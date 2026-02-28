/**
 * 밝은 배경 전략 (현재 Minimal 방식)
 * 흰색 배경, sub 스케일로 surface/muted
 */
import type { GeneratedScales } from '../../@types/tokens';
import type { SemanticColors } from '../types';

export function applyLightBgStrategy(scales: GeneratedScales): SemanticColors {
  return {
    bg: {
      base: '#FFFFFF',
      surface: scales.sub[100],
      elevated: '#FFFFFF',
      muted: scales.sub[200],
    },
    text: {
      primary: scales.sub[900],
      secondary: scales.sub[700],
      muted: scales.sub[500],
      onAction: '#FFFFFF',
    },
    border: {
      default: scales.sub[300],
      subtle: scales.sub[200],
      focus: scales.primary[500],
    },
  };
}
