/**
 * 기본 배색 (AI_Portfolio 브랜드 그린 기반)
 */
import type { PaletteDefinition } from '../types';

export const defaultPalette: PaletteDefinition = {
  name: 'default',
  subname: 'YamangDesign 기본 배색',
  colors: {
    primary: '#5F9070',
    secondary: '#4F8060',
    accent: '#2F6040',
    sub: '#A8E6C7',
    neutral: '#6b7280',
  },
  bgStrategy: 'light',
  contrast: 'normal',
};
