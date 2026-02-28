/**
 * 기본 배색 (기존 동작 유지)
 */
import type { PaletteDefinition } from '../types';

export const defaultPalette: PaletteDefinition = {
  name: 'default',
  colors: {
    primary: '#6366F1',
    secondary: '#8B5CF6',
    accent: '#F59E0B',
    neutral: '#E5E7EB',
  },
  bgStrategy: 'light',
  contrast: 'normal',
};
