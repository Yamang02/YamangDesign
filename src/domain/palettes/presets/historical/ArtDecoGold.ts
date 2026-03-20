import type { PaletteDefinition } from '../../types';

export const artDecoGoldPalette: PaletteDefinition = {
  id: 'art-deco-gold',
  displayName: 'Art Deco Gold',
  category: 'historical',
  description: 'Art Deco (1920-30s) 대표 배색',
  subname: 'Art Deco',
  colors: {
    primary: '#C5A55A',
    secondary: '#1B1B1B',
    accent: '#2A6B5E',
  },
  bgStrategy: 'light',
  // Original neutral #F5F0E1 was a warm cream/off-white; 'stone' (warm beige tone) is the closest match.
  recommendedNeutral: 'stone',
  contrast: 'normal',
  recommendedForStyles: ['minimal'],
};

