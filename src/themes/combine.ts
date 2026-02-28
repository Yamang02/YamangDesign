/**
 * E03: Palette × Style 조합
 */
import type { Theme } from '../@types/theme';
import type { PaletteDefinition } from '../palettes';
import type { StyleDefinition } from '../styles';
import { createPalette } from '../palettes';
import { createStyle } from '../styles';
import { generateActionColors } from '../utils/palette';

/**
 * Palette와 Style을 조합하여 Theme 생성
 */
export function combineTheme(
  paletteDefinition: PaletteDefinition,
  styleDefinition: StyleDefinition
): Theme {
  const palette = createPalette(paletteDefinition);
  const style = createStyle(styleDefinition, palette.semantic.bg.base);
  const actionColors = generateActionColors(palette.scales);

  return {
    palette: palette.name,
    style: style.name,

    colors: {
      bg: palette.semantic.bg,
      text: {
        ...palette.semantic.text,
        inverse: palette.bgStrategy === 'dark' ? palette.semantic.text.primary : '#FFFFFF',
      },
      border: palette.semantic.border,
      action: actionColors,
    },

    shadows: style.shadows,
    border: style.border,
  };
}
