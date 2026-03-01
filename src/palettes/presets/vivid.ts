/**
 * 고채도 배색
 */
import type { PaletteDefinition } from '../types';

export const vividPalette: PaletteDefinition = {
  name: 'vivid',
  subname: '고채도 대비 강조 배색',
  colors: {
    primary: '#6366F1',
    secondary: '#EC4899',
    accent: '#F59E0B',
    neutral: '#1F2937',
  },
  bgStrategy: 'light',
  contrast: 'high',
};
