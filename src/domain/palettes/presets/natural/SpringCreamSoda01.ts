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
    neutral: '#7F4A6F',
  },
  bgStrategy: 'light',
  contrast: 'normal',
  semanticMapping: {
    text: {
      onActionPrimary: '#FFFFFF',
      onActionPolicy: 'forceHint',
    },
  },
};
