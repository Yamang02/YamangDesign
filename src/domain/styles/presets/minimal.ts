/**
 * Minimal 스타일 - 깔끔한 플랫 디자인
 * 가벼운 drop shadow, 명확한 border
 */
import type { StyleDefinition } from '../types';

export const minimalStyle: StyleDefinition = {
  name: 'minimal',

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
};
