import type { PaletteDefinition } from '../../types';

export const springCreamSoda01Palette: PaletteDefinition = {
  id: 'spring-cream-soda-01',
  displayName: '봄빛 크림소다',
  category: 'natural',
  description: '요비요헤이_팔레트 봄빛 크림소다',
  subname: '봄빛 크림소다',
  colors: {
    primary: '#E94E70',
    secondary: '#72333E',
    accent: '#C2D95C',
    sub: '#F7C9DD',
  },
  bgStrategy: 'light',
  // Original neutral #7F4A6F was a warm purple-toned hue; 'stone' (warm beige) is the closest neutral preset.
  recommendedNeutral: 'stone',
  contrast: 'normal',
};
