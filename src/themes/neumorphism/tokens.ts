import type { Theme } from '../../@types/theme';
import type { ResolvedPalette, GeneratedScales } from '../../@types/tokens';
import { generateColorScales } from '../../utils/palette';
import { lighten, darken } from '../../utils/color';

/**
 * Neumorphism 테마 생성
 * - 배경과 요소가 동일 색상
 * - 양각/음각 그림자로 입체감
 * - border 없음
 */
export function createNeumorphismTheme(palette: ResolvedPalette): Theme {
  const scales: GeneratedScales = generateColorScales(palette);

  // Neumorphism 배경색 = sub 컬러
  const bgColor = palette.sub;
  const lightShadow = lighten(bgColor, 15);
  const darkShadow = darken(bgColor, 15);

  return {
    palette: 'default',
    style: 'neumorphism',

    colors: {
      bg: {
        base: bgColor,
        surface: bgColor,
        elevated: bgColor,
        muted: darken(bgColor, 5),
      },

      text: {
        primary: scales.sub[800],
        secondary: scales.sub[600],
        muted: scales.sub[500],
        inverse: '#FFFFFF',
        onAction: '#FFFFFF',
      },

      border: {
        default: 'transparent',
        subtle: 'transparent',
        focus: scales.primary[500],
      },

      action: {
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
      },
    },

    shadows: {
      none: 'none',
      sm: `3px 3px 6px ${darkShadow}, -3px -3px 6px ${lightShadow}`,
      md: `6px 6px 12px ${darkShadow}, -6px -6px 12px ${lightShadow}`,
      lg: `10px 10px 20px ${darkShadow}, -10px -10px 20px ${lightShadow}`,
      xl: `15px 15px 30px ${darkShadow}, -15px -15px 30px ${lightShadow}`,
      inset: `inset 4px 4px 8px ${darkShadow}, inset -4px -4px 8px ${lightShadow}`,
    },
    border: { width: '0px', style: 'none' },
  };
}
