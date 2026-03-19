/**
 * E03: Palette × Style 조합
 */
import type { Theme } from '@shared/@types/theme';
import type { PaletteDefinition } from '../palettes';
import type { StyleDefinition } from '../styles';
import { createPalette } from '../palettes';
import { createStyle } from '../styles';

/**
 * Palette와 Style을 조합하여 Theme 생성
 */
export function combineTheme(
  paletteDefinition: PaletteDefinition,
  styleDefinition: StyleDefinition
): Theme {
  const palette = createPalette(paletteDefinition);
  const style = createStyle(styleDefinition, palette.semantic.bg.base);

  return {
    palette: palette.id,
    style: style.name,

    colors: {
      bg: palette.semantic.bg,
      text: palette.semantic.text,
      border: palette.semantic.border,
      action: palette.semantic.action,
      feedback: palette.semantic.feedback,
    },

    shadows: style.shadows,
    border: style.border,
    vars: style.vars,
  };
}
