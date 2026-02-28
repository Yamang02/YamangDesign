import type {
  ExternalPalette,
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
 * 외부 팔레트를 완전한 팔레트로 변환
 * E09: neutral 추가, sub 선택적
 */
export function resolvePalette(input: ExternalPalette): ResolvedColors {
  const { primary, secondary, accent, neutral, sub } = input;
  const neutralSource = neutral ?? sub ?? deriveNeutral(primary);

  return {
    primary,
    secondary: secondary ?? deriveSecondary(primary),
    accent: accent ?? deriveAccent(primary),
    neutral: neutralSource,
    ...(sub && { sub }),

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
 * E09: neutral 항상, sub는 있을 때만
 */
export function generateColorScales(palette: ResolvedColors): GeneratedScales {
  const scales: GeneratedScales = {
    primary: generateColorScale(palette.primary),
    secondary: generateColorScale(palette.secondary),
    accent: generateColorScale(palette.accent),
    neutral: generateColorScale(palette.neutral),
  };
  if (palette.sub) {
    scales.sub = generateColorScale(palette.sub);
  }
  return scales;
}

/** 액션 색상 (버튼 등 상태별) */
export interface ActionColors {
  default: string;
  hover: string;
  active?: string;
}

/**
 * 스케일에서 액션 색상 생성
 * E03: combineTheme에서 사용
 */
export function generateActionColors(scales: GeneratedScales): {
  primary: ActionColors;
  secondary: ActionColors;
  accent: ActionColors;
} {
  return {
    primary: {
      default: scales.primary[500],
      hover: scales.primary[600],
      active: scales.primary[700],
    },
    secondary: {
      default: scales.secondary[500],
      hover: scales.secondary[600],
      active: scales.secondary[700],
    },
    accent: {
      default: scales.accent[500],
      hover: scales.accent[600],
      active: scales.accent[700],
    },
  };
}
