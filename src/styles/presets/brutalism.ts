/**
 * Brutalism 스타일 - 거칠고 강렬한 비주얼
 * 굵은 테두리, 강한 대비, 날카로운 그림자
 */
import { darken } from '../../utils/color';
import type { StyleDefinition } from '../types';

export const brutalismStyle: StyleDefinition = {
  name: 'brutalism',

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
};
