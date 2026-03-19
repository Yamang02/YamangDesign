import { describe, expect, it } from 'vitest';
import { createPalette } from './index';
import { colorMix } from '@shared/utils/color';
import type { PaletteDefinition } from './types';

function createDefinition(bgStrategy: PaletteDefinition['bgStrategy']): PaletteDefinition {
  return {
    id: `test-${bgStrategy}`,
    bgStrategy,
    colors: {
      primary: '#3B82F6',
      neutral: '#9CA3AF',
    },
  };
}

describe('createPalette surface hierarchy defaults', () => {
  it('light 전략에서 surfaceLow/surface/surfaceHigh를 tint 비율로 계산', () => {
    const palette = createPalette(createDefinition('light'));
    expect(palette.semantic.bg.surfaceLow).toBe(colorMix(palette.scales.neutral[50], palette.scales.primary[500], 0.03));
    expect(palette.semantic.bg.surface).toBe(colorMix(palette.scales.neutral[50], palette.scales.primary[500], 0.06));
    expect(palette.semantic.bg.surfaceHigh).toBe(colorMix(palette.scales.neutral[100], palette.scales.primary[500], 0.1));
  });

  it('dark 전략에서 어두운 축 기준으로 surface 계층을 계산', () => {
    const palette = createPalette(createDefinition('dark'));
    expect(palette.semantic.bg.surfaceLow).toBe(colorMix(palette.scales.neutral[800], palette.scales.primary[800], 0.05));
    expect(palette.semantic.bg.surface).toBe(colorMix(palette.scales.neutral[800], palette.scales.primary[800], 0.08));
    expect(palette.semantic.bg.surfaceHigh).toBe(colorMix(palette.scales.neutral[700], palette.scales.primary[700], 0.12));
  });
});
