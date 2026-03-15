import type {
  ColorInput,
  ResolvedColors,
  ColorScale,
  GeneratedScales,
} from '../@types/tokens';
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
 * Neutral 파생: 채도 낮추고 밝게 (텍스트/테두리/배경용)
 * E09: 기존 deriveSub 로직
 */
function deriveNeutral(primary: string): string {
  return desaturate(lighten(primary, 40), 70);
}

/**
 * Sub 파생: Primary 기반 연한 컬러풀 보조색
 * 미입력 시 Auto로 적용. E09 Sub 적용 정책 참고
 */
function deriveSub(primary: string): string {
  return lighten(primary, 40);
}

/**
 * 색상 입력을 완전한 팔레트로 변환
 * E09: neutral 항상, sub 항상 (Primary 제외 일관된 Auto 파생)
 */
export function resolvePalette(input: ColorInput): ResolvedColors {
  const { primary, secondary, accent, neutral, sub } = input;
  const neutralSource = neutral ?? sub ?? deriveNeutral(primary);
  const subResolved = sub ?? deriveSub(primary);

  return {
    primary,
    secondary: secondary ?? deriveSecondary(primary),
    accent: accent ?? deriveAccent(primary),
    neutral: neutralSource,
    sub: subResolved,

    _meta: {
      derived: {
        secondary: !secondary,
        accent: !accent,
        neutral: !neutral && !sub,
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
 * 팔레트에서 전체 스케일 생성
 * E09: neutral, sub 항상 포함 (Primary 제외 Auto 파생 통일)
 */
export function generateColorScales(palette: ResolvedColors): GeneratedScales {
  return {
    primary: generateColorScale(palette.primary),
    secondary: generateColorScale(palette.secondary),
    accent: generateColorScale(palette.accent),
    neutral: generateColorScale(palette.neutral),
    sub: generateColorScale(palette.sub),
  };
}

