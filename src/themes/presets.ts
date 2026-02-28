/**
 * E03: Palette/Style 프리셋 매핑
 */
import type { PaletteDefinition } from '../palettes';
import type { StyleDefinition } from '../styles';
import { defaultPalette, vividPalette, pastelPalette } from '../palettes';
import { minimalStyle, neumorphismStyle } from '../styles';
import type { ExternalPalette } from '../@types/tokens';
import type { PaletteName, StyleName } from '../@types/theme';

export const palettePresets: Record<Exclude<PaletteName, 'custom'>, PaletteDefinition> = {
  default: defaultPalette,
  vivid: vividPalette,
  pastel: pastelPalette,
  monochrome: {
    name: 'monochrome',
    colors: { primary: '#4B5563', sub: '#9CA3AF' },
    bgStrategy: 'light',
  },
  earth: {
    name: 'earth',
    colors: {
      primary: '#78716C',
      secondary: '#A8A29E',
      accent: '#D97706',
      sub: '#F5F5F4',
    },
    bgStrategy: 'light',
  },
};

export const stylePresets: Record<StyleName, StyleDefinition> = {
  minimal: minimalStyle,
  neumorphism: neumorphismStyle,
  glassmorphism: minimalStyle, // placeholder - reuse minimal for now
  brutalism: minimalStyle, // placeholder - reuse minimal for now
};

/** ExternalPalette → PaletteDefinition (custom) */
export function toCustomPaletteDefinition(colors: ExternalPalette): PaletteDefinition {
  return {
    name: 'custom',
    colors,
    bgStrategy: 'light',
  };
}
