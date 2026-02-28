/**
 * Neumorphism 스타일 - 양각/음각 그림자
 * 배경색에 종속된 그림자 (createShadows에 bgColor 전달)
 */
import { lighten, darken } from '../../utils/color';
import type { StyleDefinition } from '../types';

export const neumorphismStyle: StyleDefinition = {
  name: 'neumorphism',

  createShadows: (bgColor: string) => {
    const light = lighten(bgColor, 15);
    const dark = darken(bgColor, 15);
    return {
      none: 'none',
      sm: `3px 3px 6px ${dark}, -3px -3px 6px ${light}`,
      md: `6px 6px 12px ${dark}, -6px -6px 12px ${light}`,
      lg: `10px 10px 20px ${dark}, -10px -10px 20px ${light}`,
      xl: `15px 15px 30px ${dark}, -15px -15px 30px ${light}`,
      inset: `inset 4px 4px 8px ${dark}, inset -4px -4px 8px ${light}`,
    };
  },

  border: {
    width: '0px',
    style: 'none',
    useColor: false,
  },

  surface: {
    default: 'raised',
    interactive: 'raised',
    active: 'inset',
  },

  states: {
    hover: 'shadow',
    active: 'shadow',
  },
};
