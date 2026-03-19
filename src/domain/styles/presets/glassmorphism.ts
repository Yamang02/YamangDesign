/**
 * E06 P02: Glassmorphism 스타일 — material 슬롯 실증
 * 배경 블러·투명도로 유리 효과
 */
import type { StyleDefinition } from '../types';
import { easing } from '@domain/tokens/global';

export const glassmorphismStyle: StyleDefinition = {
  name: 'glassmorphism',
  metadata: {
    era: '2020-',
    origin: 'UI trend',
    characteristics: ['frosted glass', 'transparency', 'layered depth'],
    description: 'frosted glass, transparency, layered depth',
  },
  preferredBgStrategies: ['dark', 'colored'],
  incompatibleBgStrategies: ['light'],

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
  createVars: () => ({
    // Radius (P01)
    '--ds-radius-sm': '8px',
    '--ds-radius-md': '16px',
    '--ds-radius-lg': '20px',
    '--ds-radius-xl': '24px',
    '--ds-radius-full': '9999px',

    // Motion (P01)
    '--ds-duration-instant': '0ms',
    '--ds-duration-fast': '150ms',
    '--ds-duration-normal': '250ms',
    '--ds-duration-slow': '400ms',

    '--ds-ease-easeOut': easing.expressive,
    '--ds-ease-easeInOut': easing.expressive,
    '--ds-ease-productive': easing.expressive,
  }),
};
