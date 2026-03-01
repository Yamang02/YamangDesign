/**
 * Glassmorphism 스타일 - 반투명 글래스 효과
 * 부드러운 그림자, 얇은 테두리, 블러 배경과 조화
 */
import type { StyleDefinition } from '../types';

export const glassmorphismStyle: StyleDefinition = {
  name: 'glassmorphism',

  createShadows: () => ({
    none: 'none',
    sm: '0 4px 30px rgba(0, 0, 0, 0.1)',
    md: '0 8px 32px rgba(0, 0, 0, 0.15)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.2)',
    xl: '0 12px 40px rgba(0, 0, 0, 0.25)',
    inset: '0 2px 15px rgba(0, 0, 0, 0.1)',
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
    hover: 'background',
    active: 'background',
  },
};
