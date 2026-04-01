import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { flattenToCSSVars, injectCSSVariables, removeCSSVariables } from './css';

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

describe('injectCSSVariables / removeCSSVariables', () => {
  const setProperty = vi.fn();
  const removeProperty = vi.fn();

  beforeEach(() => {
    setProperty.mockClear();
    removeProperty.mockClear();
    vi.stubGlobal(
      'document',
      {
        documentElement: {
          style: { setProperty, removeProperty },
        },
      } as unknown as Document
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('injectCSSVariables가 :root style에 변수를 설정한다', () => {
    injectCSSVariables({ '--ds-color-bg': '#fff', '--ds-spacing': '8px' });
    expect(setProperty).toHaveBeenCalledWith('--ds-color-bg', '#fff');
    expect(setProperty).toHaveBeenCalledWith('--ds-spacing', '8px');
  });

  it('removeCSSVariables가 지정한 변수를 제거한다', () => {
    removeCSSVariables(['--a', '--b']);
    expect(removeProperty).toHaveBeenCalledWith('--a');
    expect(removeProperty).toHaveBeenCalledWith('--b');
  });
});
