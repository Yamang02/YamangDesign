/**
 * E06: Palette 프리셋 통합
 * ColorPicker(색상 편집)와 PaletteLab(테마 비교)에서 공통 타입/유틸 공유
 * P02: default만 유지, vivid/pastel/monochrome/earth 제거
 */
import type { PaletteDefinition } from '../palettes';
import type { ExternalPalette } from '../@types/tokens';
import type { PaletteName } from '../@types/theme';
import { defaultPalette } from '../palettes';

/** 테마 프리셋 (PaletteLab용 - 완전한 색상 세트) */
export const themePresets: Record<
  Exclude<PaletteName, 'custom'>,
  PaletteDefinition
> = {
  default: defaultPalette,
};

/** 색상 시작점 (ColorPicker용 - 단일 primary 베이스) */
export const colorStartPoints: Record<string, ExternalPalette> = {
  indigo: { primary: '#6366F1' },
  emerald: { primary: '#10B981' },
  rose: { primary: '#F43F5E' },
  amber: { primary: '#F59E0B' },
  cyan: { primary: '#06B6D4' },
};

/** ExternalPalette를 PaletteDefinition으로 확장 (custom용) */
export function toThemePreset(
  colors: ExternalPalette,
  name: PaletteName = 'custom'
): PaletteDefinition {
  return {
    name,
    colors,
    bgStrategy: 'light',
  };
}
