/**
 * Minimal 스타일 - 깔끔한 플랫 디자인
 * 가벼운 drop shadow, 명확한 border
 */
import type { StyleDefinition } from '../types';

export const minimalStyle: StyleDefinition = {
  name: 'minimal',

  createShadows: () => ({
    none: 'none',
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    inset: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
  }),

  border: {
    width: '1px',
    style: 'solid',
    useColor: true,
  },

  surface: {
    default: 'flat',
    interactive: 'flat',
    active: 'flat',
  },

  states: {
    hover: 'shadow',
    active: 'background',
  },
};
