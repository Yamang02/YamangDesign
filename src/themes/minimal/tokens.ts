import type { Theme } from '../../@types/theme';
import type { ResolvedPalette, GeneratedScales } from '../../@types/tokens';
import { generateColorScales } from '../../utils/palette';

/**
 * Minimal 테마 생성
 * - 깔끔한 플랫 디자인
 * - 가벼운 drop shadow
 * - 명확한 border
 */
export function createMinimalTheme(palette: ResolvedPalette): Theme {
  const scales: GeneratedScales = generateColorScales(palette);

  return {
    palette: 'default',
    style: 'minimal',

    colors: {
      bg: {
        base: '#FFFFFF',
        surface: scales.neutral[100],
        surfaceBrand: scales.primary[50],
        elevated: '#FFFFFF',
        muted: scales.neutral[200],
      },

      text: {
        primary: scales.neutral[900],
        secondary: scales.neutral[600],
        muted: scales.neutral[400],
        inverse: '#FFFFFF',
        onAction: '#FFFFFF',
      },

      border: {
        default: scales.neutral[300],
        subtle: scales.neutral[200],
        accent: scales.primary[200],
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
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      inset: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
    },
    border: { width: '1px', style: 'solid' },
  };
}
