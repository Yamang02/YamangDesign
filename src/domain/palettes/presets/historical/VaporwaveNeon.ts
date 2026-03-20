import type { PaletteDefinition } from '../../types';

export const vaporwaveNeonPalette: PaletteDefinition = {
  id: 'vaporwave-neon',
  displayName: 'Vaporwave Neon',
  category: 'historical',
  description: 'Vaporwave(2010s) 대표 배색',
  subname: 'Vaporwave',
  colors: {
    primary: '#FF71CE',
    secondary: '#B967FF',
    accent: '#01CDFE',
  },
  bgStrategy: 'dark',
  // Original neutral #1A1A2E was a very dark navy/indigo; 'slate' (cool blue-tinted dark) is the closest match.
  recommendedNeutral: 'slate',
  contrast: 'normal',
  recommendedForStyles: ['glassmorphism'],
};

