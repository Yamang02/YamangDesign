/**
 * E06 P02: Glassmorphism 스타일 — material 슬롯 실증
 * 배경 블러·투명도로 유리 효과
 */
import type { StyleDefinition } from '../types';

export const glassmorphismStyle: StyleDefinition = {
  name: 'glassmorphism',

  elevation: {
    create: () => ({
      0: 'none',
      1: '0 2px 8px rgba(0, 0, 0, 0.12)',
      2: '0 8px 20px rgba(0, 0, 0, 0.15)',
      3: '0 16px 32px rgba(0, 0, 0, 0.18)',
      4: '0 24px 48px rgba(0, 0, 0, 0.2)',
      inset: 'inset 0 1px 0 rgba(255, 255, 255, 0.4)',
    }),
  },

  stroke: {
    width: '1px',
    style: 'solid',
    colorStrategy: 'fixed',
    fixedColor: 'rgba(255, 255, 255, 0.25)',
  },

  material: {
    backdropFilter: 'blur(12px) saturate(1.5)',
    backgroundAlpha: 0.55,
    backgroundBlendMode: 'normal',
  },
};
