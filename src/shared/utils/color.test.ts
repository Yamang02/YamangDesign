import { describe, it, expect } from 'vitest';
import {
  normalizeHex,
  hexToRgb,
  hexToRgba,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  lighten,
  darken,
  adjustHue,
  desaturate,
  getLightness,
  colorMix,
  getRelativeLuminance,
  getContrastRatio,
  computeOnActionColor,
  ON_ACTION_HINT_MIN_CONTRAST,
} from './color';
import { WCAG21_CONTRAST } from './wcag-contrast';

describe('normalizeHex', () => {
  it('3자리 HEX를 6자리 대문자로 확장', () => {
    expect(normalizeHex('#abc')).toBe('#AABBCC');
    expect(normalizeHex('#fff')).toBe('#FFFFFF');
    expect(normalizeHex('#000')).toBe('#000000');
  });

  it('6자리 HEX를 대문자로 변환', () => {
    expect(normalizeHex('#aabbcc')).toBe('#AABBCC');
    expect(normalizeHex('#FF0000')).toBe('#FF0000');
  });
});

describe('hexToRgb', () => {
  it('HEX를 RGB 객체로 변환', () => {
    expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
    expect(hexToRgb('#00FF00')).toEqual({ r: 0, g: 255, b: 0 });
    expect(hexToRgb('#0000FF')).toEqual({ r: 0, g: 0, b: 255 });
    expect(hexToRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
  });

  it('# 없이도 동작', () => {
    expect(hexToRgb('FF0000')).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('잘못된 입력 시 { 0, 0, 0 } 반환', () => {
    expect(hexToRgb('invalid')).toEqual({ r: 0, g: 0, b: 0 });
  });
});

describe('hexToRgba', () => {
  it('HEX와 alpha를 rgba 문자열로 변환', () => {
    expect(hexToRgba('#FF0000', 0.5)).toBe('rgba(255, 0, 0, 0.5)');
    expect(hexToRgba('#000000', 1)).toBe('rgba(0, 0, 0, 1)');
  });
});

describe('rgbToHex', () => {
  it('RGB 값을 HEX 문자열로 변환', () => {
    expect(rgbToHex(255, 0, 0)).toBe('#FF0000');
    expect(rgbToHex(0, 255, 0)).toBe('#00FF00');
    expect(rgbToHex(0, 0, 255)).toBe('#0000FF');
    expect(rgbToHex(255, 255, 255)).toBe('#FFFFFF');
  });

  it('범위 밖 값을 클램핑', () => {
    expect(rgbToHex(300, -10, 128)).toBe('#FF0080');
  });
});

describe('rgbToHsl', () => {
  it('순수 빨강을 HSL로 변환', () => {
    const hsl = rgbToHsl(255, 0, 0);
    expect(hsl.h).toBeCloseTo(0);
    expect(hsl.s).toBeCloseTo(100);
    expect(hsl.l).toBeCloseTo(50);
  });

  it('순수 초록을 HSL로 변환', () => {
    const hsl = rgbToHsl(0, 255, 0);
    expect(hsl.h).toBeCloseTo(120);
    expect(hsl.s).toBeCloseTo(100);
    expect(hsl.l).toBeCloseTo(50);
  });

  it('순수 파랑을 HSL로 변환', () => {
    const hsl = rgbToHsl(0, 0, 255);
    expect(hsl.h).toBeCloseTo(240);
    expect(hsl.s).toBeCloseTo(100);
    expect(hsl.l).toBeCloseTo(50);
  });

  it('무채색(회색)은 s=0', () => {
    const hsl = rgbToHsl(128, 128, 128);
    expect(hsl.s).toBeCloseTo(0);
  });
});

describe('hslToRgb', () => {
  it('HSL을 RGB로 변환 (빨강)', () => {
    expect(hslToRgb(0, 100, 50)).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('HSL을 RGB로 변환 (초록)', () => {
    expect(hslToRgb(120, 100, 50)).toEqual({ r: 0, g: 255, b: 0 });
  });

  it('무채색 (s=0)이면 r=g=b', () => {
    const rgb = hslToRgb(0, 0, 50);
    expect(rgb.r).toBe(rgb.g);
    expect(rgb.g).toBe(rgb.b);
  });
});

describe('rgbToHsl ↔ hslToRgb 왕복', () => {
  it('변환 후 복원하면 원본과 동일', () => {
    const original = { r: 100, g: 150, b: 200 };
    const hsl = rgbToHsl(original.r, original.g, original.b);
    const restored = hslToRgb(hsl.h, hsl.s, hsl.l);
    expect(restored.r).toBeCloseTo(original.r, 0);
    expect(restored.g).toBeCloseTo(original.g, 0);
    expect(restored.b).toBeCloseTo(original.b, 0);
  });
});

describe('lighten', () => {
  it('색상을 밝게 한다', () => {
    const result = lighten('#FF0000', 20);
    const lightness = getLightness(result);
    expect(lightness).toBeGreaterThan(getLightness('#FF0000'));
  });

  it('100% 이상 밝아지지 않는다', () => {
    const result = lighten('#FF0000', 200);
    const lightness = getLightness(result);
    expect(lightness).toBeLessThanOrEqual(1);
  });
});

describe('darken', () => {
  it('색상을 어둡게 한다', () => {
    const result = darken('#FF0000', 20);
    const lightness = getLightness(result);
    expect(lightness).toBeLessThan(getLightness('#FF0000'));
  });

  it('0% 이하로 어두워지지 않는다', () => {
    const result = darken('#FF0000', 200);
    const lightness = getLightness(result);
    expect(lightness).toBeGreaterThanOrEqual(0);
  });
});

describe('adjustHue', () => {
  it('색상환 회전: 180도 → 보색', () => {
    const result = adjustHue('#FF0000', 180);
    const rgb = hexToRgb(result);
    // 빨강의 보색은 시안 계열
    expect(rgb.r).toBeLessThan(50);
    expect(rgb.g).toBeGreaterThan(200);
    expect(rgb.b).toBeGreaterThan(200);
  });

  it('360도 회전하면 원래 색으로 복귀', () => {
    const result = adjustHue('#FF0000', 360);
    expect(result).toBe('#FF0000');
  });

  it('음수 각도 처리', () => {
    const result = adjustHue('#FF0000', -120);
    // -120도 = 240도 = 파랑 계열
    const rgb = hexToRgb(result);
    expect(rgb.b).toBeGreaterThan(200);
  });
});

describe('desaturate', () => {
  it('채도를 낮추면 회색에 가까워진다', () => {
    const result = desaturate('#FF0000', 50);
    const rgb = hexToRgb(result);
    // r, g, b 차이가 줄어듦
    const diff = Math.max(rgb.r, rgb.g, rgb.b) - Math.min(rgb.r, rgb.g, rgb.b);
    const originalDiff = 255; // 순수 빨강의 max-min
    expect(diff).toBeLessThan(originalDiff);
  });

  it('100% 채도 제거하면 무채색', () => {
    const result = desaturate('#FF0000', 100);
    const rgb = hexToRgb(result);
    expect(rgb.r).toBe(rgb.g);
    expect(rgb.g).toBe(rgb.b);
  });
});

describe('getLightness', () => {
  it('흰색의 밝기는 1', () => {
    expect(getLightness('#FFFFFF')).toBeCloseTo(1);
  });

  it('검정의 밝기는 0', () => {
    expect(getLightness('#000000')).toBeCloseTo(0);
  });

  it('중간 회색의 밝기는 약 0.5', () => {
    const l = getLightness('#808080');
    expect(l).toBeGreaterThan(0.4);
    expect(l).toBeLessThan(0.6);
  });
});

describe('getRelativeLuminance', () => {
  it('흰색의 상대 휘도는 1', () => {
    expect(getRelativeLuminance('#FFFFFF')).toBeCloseTo(1.0);
  });

  it('검정의 상대 휘도는 0', () => {
    expect(getRelativeLuminance('#000000')).toBeCloseTo(0.0);
  });

  it('빨강은 0~1 사이', () => {
    const l = getRelativeLuminance('#FF0000');
    expect(l).toBeGreaterThan(0);
    expect(l).toBeLessThan(1);
  });
});

describe('getContrastRatio', () => {
  it('흰색과 검정의 대비는 21', () => {
    expect(getContrastRatio('#FFFFFF', '#000000')).toBeCloseTo(21, 0);
  });

  it('동일 색상의 대비는 1', () => {
    expect(getContrastRatio('#FF0000', '#FF0000')).toBeCloseTo(1, 5);
  });

  it('순서를 바꿔도 동일한 결과', () => {
    const r1 = getContrastRatio('#FFFFFF', '#123456');
    const r2 = getContrastRatio('#123456', '#FFFFFF');
    expect(r1).toBeCloseTo(r2, 5);
  });
});

describe('computeOnActionColor', () => {
  it('액션 힌트 기준은 WCAG21 AA_LARGE_TEXT와 동일', () => {
    expect(ON_ACTION_HINT_MIN_CONTRAST).toBe(WCAG21_CONTRAST.AA_LARGE_TEXT);
  });

  it('밝은 배경(노랑)에는 검정 반환', () => {
    expect(computeOnActionColor('#FFD700')).toBe('#000000');
  });

  it('어두운 배경(네이비)에는 흰색 반환', () => {
    expect(computeOnActionColor('#1A3C8F')).toBe('#FFFFFF');
  });

  it('hint가 AA_LARGE_TEXT 이상이면 hint 반환', () => {
    expect(computeOnActionColor('#1A3C8F', '#FFFFFF')).toBe('#FFFFFF');
    // 중간 채도 프라이머리: AA_NORMAL 미달이지만 AA_LARGE 이상 → 흰 유지
    expect(computeOnActionColor('#E94E70', '#FFFFFF')).toBe('#FFFFFF');
  });

  it('hint가 AA_LARGE_TEXT 미만이면 자동 계산으로 폴백', () => {
    // 노랑 위에 흰 hint → 대비 부족 → 검정으로 폴백
    expect(computeOnActionColor('#FFD700', '#FFFFFF')).toBe('#000000');
  });
});

describe('colorMix', () => {
  it('ratio=0이면 base를 반환', () => {
    expect(colorMix('#112233', '#AABBCC', 0)).toBe('#112233');
  });

  it('ratio=1이면 mix를 반환', () => {
    expect(colorMix('#112233', '#AABBCC', 1)).toBe('#AABBCC');
  });

  it('중간 비율은 채널별 선형 보간', () => {
    expect(colorMix('#000000', '#FFFFFF', 0.5)).toBe('#808080');
  });

  it('3자리 hex와 범위 밖 ratio를 안전 처리', () => {
    expect(colorMix('#ABC', '#000000', -1)).toBe('#AABBCC');
    expect(colorMix('#000000', '#ABC', 2)).toBe('#AABBCC');
  });
});
