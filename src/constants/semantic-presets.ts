/**
 * 시맨틱 매핑 커스텀 프리셋 (베이스 참조 + 오버라이드)
 * 변경된 토큰만 저장하여 merge 시 base 위에 덮어씌움
 */
import type { PaletteName } from '../@types/theme';
import type { PaletteDefinition, SemanticMapping } from '../palettes/types';
import { themePresets, isCustomSemanticPaletteId } from './theme-presets';
import { defaultSemanticMappings } from '../palettes/strategies/default-mappings';
import { getMergedMapping } from '../palettes/mapping/resolve';

export const CUSTOM_THEME_PRESETS_STORAGE_KEY = 'yamang-custom-theme-presets';

/** @deprecated CUSTOM_THEME_PRESETS_STORAGE_KEY 사용 권장 */
export const CUSTOM_SEMANTIC_PRESETS_STORAGE_KEY = 'yamang-custom-semantic-presets';

export interface CustomThemePreset {
  id: string;
  /** 베이스 프리셋 ID (theme-presets 키) */
  basePaletteId: PaletteName;
  /** 변경된 시맨틱 토큰만 (delta) */
  semanticOverrides: Partial<SemanticMapping>;
  /** 표시 이름 (예: "Spring Cream Soda (커스텀)") */
  displayName?: string;
  createdAt?: string;
}

/** @deprecated CustomThemePreset 사용 권장 */
export type CustomSemanticPreset = CustomThemePreset;

export interface StoredCustomThemePresets {
  version: string;
  presets: CustomThemePreset[];
}

/** @deprecated StoredCustomThemePresets 사용 권장 */
export type StoredCustomSemanticPresets = StoredCustomThemePresets;

/** 커스텀 프리셋 → PaletteDefinition (베이스 + semanticOverrides 병합) */
export function presetToPaletteDefinition(
  preset: CustomThemePreset
): PaletteDefinition | null {
  const base =
    preset.basePaletteId === 'custom' || isCustomSemanticPaletteId(preset.basePaletteId)
      ? null
      : themePresets[preset.basePaletteId as keyof typeof themePresets];
  if (!base) return null;
  const baseMapping = getMergedMapping(
    defaultSemanticMappings[base.bgStrategy],
    base.semanticMapping
  );
  const finalMapping = getMergedMapping(baseMapping, preset.semanticOverrides);
  return {
    ...base,
    id: preset.id,
    semanticMapping: finalMapping,
  };
}
