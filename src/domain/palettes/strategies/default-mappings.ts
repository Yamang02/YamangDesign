/**
 * P03: 배경 전략별 기본 시맨틱 매핑
 * 기존 light-bg, colored-bg, dark-bg 로직을 ScaleReference 형태로 이전
 */
import type { BgStrategy, SemanticMapping } from '../types';

/** light: 밝은 배경 (Minimal) */
const lightMapping: SemanticMapping = {
  bg: {
    base: '#FFFFFF',
    subtle: { scale: 'neutral', step: 50 },
    surfaceLow: { base: { scale: 'neutral', step: 50 }, mix: { scale: 'primary', step: 500 }, ratio: 0.03 },
    surface: { base: { scale: 'neutral', step: 50 }, mix: { scale: 'primary', step: 500 }, ratio: 0.06 },
    surfaceHigh: { base: { scale: 'neutral', step: 100 }, mix: { scale: 'primary', step: 500 }, ratio: 0.1 },
    surfaceBrand: { scale: 'primary', step: 50 },
    elevated: '#FFFFFF',
    muted: { scale: 'neutral', step: 100 },
  },
  text: {
    primary: { scale: 'neutral', step: 900 },
    secondary: { scale: 'neutral', step: 700 },
    muted: { scale: 'neutral', step: 500 },
    onAction: '#FFFFFF',
  },
  border: {
    default: { scale: 'neutral', step: 300 },
    subtle: { scale: 'neutral', step: 200 },
    accent: { scale: 'primary', step: 200 },
    focus: { scale: 'primary', step: 500 },
  },
  action: {
    primary: {
      default: { scale: 'primary', step: 500 },
      hover: { scale: 'primary', step: 600 },
      active: { scale: 'primary', step: 700 },
    },
    secondary: {
      default: { scale: 'secondary', step: 500 },
      hover: { scale: 'secondary', step: 600 },
      active: { scale: 'secondary', step: 700 },
    },
    accent: {
      default: { scale: 'accent', step: 500 },
      hover: { scale: 'accent', step: 600 },
      active: { scale: 'accent', step: 700 },
    },
  },
  feedback: {
    error: {
      bg: '#FEF2F2',
      text: '#B91C1C',
      border: '#EF4444',
    },
    warning: {
      bg: '#FFFBEB',
      text: '#B45309',
      border: '#F59E0B',
    },
    success: {
      bg: '#F0FDF4',
      text: '#15803D',
      border: '#22C55E',
    },
    info: {
      bg: '#EFF6FF',
      text: '#1D4ED8',
      border: '#3B82F6',
    },
  },
};

/** colored: 컬러 배경 (Neumorphism) */
const coloredMapping: SemanticMapping = {
  bg: {
    base: { scale: 'neutral', step: 100 },
    subtle: { scale: 'neutral', step: 50 },
    surfaceLow: { base: { scale: 'neutral', step: 100 }, mix: { scale: 'primary', step: 500 }, ratio: 0.05 },
    surface: { base: { scale: 'neutral', step: 50 }, mix: { scale: 'primary', step: 500 }, ratio: 0.1 },
    surfaceHigh: { base: { scale: 'neutral', step: 200 }, mix: { scale: 'primary', step: 500 }, ratio: 0.15 },
    surfaceBrand: { scale: 'primary', step: 50 },
    elevated: '#FFFFFF',
    muted: { scale: 'neutral', step: 200 },
  },
  text: {
    primary: { scale: 'neutral', step: 900 },
    secondary: { scale: 'neutral', step: 700 },
    muted: { scale: 'neutral', step: 600 },
    onAction: '#FFFFFF',
  },
  border: {
    default: { scale: 'neutral', step: 300 },
    subtle: { scale: 'neutral', step: 200 },
    accent: { scale: 'primary', step: 200 },
    focus: { scale: 'primary', step: 500 },
  },
  action: {
    primary: {
      default: { scale: 'primary', step: 500 },
      hover: { scale: 'primary', step: 600 },
      active: { scale: 'primary', step: 700 },
    },
    secondary: {
      default: { scale: 'secondary', step: 500 },
      hover: { scale: 'secondary', step: 600 },
      active: { scale: 'secondary', step: 700 },
    },
    accent: {
      default: { scale: 'accent', step: 500 },
      hover: { scale: 'accent', step: 600 },
      active: { scale: 'accent', step: 700 },
    },
  },
  feedback: {
    error: {
      bg: '#FEF2F2',
      text: '#B91C1C',
      border: '#EF4444',
    },
    warning: {
      bg: '#FFFBEB',
      text: '#B45309',
      border: '#F59E0B',
    },
    success: {
      bg: '#F0FDF4',
      text: '#15803D',
      border: '#22C55E',
    },
    info: {
      bg: '#EFF6FF',
      text: '#1D4ED8',
      border: '#3B82F6',
    },
  },
};

/** dark: 어두운 배경 (다크모드) */
const darkMapping: SemanticMapping = {
  bg: {
    base: { scale: 'neutral', step: 900 },
    subtle: { scale: 'neutral', step: 800 },
    surfaceLow: { base: { scale: 'neutral', step: 800 }, mix: { scale: 'primary', step: 800 }, ratio: 0.05 },
    surface: { base: { scale: 'neutral', step: 800 }, mix: { scale: 'primary', step: 800 }, ratio: 0.08 },
    surfaceHigh: { base: { scale: 'neutral', step: 700 }, mix: { scale: 'primary', step: 700 }, ratio: 0.12 },
    surfaceBrand: { scale: 'primary', step: 900 },
    elevated: { scale: 'neutral', step: 700 },
    muted: { scale: 'neutral', step: 800 },
  },
  text: {
    primary: { scale: 'neutral', step: 50 },
    secondary: { scale: 'neutral', step: 200 },
    muted: { scale: 'neutral', step: 400 },
    onAction: { scale: 'neutral', step: 900 },
  },
  border: {
    default: { scale: 'neutral', step: 600 },
    subtle: { scale: 'neutral', step: 700 },
    accent: { scale: 'primary', step: 400 },
    focus: { scale: 'primary', step: 400 },
  },
  action: {
    primary: {
      default: { scale: 'primary', step: 400 },
      hover: { scale: 'primary', step: 500 },
      active: { scale: 'primary', step: 600 },
    },
    secondary: {
      default: { scale: 'secondary', step: 400 },
      hover: { scale: 'secondary', step: 500 },
      active: { scale: 'secondary', step: 600 },
    },
    accent: {
      default: { scale: 'accent', step: 400 },
      hover: { scale: 'accent', step: 500 },
      active: { scale: 'accent', step: 600 },
    },
  },
  feedback: {
    error: {
      bg: '#450A0A',
      text: '#FCA5A5',
      border: '#F87171',
    },
    warning: {
      bg: '#451A03',
      text: '#FDE68A',
      border: '#FBBF24',
    },
    success: {
      bg: '#022C22',
      text: '#6EE7B7',
      border: '#34D399',
    },
    info: {
      bg: '#111827',
      text: '#BFDBFE',
      border: '#60A5FA',
    },
  },
};

export const defaultSemanticMappings: Record<BgStrategy, SemanticMapping> = {
  light: lightMapping,
  colored: coloredMapping,
  dark: darkMapping,
};
