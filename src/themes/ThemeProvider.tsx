/**
 * E03: Palette × Style 조합 기반 ThemeProvider
 * Refactored: usePaletteResolution, useCustomSemanticPresets 훅 사용
 */
import { useState, useEffect, useMemo, useCallback, type ReactNode } from 'react';
import type {
  ThemeName,
  PaletteName,
  StyleName,
  SystemPresetName,
} from '../@types/theme';
import type { ExternalPalette } from '../@types/tokens';
import { flattenToCSSVars, injectCSSVariables } from '../utils/css';
import { createPalette } from '../palettes';
import { combineTheme } from './combine';
import { stylePresets } from './presets';
import type { CustomSemanticPreset } from '../constants/semantic-presets';
import { isCustomSemanticPaletteId } from '../constants/theme-presets';
import { usePaletteResolution } from '../hooks/usePaletteResolution';
import { useCustomSemanticPresets } from '../hooks/useCustomSemanticPresets';
import { PALETTE_SCALES } from '../constants/palette-scales';
import {
  spacing,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  borderRadius,
  borderWidth,
  componentHeight,
  zIndex,
  duration,
  easing,
  stateLayer,
} from '../tokens/primitives';
import { generateTextStyleVars } from '../tokens/typography';
import { generateSystemColorVars } from '../utils/system-colors';
import { systemColorPresets } from '../tokens/primitives/system-colors';
import { ThemeContext } from './ThemeContext';

export type { ThemeContextValue } from './ThemeContext';

export interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: ThemeName;
  initialStyleName?: StyleName;
  initialPaletteName?: PaletteName;
  initialPalette?: ExternalPalette;
  systemPreset?: SystemPresetName;
}

export function ThemeProvider({
  children,
  initialTheme,
  initialStyleName = initialTheme ?? 'minimal',
  initialPaletteName = 'default',
  initialPalette,
  systemPreset: initialSystemPreset = 'default',
}: ThemeProviderProps) {
  const [styleName, setStyleName] = useState<StyleName>(initialStyleName);
  const [paletteName, setPaletteNameState] = useState<PaletteName>(
    initialPaletteName
  );
  const [customColors, setCustomColorsState] = useState<ExternalPalette | null>(
    initialPalette ?? null
  );
  const [systemPreset, setSystemPresetState] =
    useState<SystemPresetName>(initialSystemPreset);

  // 커스텀 시맨틱 프리셋 관리 (localStorage 연동)
  const {
    presets: customSemanticPresets,
    add: addCustomSemanticPresetInternal,
    update: updateCustomSemanticPreset,
    remove: removeCustomSemanticPresetInternal,
  } = useCustomSemanticPresets();

  const setPaletteName = (name: PaletteName) => {
    setPaletteNameState(name);
    if (name !== 'custom' && !isCustomSemanticPaletteId(name)) setCustomColorsState(null);
  };

  const setCustomColors = (colors: ExternalPalette | null) => {
    setCustomColorsState(colors);
    if (colors) setPaletteNameState('custom');
  };

  const setThemeName = (name: ThemeName) => {
    setStyleName(name);
  };

  // 팔레트 해석 (단일 소스)
  const { definition: basePaletteDefinition, colors: palette } = usePaletteResolution(
    paletteName,
    customColors,
    customSemanticPresets
  );

  const paletteDefinition = basePaletteDefinition;

  const theme = useMemo(() => {
    const styleDef = stylePresets[styleName] ?? stylePresets.minimal;
    return combineTheme(paletteDefinition, styleDef);
  }, [paletteDefinition, styleName]);

  // 커스텀 프리셋 CRUD 래퍼 (삭제 시 현재 팔레트 초기화 포함)
  const addCustomSemanticPreset = useCallback(
    (preset: Omit<CustomSemanticPreset, 'id' | 'createdAt'>) => {
      return addCustomSemanticPresetInternal(preset);
    },
    [addCustomSemanticPresetInternal]
  );

  const deleteCustomSemanticPreset = useCallback(
    (id: string) => {
      removeCustomSemanticPresetInternal(id);
      // 현재 선택된 프리셋이 삭제되면 기본값으로 초기화
      if (paletteName === `custom-semantic:${id}`) {
        setPaletteNameState('default' as PaletteName);
      }
    },
    [paletteName, removeCustomSemanticPresetInternal]
  );

  const applyCustomSemanticPreset = useCallback((preset: CustomSemanticPreset) => {
    setPaletteNameState(`custom-semantic:${preset.id}` as PaletteName);
  }, []);

  const setPalette = (colors: ExternalPalette) => {
    setCustomColors(colors);
  };

  useEffect(() => {
    const expandedPalette = createPalette(basePaletteDefinition);
    const paletteScaleVars: Record<string, string> = {};
    PALETTE_SCALES.forEach((key) => {
      const scale = expandedPalette.scales[key];
      if (scale) {
        Object.entries(scale).forEach(([step, color]) => {
          paletteScaleVars[`--ds-color-${key}-${step}`] = color;
        });
      }
    });

    const themeCSSVars = {
      ...flattenToCSSVars({
        color: theme.colors,
        shadow: theme.shadows,
        border: theme.border,
      }),
    };

    const zIndexAsStrings = Object.fromEntries(
      Object.entries(zIndex).map(([k, v]) => [k, String(v)])
    );
    const primitiveCSSVars = flattenToCSSVars({
      spacing,
      font: fontFamily,
      text: fontSize,
      'font-weight': fontWeight,
      leading: lineHeight,
      radius: borderRadius,
      border: borderWidth,
      size: componentHeight,
      z: zIndexAsStrings,
      duration,
      ease: easing,
    });

    const stateLayerVars: Record<string, string> = {
      '--ds-state-hover-opacity': String(stateLayer.hover),
      '--ds-state-pressed-opacity': String(stateLayer.pressed),
      '--ds-state-focus-opacity': String(stateLayer.focus),
      '--ds-state-selected-opacity': String(stateLayer.selected),
      '--ds-state-disabled-opacity': String(stateLayer.disabled),
    };

    const typographyVars = generateTextStyleVars();

    const systemVars = generateSystemColorVars(
      systemColorPresets[systemPreset]
    );

    injectCSSVariables({
      ...primitiveCSSVars,
      ...paletteScaleVars,
      ...themeCSSVars,
      ...stateLayerVars,
      ...typographyVars,
      ...systemVars,
    });

    document.documentElement.setAttribute('data-palette', theme.palette);
    document.documentElement.setAttribute('data-style', theme.style);
    document.documentElement.setAttribute('data-theme', styleName);
    document.documentElement.setAttribute('data-system-preset', systemPreset);
  }, [theme, styleName, systemPreset, basePaletteDefinition]);

  const setSystemPreset = (name: SystemPresetName) => {
    setSystemPresetState(name);
  };

  const value = {
    theme,
    themeName: styleName,
    setThemeName,
    paletteName,
    styleName,
    setPaletteName,
    setStyleName,
    customColors,
    setCustomColors,
    palette,
    setPalette,
    systemPreset,
    setSystemPreset,
    customSemanticPresets,
    addCustomSemanticPreset,
    updateCustomSemanticPreset,
    deleteCustomSemanticPreset,
    applyCustomSemanticPreset,
    paletteDefinition: basePaletteDefinition,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
