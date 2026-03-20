import { WCAG21_CONTRAST } from './wcag-contrast';

/**
 * HEX 값을 6자리 대문자로 정규화 (#abc → #AABBCC)
 */
export function normalizeHex(value: string): string {
  if (/^#[A-Fa-f0-9]{3}$/.test(value)) {
    const r = value[1];
    const g = value[2];
    const b = value[3];
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  return value.toUpperCase();
}

/**
 * HEX를 RGB로 변환
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return { r: 0, g: 0, b: 0 };
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * HEX를 rgba 문자열로 변환
 */
export function hexToRgba(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * RGB를 HEX로 변환
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return normalizeHex(`#${toHex(r)}${toHex(g)}${toHex(b)}`);
}

/**
 * RGB를 HSL로 변환
 */
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * HSL를 RGB로 변환
 */
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * 색상 밝게 (0-100%)
 */
export function lighten(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.l = Math.min(100, hsl.l + amount);
  const result = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(result.r, result.g, result.b);
}

/**
 * 색상 어둡게 (0-100%)
 */
export function darken(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.l = Math.max(0, hsl.l - amount);
  const result = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(result.r, result.g, result.b);
}

/**
 * 색상환 회전 (색상 조정)
 */
export function adjustHue(hex: string, degrees: number): string {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.h = (hsl.h + degrees + 360) % 360;
  const result = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(result.r, result.g, result.b);
}

/**
 * 채도 낮추기 (0-100%)
 */
export function desaturate(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.s = Math.max(0, hsl.s - amount);
  const result = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(result.r, result.g, result.b);
}

/**
 * 밝기 가져오기 (0-1)
 */
export function getLightness(hex: string): number {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return hsl.l / 100;
}

/**
 * WCAG 2.1 상대 휘도 (relative luminance, 0~1)
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
export function getRelativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const linearize = (c: number): number => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/**
 * WCAG 2.1 대비 비율 (contrast ratio, 1~21)
 */
export function getContrastRatio(fg: string, bg: string): number {
  const l1 = getRelativeLuminance(fg);
  const l2 = getRelativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * 액션 힌트 채택 최소 대비 (= `WCAG21_CONTRAST.AA_LARGE_TEXT`).
 * 본문 등에는 `WCAG21_CONTRAST.AA_NORMAL_TEXT`(4.5) 사용.
 */
export const ON_ACTION_HINT_MIN_CONTRAST = WCAG21_CONTRAST.AA_LARGE_TEXT;

/**
 * 액션(버튼 등) 배경 위 텍스트 색.
 * - hint 없음: 흰/검 중 대비가 더 큰 쪽.
 * - hint 있음: 대비가 {@link ON_ACTION_HINT_MIN_CONTRAST} 이상이면 hint 사용, 아니면 흰/검 자동.
 */
export function computeOnActionColor(bgColor: string, hint?: string): string {
  if (hint && getContrastRatio(hint, bgColor) >= ON_ACTION_HINT_MIN_CONTRAST)
    return hint;
  const whiteRatio = getContrastRatio('#FFFFFF', bgColor);
  const blackRatio = getContrastRatio('#000000', bgColor);
  return whiteRatio >= blackRatio ? '#FFFFFF' : '#000000';
}

/**
 * 두 hex 색상을 ratio(0~1) 비율로 혼합. ratio=0이면 base, ratio=1이면 mix
 */
export function colorMix(base: string, mix: string, ratio: number): string {
  const clamped = Math.max(0, Math.min(1, ratio));
  const baseRgb = hexToRgb(normalizeHex(base));
  const mixRgb = hexToRgb(normalizeHex(mix));

  return rgbToHex(
    baseRgb.r + (mixRgb.r - baseRgb.r) * clamped,
    baseRgb.g + (mixRgb.g - baseRgb.g) * clamped,
    baseRgb.b + (mixRgb.b - baseRgb.b) * clamped
  );
}
