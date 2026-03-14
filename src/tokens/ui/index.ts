/**
 * E04: 앱 셸 토큰 (--shell-* 네임스페이스와 대응)
 * 테마 전환 영향 없이 고정 (헤더, 설정패널, Lab 크롬 등)
 */
import type { UITokens } from './types';

export const uiTokens: UITokens = {
  colors: {
    bg: {
      base: '#1a1a1a',
      surface: '#2d2d2d',
      elevated: '#3d3d3d',
    },
    text: {
      primary: '#ffffff',
      secondary: '#a0a0a0',
      muted: '#666666',
    },
    border: {
      default: '#404040',
      subtle: '#333333',
    },
    action: {
      primary: '#6366f1',
      hover: '#818cf8',
    },
    focus: {
      ring: '#6366f1',
    },
  },
} as const;

export type { UITokenColors, UITokens } from './types';
