/**
 * 팔레트 선택을 PaletteDefinition과 ExternalPalette로 해석하는 훅
 * PaletteSelection 기반 단일 해석 로직
 */
import { useMemo } from 'react';
import type { ColorInput } from '@shared/@types/tokens';
import type { PaletteDefinition } from '@domain/palettes/types';
import type { PaletteSelection } from '../state/types';
import type { CustomThemePreset } from '@domain/constants/semantic-presets';
import { presetToPaletteDefinition } from '@domain/constants/semantic-presets';
import { palettePresets, toCustomPaletteDefinition } from '@domain/themes/presets';

export interface PaletteResolution {
  /** 해석된 PaletteDefinition */
  definition: PaletteDefinition;
  /** 해석된 색상 (ColorInput) */
  colors: ColorInput;
}

function normalizeHex(value: string | undefined): string {
  return (value ?? '').trim().toLowerCase();
}

function isSameColors(a: ColorInput, b: ColorInput): boolean {
  return (
    normalizeHex(a.primary) === normalizeHex(b.primary) &&
    normalizeHex(a.secondary) === normalizeHex(b.secondary) &&
    normalizeHex(a.accent) === normalizeHex(b.accent) &&
    normalizeHex(a.neutral) === normalizeHex(b.neutral) &&
    normalizeHex(a.sub) === normalizeHex(b.sub)
  );
}

function findMatchingPresetByColors(colors: ColorInput): PaletteDefinition | null {
  const presetList = Object.values(palettePresets) as PaletteDefinition[];
  const matched = presetList.find((preset) => isSameColors(preset.colors as ColorInput, colors));
  return matched ?? null;
}

/**
 * PaletteSelection을 PaletteDefinition으로 해석 (순수 함수)
 *
 * @param selection - 팔레트 선택 상태
 * @param customSemanticPresets - 커스텀 테마 프리셋 목록
 * @returns PaletteResolution (definition + colors)
 */
export function resolveSelection(
  selection: PaletteSelection,
  customSemanticPresets: CustomThemePreset[]
): PaletteResolution {
  switch (selection.type) {
    case 'preset': {
      const preset =
        palettePresets[selection.presetId as keyof typeof palettePresets] ??
        palettePresets.default;
      return {
        definition: preset,
        colors: preset.colors as ColorInput,
      };
    }

    case 'custom': {
      const matchedPreset = findMatchingPresetByColors(selection.colors);
      if (matchedPreset) {
        return {
          definition: matchedPreset,
          colors: matchedPreset.colors as ColorInput,
        };
      }
      return {
        definition: toCustomPaletteDefinition(selection.colors),
        colors: selection.colors,
      };
    }

    case 'custom-semantic': {
      const preset = customSemanticPresets.find(
        (p) => p.id === selection.presetId
      );
      if (preset) {
        const def = presetToPaletteDefinition(preset);
        const base =
          palettePresets[preset.basePaletteId as keyof typeof palettePresets];
        if (def && base) {
          return {
            definition: def,
            colors: base.colors as ColorInput,
          };
        }
      }
      // fallback
      return {
        definition: palettePresets.default,
        colors: palettePresets.default.colors as ColorInput,
      };
    }
  }
}

/**
 * PaletteSelection을 정의와 색상으로 해석하는 훅
 *
 * @param selection - 팔레트 선택 상태
 * @param customSemanticPresets - 커스텀 테마 프리셋 목록
 * @returns definition과 colors를 포함한 해석 결과
 */
export function usePaletteSelection(
  selection: PaletteSelection,
  customSemanticPresets: CustomThemePreset[]
): PaletteResolution {
  return useMemo(
    () => resolveSelection(selection, customSemanticPresets),
    [selection, customSemanticPresets]
  );
}
