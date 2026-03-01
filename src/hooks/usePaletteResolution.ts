/**
 * 팔레트 이름을 PaletteDefinition과 ExternalPalette로 해석하는 훅
 * ThemeProvider의 중복 로직을 단일화
 */
import { useMemo } from 'react';
import type { PaletteName } from '../constants/theme-presets';
import { isCustomSemanticPaletteId } from '../constants/theme-presets';
import type { ExternalPalette } from '../@types/tokens';
import type { PaletteDefinition } from '../palettes/types';
import type { CustomSemanticPreset } from '../constants/semantic-presets';
import { presetToPaletteDefinition } from '../constants/semantic-presets';
import { palettePresets, toCustomPaletteDefinition } from '../themes/presets';

export interface PaletteResolution {
  /** 해석된 PaletteDefinition */
  definition: PaletteDefinition;
  /** 해석된 색상 (ExternalPalette) */
  colors: ExternalPalette;
}

/**
 * 팔레트 이름을 정의와 색상으로 해석
 *
 * @param paletteName - 현재 팔레트 이름
 * @param customColors - 사용자 정의 색상 (있는 경우)
 * @param customSemanticPresets - 커스텀 시맨틱 프리셋 목록
 * @returns definition과 colors를 포함한 해석 결과
 */
export function usePaletteResolution(
  paletteName: PaletteName,
  customColors: ExternalPalette | null,
  customSemanticPresets: CustomSemanticPreset[]
): PaletteResolution {
  return useMemo(() => {
    // 1. Custom semantic preset
    if (isCustomSemanticPaletteId(paletteName)) {
      const id = paletteName.replace('custom-semantic:', '');
      const preset = customSemanticPresets.find((p) => p.id === id);
      if (preset) {
        const def = presetToPaletteDefinition(preset);
        const base =
          palettePresets[preset.basePaletteId as keyof typeof palettePresets];
        if (def && base) {
          return {
            definition: def,
            colors: base.colors as ExternalPalette,
          };
        }
      }
      // fallback
      return {
        definition: palettePresets.default,
        colors: palettePresets.default.colors as ExternalPalette,
      };
    }

    // 2. Custom colors (사용자 직접 입력)
    if (customColors) {
      return {
        definition: toCustomPaletteDefinition(customColors),
        colors: customColors,
      };
    }

    // 3. Preset palette
    const preset =
      palettePresets[paletteName as keyof typeof palettePresets] ??
      palettePresets.default;
    return {
      definition: preset,
      colors: preset.colors as ExternalPalette,
    };
  }, [paletteName, customColors, customSemanticPresets]);
}
