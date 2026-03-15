/**
 * Palette 레이어 - 배색을 독립적으로 관리
 * E01: Palette × Style 분리
 * P03: strategyFn 제거, resolve 경로로 통일
 */
import type { ColorInput } from '@shared/@types/tokens';
import { resolvePalette, generateColorScales } from './palette';
import { defaultSemanticMappings } from './strategies/default-mappings';
import { getMergedMapping, resolveSemanticMapping } from './mapping/resolve';
import type { PaletteDefinition, ComputedPalette } from './types';

/**
 * Palette 정의로부터 ComputedPalette 생성
 */
export function createPalette(definition: PaletteDefinition): ComputedPalette {
  const resolved = resolvePalette(definition.colors as ColorInput);
  const scales = generateColorScales(resolved);

  const baseMapping = defaultSemanticMappings[definition.bgStrategy];
  const mergedMapping = getMergedMapping(
    baseMapping,
    definition.semanticMapping
  );
  const semantic = resolveSemanticMapping(mergedMapping, scales);

  return {
    id: definition.id,
    bgStrategy: definition.bgStrategy,
    scales,
    semantic,
  };
}

export type { PaletteDefinition, ComputedPalette, BgStrategy } from './types';
// PaletteName은 @types/theme 또는 constants/theme-presets에서 import
export { defaultPalette } from './presets';
