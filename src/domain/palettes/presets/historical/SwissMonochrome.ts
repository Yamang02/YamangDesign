import type { PaletteDefinition } from '../../types';

export const swissMonochromePalette: PaletteDefinition = {
  id: 'swiss-mono',
  displayName: 'Swiss Monochrome',
  category: 'historical',
  description: 'Swiss/International(1950s) 대표 배색',
  subname: 'Swiss/Int\'l',
  colors: {
    primary: '#E52320',
    secondary: '#333333',
    accent: '#FFFFFF',
  },
  bgStrategy: 'light',
  recommendedNeutral: 'gray',
  contrast: 'normal',
  recommendedForStyles: ['minimal', 'brutalism'],
};

