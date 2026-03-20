/**
 * Palette 레이어 - 배색을 독립적으로 관리
 * E01: Palette × Style 분리
 * P03: strategyFn 제거, resolve 경로로 통일
 */
import type { ColorInput, ColorScale } from '@shared/@types/tokens';
import { resolvePalette, generateColorScales } from './palette';
import { defaultSemanticMappings } from './strategies/default-mappings';
import { getMergedMapping, resolveSemanticMapping } from './mapping/resolve';
import type { PaletteDefinition, ComputedPalette } from './types';

/**
 * Palette 정의로부터 ComputedPalette 생성
 * @param options.neutralScale - 팔레트 파생 neutral 대신 사용할 neutral 스케일 (neutral preset 주입용)
 */
export function createPalette(
  definition: PaletteDefinition,
  options?: { neutralScale?: ColorScale }
): ComputedPalette {
  const resolved = resolvePalette(definition.colors as ColorInput);
  const derivedScales = generateColorScales(resolved);

  const scales = options?.neutralScale
    ? { ...derivedScales, neutral: options.neutralScale }
    : derivedScales;

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
