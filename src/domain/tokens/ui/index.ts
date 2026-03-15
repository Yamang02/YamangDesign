/**
 * E04: 앱 셸 토큰 (--shell-* 네임스페이스와 대응)
 * 테마 전환 영향 없이 고정 (헤더, 설정패널, Lab 크롬 등)
 */
import type { UITokens } from './types';

export const uiTokens: UITokens = {
  colors: {
    bg: {
      base: '#1A1A1A',
      surface: '#2D2D2D',
      elevated: '#3D3D3D',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#A0A0A0',
      muted: '#666666',
    },
    border: {
      default: '#404040',
      subtle: '#333333',
    },
    action: {
      primary: '#6366F1',
      hover: '#818CF8',
    },
    focus: {
      ring: '#6366F1',
    },
  },
} as const;

export type { UITokenColors, UITokens } from './types';
