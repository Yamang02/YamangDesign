import { describe, it, expect } from 'vitest';
import { flattenToCSSVars } from './css';

describe('flattenToCSSVars', () => {
  it('단일 depth 객체를 CSS 변수로 변환', () => {
    const result = flattenToCSSVars({ color: { bg: '#FFF' } });
    expect(result).toEqual({ '--ds-color-bg': '#FFF' });
  });

  it('중첩 객체를 하이픈으로 연결', () => {
    const result = flattenToCSSVars({ color: { bg: { base: '#FFF' } } });
    expect(result).toEqual({ '--ds-color-bg-base': '#FFF' });
  });

  it('camelCase를 kebab-case로 변환', () => {
    const result = flattenToCSSVars({
      color: { bg: { surfaceBrand: '#FFF' } },
    });
    expect(result).toEqual({ '--ds-color-bg-surface-brand': '#FFF' });
  });

  it('_ 접두사 키를 무시', () => {
    const result = flattenToCSSVars({
      color: { bg: '#FFF' },
      _meta: { derived: true },
    });
    expect(result).toEqual({ '--ds-color-bg': '#FFF' });
  });

  it('문자열이 아닌 값(숫자 등)은 건너뜀', () => {
    const result = flattenToCSSVars({
      spacing: { base: 8 as unknown as string },
      color: { bg: '#FFF' },
    });
    expect(result).toEqual({ '--ds-color-bg': '#FFF' });
  });

  it('빈 객체면 빈 결과', () => {
    expect(flattenToCSSVars({})).toEqual({});
  });

  it('여러 중첩 레벨을 올바르게 펼침', () => {
    const result = flattenToCSSVars({
      color: {
        bg: { base: '#FFF', subtle: '#F5F5F5' },
        text: { primary: '#000' },
      },
    });
    expect(result).toEqual({
      '--ds-color-bg-base': '#FFF',
      '--ds-color-bg-subtle': '#F5F5F5',
      '--ds-color-text-primary': '#000',
    });
  });
});
