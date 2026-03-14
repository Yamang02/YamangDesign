/**
 * E03: Palette/Style 프리셋 매핑
 * E06: palette-definitions를 단일 소스로 사용
 */
import type { PaletteDefinition } from '../palettes';
import type { StyleDefinition } from '../styles';
import {
  minimalStyle,
  neumorphismStyle,
  brutalismStyle,
  glassmorphismStyle,
} from '../styles';
import type { ExternalPalette } from '../@types/tokens';
import type { StyleName } from '../@types/theme';
import {
  themePresets,
  toThemePreset,
} from '../constants/palette-definitions';

/** 테마 프리셋 (palette-definitions re-export, 하위 호환용 palettePresets) */
export const palettePresets = themePresets;

export const stylePresets: Record<StyleName, StyleDefinition> = {
  minimal: minimalStyle,
  neumorphism: neumorphismStyle,
  brutalism: brutalismStyle,
  glassmorphism: glassmorphismStyle,
};

/** ExternalPalette → PaletteDefinition (custom, toThemePreset 래퍼) */
export function toCustomPaletteDefinition(colors: ExternalPalette): PaletteDefinition {
  return toThemePreset(colors, 'custom');
}
