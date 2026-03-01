/**
 * Palette 레이어 - 배색을 독립적으로 관리
 * E01: Palette × Style 분리
 */
import type { ExternalPalette } from '../@types/tokens';
import { resolvePalette, generateColorScales } from '../utils/palette';
import { applyLightBgStrategy } from './strategies/light-bg';
import { applyColoredBgStrategy } from './strategies/colored-bg';
import { applyDarkBgStrategy } from './strategies/dark-bg';
import type { PaletteDefinition, ExpandedPalette } from './types';

const STRATEGY_MAP = {
  light: applyLightBgStrategy,
  colored: applyColoredBgStrategy,
  dark: applyDarkBgStrategy,
} as const;

/**
 * Palette 정의로부터 ExpandedPalette 생성
 */
export function createPalette(definition: PaletteDefinition): ExpandedPalette {
  const resolved = resolvePalette(definition.colors as ExternalPalette);
  const scales = generateColorScales(resolved);
  const strategyFn = STRATEGY_MAP[definition.bgStrategy];
  const semantic = strategyFn(scales);

  return {
    name: definition.name,
    bgStrategy: definition.bgStrategy,
    scales,
    semantic,
  };
}

export type { PaletteDefinition, ExpandedPalette, PaletteName, BgStrategy } from './types';
export {
  defaultPalette,
  vividPalette,
  pastelPalette,
  monochromePalette,
  earthPalette,
} from './presets';
