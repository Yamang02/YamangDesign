/**
 * 컬러 배경 전략 (Neumorphism 방식)
 * E09: neutral 스케일로 배경/텍스트/테두리
 */
import type { GeneratedScales } from '../../@types/tokens';
import type { SemanticColors } from '../types';

export function applyColoredBgStrategy(scales: GeneratedScales): SemanticColors {
  return {
    bg: {
      base: scales.neutral[100],
      surface: scales.neutral[50],
      elevated: '#FFFFFF',
      muted: scales.neutral[200],
    },
    text: {
      primary: scales.neutral[900],
      secondary: scales.neutral[700],
      muted: scales.neutral[600],
      onAction: '#FFFFFF',
    },
    border: {
      default: scales.neutral[300],
      subtle: scales.neutral[200],
      focus: scales.primary[500],
    },
  };
}
