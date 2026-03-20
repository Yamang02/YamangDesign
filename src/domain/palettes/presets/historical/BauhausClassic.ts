import type { PaletteDefinition } from '../../types';

export const bauhausClassicPalette: PaletteDefinition = {
  id: 'bauhaus-classic',
  displayName: 'Bauhaus Classic',
  category: 'historical',
  description: 'Bauhaus (1919-33) 대표 배색',
  subname: 'Bauhaus',
  colors: {
    primary: '#E63329',
    secondary: '#F5C518',
    accent: '#1A3C8F',
  },
  bgStrategy: 'light',
  contrast: 'normal',
  recommendedForStyles: ['minimal', 'brutalism'],
};

