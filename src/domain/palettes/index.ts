/**
 * Palette 레이어 — 배색 독립 관리, Palette × Style 분리, resolve 경로 통일.
 * `PaletteName`은 `@shared/@types/theme`·theme-presets에서 import한다.
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
export { defaultPalette } from './presets';
