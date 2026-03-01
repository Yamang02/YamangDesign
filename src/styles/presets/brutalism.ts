/**
 * Brutalism 스타일 - 거칠고 강렬한 비주얼
 * 굵은 테두리, 강한 대비, 날카로운 그림자
 */
import { darken } from '../../utils/color';
import type { StyleDefinition } from '../types';

export const brutalismStyle: StyleDefinition = {
  name: 'brutalism',

  createShadows: (bgColor: string) => {
    const dark = darken(bgColor, 25);
    return {
      none: 'none',
      sm: `4px 4px 0 ${dark}`,
      md: `6px 6px 0 ${dark}`,
      lg: `8px 8px 0 ${dark}`,
      xl: `12px 12px 0 ${dark}`,
      inset: `inset 2px 2px 0 ${dark}`,
    };
  },

  border: {
    width: '3px',
    style: 'solid',
    useColor: true,
  },

  surface: {
    default: 'flat',
    interactive: 'flat',
    active: 'flat',
  },

  states: {
    hover: 'border',
    active: 'shadow',
  },
};
