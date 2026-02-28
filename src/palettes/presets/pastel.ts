/**
 * 파스텔 배색
 */
import type { PaletteDefinition } from '../types';

export const pastelPalette: PaletteDefinition = {
  name: 'pastel',
  colors: {
    primary: '#A5B4FC',
    secondary: '#FBCFE8',
    accent: '#FDE68A',
    neutral: '#F3F4F6',
  },
  bgStrategy: 'colored',
  contrast: 'normal',
};
