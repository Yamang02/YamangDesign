import type { PaletteDefinition } from '../../types';

export const memphisPopPalette: PaletteDefinition = {
  id: 'memphis-pop',
  displayName: 'Memphis Pop',
  category: 'historical',
  description: 'Memphis(1980s) 대표 배색',
  subname: 'Memphis',
  colors: {
    primary: '#FF6F61',
    secondary: '#FFD700',
    accent: '#00CED1',
    neutral: '#2C2C54',
  },
  bgStrategy: 'light',
  contrast: 'normal',
  recommendedForStyles: ['brutalism'],
};

