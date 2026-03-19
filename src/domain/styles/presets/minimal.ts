/**
 * Minimal 스타일 - 깔끔한 플랫 디자인
 * 가벼운 drop shadow, 명확한 border
 */
import type { StyleDefinition } from '../types';
import { easing } from '@domain/tokens/global';

export const minimalStyle: StyleDefinition = {
  name: 'minimal',
  metadata: {
    era: '2010s',
    origin: 'digital product design',
    characteristics: ['flat surfaces', 'subtle shadows', 'clean lines'],
    description: 'flat surfaces, subtle shadows, clean lines',
  },

  elevation: {
    create: () => ({
      0: 'none',
      1: '0 1px 2px rgba(0, 0, 0, 0.05)',
      2: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      3: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      4: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      inset: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
    }),
  },

  stroke: {
    width: '1px',
    style: 'solid',
    colorStrategy: 'palette',
  },
  createVars: () => ({
    // Radius (P01)
    '--ds-radius-sm': '4px',
    '--ds-radius-md': '8px',
    '--ds-radius-lg': '12px',
    '--ds-radius-xl': '16px',
    '--ds-radius-full': '9999px',

    // Motion (P01)
    '--ds-duration-instant': '0ms',
    '--ds-duration-fast': '100ms',
    '--ds-duration-normal': '200ms',
    '--ds-duration-slow': '300ms',
    '--ds-ease-easeOut': easing.easeOut,
    '--ds-ease-easeInOut': easing.easeOut,
    '--ds-ease-productive': easing.easeOut,
  }),
};
