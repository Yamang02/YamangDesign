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
    neutral: '#1A1A1A',
  },
  bgStrategy: 'light',
  contrast: 'normal',
  recommendedForStyles: ['minimal', 'brutalism'],
};

