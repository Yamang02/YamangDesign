import { describe, it, expect } from 'vitest';
import {
  formatStructuredDisplay,
  parseBoxShadow,
  parseBoxShadowLayer,
  formatBoxShadow,
} from './css-structured';

describe('parseBoxShadowLayer', () => {
  it('기본 box-shadow 레이어를 파싱', () => {
    const result = parseBoxShadowLayer('2px 4px 6px 0px rgba(0,0,0,0.1)');
    expect(result).toEqual({
      x: '2px',
      y: '4px',
      blur: '6px',
      spread: '0px',
      color: 'rgba(0,0,0,0.1)',
      inset: undefined,
    });
  });

  it('inset shadow 파싱', () => {
    const result = parseBoxShadowLayer('inset 1px 2px 3px #000');
    expect(result).not.toBeNull();
    expect(result!.inset).toBe(true);
    expect(result!.x).toBe('1px');
  });

  it('blur/spread 생략 시 기본값', () => {
    const result = parseBoxShadowLayer('2px 4px #000');
    expect(result).not.toBeNull();
    expect(result!.blur).toBe('0');
    expect(result!.spread).toBe('0');
  });

  it('빈 문자열이면 null', () => {
    expect(parseBoxShadowLayer('')).toBeNull();
  });
});

describe('parseBoxShadow', () => {
  it('"none"이면 빈 배열', () => {
    expect(parseBoxShadow('none')).toEqual([]);
  });

  it('단일 레이어 파싱', () => {
    const result = parseBoxShadow('2px 4px 6px rgba(0,0,0,0.1)');
    expect(result).toHaveLength(1);
    expect(result[0].x).toBe('2px');
  });

  it('다중 레이어 파싱 (콤마 구분)', () => {
    const result = parseBoxShadow(
      '2px 4px 6px rgba(0,0,0,0.1), inset 0 0 4px #000'
    );
    expect(result).toHaveLength(2);
    expect(result[1].inset).toBe(true);
  });
});

describe('formatBoxShadow', () => {
  it('레이어를 CSS 문자열로 직렬화', () => {
    const result = formatBoxShadow([
      { x: '2px', y: '4px', blur: '6px', spread: '0px', color: '#000' },
    ]);
    expect(result).toBe('2px 4px 6px 0px #000');
  });

  it('inset 포함', () => {
    const result = formatBoxShadow([
      {
        x: '0',
        y: '0',
        blur: '4px',
        spread: '0',
        color: '#000',
        inset: true,
      },
    ]);
    expect(result).toContain('inset');
  });

  it('빈 배열이면 "none"', () => {
    expect(formatBoxShadow([])).toBe('none');
  });

  it('다중 레이어를 콤마로 연결', () => {
    const result = formatBoxShadow([
      { x: '1px', y: '2px', blur: '3px', spread: '0', color: '#000' },
      { x: '4px', y: '5px', blur: '6px', spread: '0', color: '#FFF' },
    ]);
    expect(result).toContain(', ');
  });
});

describe('formatStructuredDisplay', () => {
  it('shadow 토큰에 대해 구조화 표기 반환', () => {
    const result = formatStructuredDisplay(
      'elevation-shadow-md',
      '2px 4px 6px 0px rgba(0,0,0,0.1)'
    );
    expect(result).toContain('X: 2px');
    expect(result).toContain('Y: 4px');
    expect(result).toContain('Blur: 6px');
  });

  it('border 토큰에 대해 구조화 표기 반환', () => {
    const result = formatStructuredDisplay(
      'border-default',
      '1px solid #CCC'
    );
    expect(result).toContain('Width: 1px');
    expect(result).toContain('Style: solid');
    expect(result).toContain('Color: #CCC');
  });

  it('transition 토큰에 대해 구조화 표기 반환', () => {
    const result = formatStructuredDisplay(
      'transition-base',
      'all 200ms ease 0s'
    );
    expect(result).toContain('Property: all');
    expect(result).toContain('Duration: 200ms');
  });

  it('매칭되지 않는 토큰은 원본 반환', () => {
    const result = formatStructuredDisplay('color-primary', '#FF0000');
    expect(result).toBe('#FF0000');
  });

  it('"(not set)" 값은 그대로 반환', () => {
    expect(formatStructuredDisplay('shadow-md', '(not set)')).toBe(
      '(not set)'
    );
  });
});
