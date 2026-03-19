/**
 * Brutalism 스타일 - 거칠고 강렬한 비주얼
 * 굵은 테두리, 강한 대비, 날카로운 그림자
 */
import { darken } from '@shared/utils/color';
import type { StyleDefinition } from '../types';
import { easing } from '@domain/tokens/global';

export const brutalismStyle: StyleDefinition = {
  name: 'brutalism',
  metadata: {
    era: '2010s-',
    origin: 'web design',
    characteristics: ['raw aesthetic', 'high contrast', 'bold borders'],
    description: 'raw aesthetic, high contrast, bold borders',
  },

  elevation: {
    create: ({ bgColor }) => {
      const dark = darken(bgColor, 25);
      return {
        0: 'none',
        1: `4px 4px 0 ${dark}`,
        2: `6px 6px 0 ${dark}`,
        3: `8px 8px 0 ${dark}`,
        4: `12px 12px 0 ${dark}`,
        inset: `inset 2px 2px 0 ${dark}`,
      };
    },
  },

  stroke: {
    width: '3px',
    style: 'solid',
    colorStrategy: 'palette',
  },
  createVars: () => ({
    // Radius (P01)
    '--ds-radius-sm': '0px',
    '--ds-radius-md': '0px',
    '--ds-radius-lg': '0px',
    '--ds-radius-xl': '0px',
    '--ds-radius-full': '0px',

    // Motion (P01)
    '--ds-duration-instant': '0ms',
    '--ds-duration-fast': '0ms',
    '--ds-duration-normal': '50ms',
    '--ds-duration-slow': '100ms',

    '--ds-ease-easeOut': easing.linear,
    '--ds-ease-easeInOut': easing.linear,
    '--ds-ease-productive': easing.linear,
  }),
};
