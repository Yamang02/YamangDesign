/**
 * P03: 배경 전략별 기본 시맨틱 매핑
 * 기존 light-bg, colored-bg, dark-bg 로직을 ScaleReference 형태로 이전
 */
import type { BgStrategy, SemanticMapping } from '../types';

/** light: 밝은 배경 (Minimal) */
const lightMapping: SemanticMapping = {
  bg: {
    base: '#FFFFFF',
    surface: { scale: 'neutral', step: 50 },
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
};

/** colored: 컬러 배경 (Neumorphism) */
const coloredMapping: SemanticMapping = {
  bg: {
    base: { scale: 'neutral', step: 100 },
    surface: { scale: 'neutral', step: 50 },
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
};

/** dark: 어두운 배경 (다크모드) */
const darkMapping: SemanticMapping = {
  bg: {
    base: { scale: 'neutral', step: 900 },
    surface: { scale: 'neutral', step: 800 },
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
};

export const defaultSemanticMappings: Record<BgStrategy, SemanticMapping> = {
  light: lightMapping,
  colored: coloredMapping,
  dark: darkMapping,
};
