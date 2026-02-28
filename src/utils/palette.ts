import type { ExternalPalette, ResolvedPalette, ColorScale, GeneratedScales } from '../@types/tokens';
import { lighten, darken, adjustHue, desaturate } from './color';

/**
 * Secondary 파생: 색상환 30도 이동 (유사색)
 */
function deriveSecondary(primary: string): string {
  return adjustHue(primary, 30);
}

/**
 * Accent 파생: 보색 계열 (180도)
 */
function deriveAccent(primary: string): string {
  return adjustHue(primary, 180);
}

/**
 * Sub 파생: 채도 낮추고 밝게
 */
function deriveSub(primary: string): string {
  return desaturate(lighten(primary, 40), 70);
}

/**
 * 외부 팔레트를 완전한 팔레트로 변환
 * 미입력 색상은 primary 기반 파생
 */
export function resolvePalette(input: ExternalPalette): ResolvedPalette {
  const { primary, secondary, accent, sub } = input;

  return {
    primary,
    secondary: secondary ?? deriveSecondary(primary),
    accent: accent ?? deriveAccent(primary),
    sub: sub ?? deriveSub(primary),

    _meta: {
      derived: {
        secondary: !secondary,
        accent: !accent,
        sub: !sub,
      },
    },
  };
}

/**
 * 단일 색상에서 10단계 스케일 생성
 */
export function generateColorScale(baseColor: string): ColorScale {
  return {
    50: lighten(baseColor, 45),
    100: lighten(baseColor, 40),
    200: lighten(baseColor, 30),
    300: lighten(baseColor, 20),
    400: lighten(baseColor, 10),
    500: baseColor,
    600: darken(baseColor, 10),
    700: darken(baseColor, 20),
    800: darken(baseColor, 30),
    900: darken(baseColor, 40),
  };
}

/**
 * 4개 메인 컬러에서 전체 스케일 생성
 */
export function generateColorScales(palette: ResolvedPalette): GeneratedScales {
  return {
    primary: generateColorScale(palette.primary),
    secondary: generateColorScale(palette.secondary),
    accent: generateColorScale(palette.accent),
    sub: generateColorScale(palette.sub),
  };
}
