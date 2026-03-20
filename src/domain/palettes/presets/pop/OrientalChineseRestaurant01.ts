import type { PaletteDefinition } from '../../types';

export const orientalChineseRestaurant01Palette: PaletteDefinition = {
  id: 'oriental-chinese-restaurant-01',
  displayName: '오리엔탈 중화반점',
  category: 'pop', // 'default' | 'natural' | (ThemeCategory에 정의된 값)
  description: '요비요헤이_팔레트 오리엔탈 중화반점',
  subname: '오리엔탈 중화반점', // 사용자에게 보여줄 이름
  colors: {
    primary: '#E72D29', // 필수
    secondary: '#FFE329', // 선택
    accent: '#00A63C', // 선택
    sub: '#002C2B', // 선택, 컬러풀 보조색
  },
  bgStrategy: 'light', // 'light' | 'colored' | 'dark'
  contrast: 'normal', // 'normal' | 'high'

  semanticMapping: {
    bg: {
      base: { scale: 'secondary', step: 400 },
      subtle: { scale: 'secondary', step: 200 },
      surfaceLow: { scale: 'secondary', step: 400 },
      surface: { scale: 'secondary', step: 500 },
      surfaceHigh: { scale: 'secondary', step: 600 },
      surfaceBrand: { scale: 'secondary', step: 600 },
      elevated: { scale: 'secondary', step: 100 },
      muted: { scale: 'secondary', step: 900 },
    },
    text: {
      primary: { scale: 'primary', step: 900 },
      secondary: { scale: 'primary', step: 800 },
      muted: { scale: 'primary', step: 700 },
    },
    border: {
      default: { scale: 'primary', step: 700 },
      subtle: { scale: 'primary', step: 600 },
      focus: { scale: 'primary', step: 400 },
      accent: { scale: 'primary', step: 500 },
    },
  },
};
