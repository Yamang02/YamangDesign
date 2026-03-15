/**
 * E06: Palette 프리셋 통합
 * ColorPicker(색상 편집)와 PaletteLab(테마 비교)에서 공통 타입/유틸 공유
 * theme-presets.ts가 단일 소스(SOT) - registry에서 자동 수집
 */
import type { PaletteDefinition } from '../palettes';
import type { ColorInput } from '../@types/tokens';
import type { PaletteName } from '../@types/theme';
import { themePresets } from './theme-presets';

export { themePresets };

/** 색상 시작점 (ColorPicker용 - 단일 primary 베이스) */
export const colorStartPoints: Record<string, ColorInput> = {
  indigo: { primary: '#6366F1' },
  emerald: { primary: '#10B981' },
  rose: { primary: '#F43F5E' },
  amber: { primary: '#F59E0B' },
  cyan: { primary: '#06B6D4' },
};

/** ColorInput을 PaletteDefinition으로 확장 (custom용) */
export function toThemePreset(
  colors: ColorInput,
  id: PaletteName = 'custom'
): PaletteDefinition {
  return {
    id,
    colors,
    bgStrategy: 'light',
  };
}
