/**
 * Neumorphism 스타일 - 양각/음각 그림자
 * 배경색에 종속된 그림자 (elevation.create에 bgColor 전달)
 */
import { lighten, darken } from '@shared/utils/color';
import type { StyleDefinition } from '../types';
import { easing } from '@domain/tokens/global';

export const neumorphismStyle: StyleDefinition = {
  name: 'neumorphism',
  metadata: {
    era: '2019-',
    origin: 'UI concept',
    characteristics: ['soft extrusion', 'monochrome surfaces', 'tactile depth'],
    description: 'soft extrusion, monochrome surfaces, tactile depth',
  },
  preferredBgStrategies: ['colored'],

  elevation: {
    create: ({ bgColor }) => {
      const light = lighten(bgColor, 15);
      const dark = darken(bgColor, 15);
      return {
        0: 'none',
        1: `3px 3px 6px ${dark}, -3px -3px 6px ${light}`,
        2: `6px 6px 12px ${dark}, -6px -6px 12px ${light}`,
        3: `10px 10px 20px ${dark}, -10px -10px 20px ${light}`,
        4: `15px 15px 30px ${dark}, -15px -15px 30px ${light}`,
        inset: `inset 4px 4px 8px ${dark}, inset -4px -4px 8px ${light}`,
      };
    },
  },

  stroke: {
    width: '0px',
    style: 'none',
    colorStrategy: 'transparent',
  },
  createVars: () => ({
    // Radius (P01)
    '--ds-radius-sm': '8px',
    '--ds-radius-md': '12px',
    '--ds-radius-lg': '16px',
    '--ds-radius-xl': '20px',
    '--ds-radius-full': '9999px',

    // Motion (P01)
    '--ds-duration-instant': '0ms',
    '--ds-duration-fast': '200ms',
    '--ds-duration-normal': '350ms',
    '--ds-duration-slow': '500ms',

    '--ds-ease-easeOut': easing.easeInOut,
    '--ds-ease-easeInOut': easing.easeInOut,
    '--ds-ease-productive': easing.easeInOut,
  }),
};
