import { describe, it, expect } from 'vitest';
import {
  resolveColorValue,
  resolveSemanticMapping,
  getMergedMapping,
  updateMappingAtPath,
} from './resolve';
import { getContrastRatio, ON_ACTION_HINT_MIN_CONTRAST } from '@shared/utils/color';
import { WCAG21_CONTRAST } from '@shared/utils/wcag-contrast';
import { generateColorScale } from '../palette';
import type { GeneratedScales } from '@shared/@types/tokens';
import type { SemanticMapping } from '../types';

function createTestScales(): GeneratedScales {
  return {
    primary: generateColorScale('#3366FF'),
    secondary: generateColorScale('#FF6633'),
    accent: generateColorScale('#33FF66'),
    neutral: generateColorScale('#888888'),
    sub: generateColorScale('#AACCFF'),
  };
}

function createTestMapping(): SemanticMapping {
  return {
    bg: {
      base: '#FFFFFF',
      subtle: { scale: 'neutral', step: 50 },
      surfaceLow: { scale: 'neutral', step: 50 },
      surface: { scale: 'neutral', step: 100 },
      surfaceHigh: { scale: 'neutral', step: 200 },
      surfaceBrand: { scale: 'primary', step: 100 },
      elevated: '#FFFFFF',
      muted: { scale: 'neutral', step: 200 },
    },
    text: {
      primary: { scale: 'neutral', step: 900 },
      secondary: { scale: 'neutral', step: 700 },
      muted: { scale: 'neutral', step: 500 },
      onActionPrimary: '#FFFFFF',
      onActionSecondary: '#FFFFFF',
      onActionAccent: '#FFFFFF',
    },
    border: {
      default: { scale: 'neutral', step: 300 },
      subtle: { scale: 'neutral', step: 200 },
      accent: { scale: 'primary', step: 500 },
      focus: { scale: 'primary', step: 400 },
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
      error: { bg: '#FEE2E2', text: '#DC2626', border: '#FECACA' },
      warning: { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' },
      success: { bg: '#D1FAE5', text: '#059669', border: '#A7F3D0' },
      info: { bg: '#DBEAFE', text: '#2563EB', border: '#BFDBFE' },
    },
  };
}

describe('resolveColorValue', () => {
  const scales = createTestScales();

  it('문자열 값은 그대로 반환', () => {
    expect(resolveColorValue('#FFFFFF', scales)).toBe('#FFFFFF');
    expect(resolveColorValue('red', scales)).toBe('red');
  });

  it('ScaleReference를 스케일에서 조회', () => {
    const result = resolveColorValue(
      { scale: 'primary', step: 500 },
      scales
    );
    expect(result).toBe(scales.primary[500]);
  });

  it('존재하지 않는 step이면 neutral-500 폴백', () => {
    const result = resolveColorValue(
      { scale: 'primary', step: 999 as never },
      scales
    );
    expect(result).toBe(scales.neutral[500]);
  });
});

describe('resolveSemanticMapping', () => {
  it('모든 시맨틱 토큰이 문자열로 해석됨', () => {
    const scales = createTestScales();
    const mapping = createTestMapping();
    const result = resolveSemanticMapping(mapping, scales);

    // bg
    expect(typeof result.bg.base).toBe('string');
    expect(typeof result.bg.subtle).toBe('string');
    expect(typeof result.bg.surfaceLow).toBe('string');
    expect(typeof result.bg.surface).toBe('string');
    expect(typeof result.bg.surfaceHigh).toBe('string');

    // text
    expect(typeof result.text.primary).toBe('string');
    expect(typeof result.text.onActionPrimary).toBe('string');
    expect(typeof result.text.onActionSecondary).toBe('string');
    expect(typeof result.text.onActionAccent).toBe('string');

    // border
    expect(typeof result.border.default).toBe('string');

    // action
    expect(typeof result.action.primary.default).toBe('string');

    // feedback
    expect(typeof result.feedback.error.bg).toBe('string');
  });

  it('직접 색상 값은 그대로 유지', () => {
    const scales = createTestScales();
    const mapping = createTestMapping();
    const result = resolveSemanticMapping(mapping, scales);

    expect(result.bg.base).toBe('#FFFFFF');
    expect(ON_ACTION_HINT_MIN_CONTRAST).toBe(WCAG21_CONTRAST.AA_LARGE_TEXT);
    // onAction: #FFFFFF 힌트가 AA_LARGE 기준 통과하면 흰색, 아니면 흰/검 폴백
    for (const [fg, bg] of [
      [result.text.onActionPrimary, result.action.primary.default],
      [result.text.onActionSecondary, result.action.secondary.default],
      [result.text.onActionAccent, result.action.accent.default],
    ] as const) {
      expect(getContrastRatio(fg, bg)).toBeGreaterThanOrEqual(
        WCAG21_CONTRAST.AA_LARGE_TEXT
      );
    }
  });

  it('primary 액션 onAction이 힌트 기준 대비 이상', () => {
    const scales = createTestScales();
    const mapping = createTestMapping();
    const result = resolveSemanticMapping(mapping, scales);
    expect(
      getContrastRatio(result.text.onActionPrimary, result.action.primary.default)
    ).toBeGreaterThanOrEqual(WCAG21_CONTRAST.AA_LARGE_TEXT);
  });

  it('밝은 accent 배경에는 검정 onAction 텍스트', () => {
    const scales = createTestScales();
    // accent = #33FF66 (밝은 연두) → 검정 텍스트
    const mapping = createTestMapping();
    const result = resolveSemanticMapping(mapping, scales);
    expect(result.text.onActionAccent).toBe('#000000');
  });

  it('ScaleReference는 실제 스케일 값으로 해석', () => {
    const scales = createTestScales();
    const mapping = createTestMapping();
    const result = resolveSemanticMapping(mapping, scales);

    expect(result.action.primary.default).toBe(scales.primary[500]);
    expect(result.bg.subtle).toBe(scales.neutral[50]);
    expect(result.bg.surfaceLow).toBe(scales.neutral[50]);
    expect(result.bg.surfaceHigh).toBe(scales.neutral[200]);
  });
});

describe('getMergedMapping', () => {
  it('custom이 없으면 base 그대로 반환', () => {
    const base = createTestMapping();
    expect(getMergedMapping(base)).toBe(base);
    expect(getMergedMapping(base, null)).toBe(base);
  });

  it('custom이 있으면 해당 카테고리만 오버라이드', () => {
    const base = createTestMapping();
    const custom = {
      bg: {
        base: '#000000',
        subtle: '#111111',
        surfaceLow: '#1A1A1A',
        surface: '#222222',
        surfaceHigh: '#2A2A2A',
        surfaceBrand: '#333333',
        elevated: '#444444',
        muted: '#555555',
      },
    };
    const merged = getMergedMapping(base, custom);

    expect(merged.bg.base).toBe('#000000');
    // text는 base 그대로
    expect(merged.text).toEqual(base.text);
  });
});

describe('updateMappingAtPath', () => {
  it('특정 경로의 값을 업데이트', () => {
    const mapping = createTestMapping();
    const updated = updateMappingAtPath(mapping, 'bg.base' as never, '#000000');
    expect(updated.bg.base).toBe('#000000');
  });

  it('원본 매핑은 변경되지 않음 (불변)', () => {
    const mapping = createTestMapping();
    const original = mapping.bg.base;
    updateMappingAtPath(mapping, 'bg.base' as never, '#000000');
    expect(mapping.bg.base).toBe(original);
  });

  it('ScaleReference로도 업데이트 가능', () => {
    const mapping = createTestMapping();
    const ref = { scale: 'accent' as const, step: 300 as const };
    const updated = updateMappingAtPath(mapping, 'bg.base' as never, ref);
    expect(updated.bg.base).toEqual(ref);
  });
});
