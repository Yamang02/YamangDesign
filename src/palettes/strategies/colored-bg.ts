/**
 * 컬러 배경 전략 (현재 Neumorphism 방식)
 * 연한 sub 컬러를 배경으로 사용
 */
import type { GeneratedScales } from '../../@types/tokens';
import type { SemanticColors } from '../types';

export function applyColoredBgStrategy(scales: GeneratedScales): SemanticColors {
  return {
    bg: {
      base: scales.sub[100],
      surface: scales.sub[50],
      elevated: '#FFFFFF',
      muted: scales.sub[200],
    },
    text: {
      primary: scales.sub[900],
      secondary: scales.sub[700],
      muted: scales.sub[600],
      onAction: '#FFFFFF',
    },
    border: {
      default: scales.sub[300],
      subtle: scales.sub[200],
      focus: scales.primary[500],
    },
  };
}
