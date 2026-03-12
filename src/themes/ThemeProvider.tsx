/**
 * E03: Palette × Style 조합 기반 ThemeProvider
 * PaletteSelection 기반 단일 상태 모델
 */
import { useState, useEffect, useMemo, useCallback, type ReactNode } from 'react';
import type {
  ThemeName,
  StyleName,
  SystemPresetName,
} from '../@types/theme';
import type { ExternalPalette } from '../@types/tokens';
import type { PaletteSelection } from '../palettes/types';
import { flattenToCSSVars, injectCSSVariables } from '../utils/css';
import { createPalette } from '../palettes';
import { combineTheme } from './combine';
import { stylePresets } from './presets';
import type { CustomSemanticPreset } from '../constants/semantic-presets';
import { usePaletteSelection } from '../hooks/usePaletteResolution';
import { useCustomSemanticPresets } from '../hooks/useCustomSemanticPresets';
import { PALETTE_SCALES } from '../constants/palette-scales';
import {
  savePaletteSelection,
  loadPaletteSelection,
  createPresetSelection,
  createCustomSelection,
  createCustomSemanticSelection,
} from '../utils/palette-selection';
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
} from '../tokens/global';
import { generateTextStyleVars } from '../tokens/typography';
import { generateSystemColorVars } from '../utils/system-colors';
import { systemColorPresets } from '../tokens/global/system-colors';
import { ThemeContext } from './ThemeContext';

export type { ThemeContextValue } from './ThemeContext';

export interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: ThemeName;
  initialStyleName?: StyleName;
  /** @deprecated initialSelection 사용 권장 */
  initialPaletteName?: string;
  /** @deprecated initialSelection 사용 권장 */
  initialPalette?: ExternalPalette;
  /** 초기 팔레트 선택 상태 */
  initialSelection?: PaletteSelection;
  systemPreset?: SystemPresetName;
}

export function ThemeProvider({
  children,
  initialTheme,
  initialStyleName = initialTheme ?? 'minimal',
  initialPaletteName,
  initialPalette,
  initialSelection,
  systemPreset: initialSystemPreset = 'default',
}: ThemeProviderProps) {
  const [styleName, setStyleName] = useState<StyleName>(initialStyleName);
  const [systemPreset, setSystemPresetState] =
    useState<SystemPresetName>(initialSystemPreset);

  // PaletteSelection 기반 단일 상태
  const [selection, setSelectionState] = useState<PaletteSelection>(() => {
    // 우선순위: initialSelection > initialPalette > initialPaletteName > localStorage > default
    if (initialSelection) return initialSelection;
    if (initialPalette) return createCustomSelection(initialPalette);
    if (initialPaletteName) return createPresetSelection(initialPaletteName);
    return loadPaletteSelection();
  });

  // 커스텀 시맨틱 프리셋 관리 (localStorage 연동)
  const {
    presets: customSemanticPresets,
    add: addCustomSemanticPresetInternal,
    update: updateCustomSemanticPreset,
    remove: removeCustomSemanticPresetInternal,
  } = useCustomSemanticPresets();

  // 팔레트 해석 (PaletteSelection → PaletteDefinition)
  const { definition: paletteDefinition, colors: palette } = usePaletteSelection(
    selection,
    customSemanticPresets
  );

  // ============================================================================
  // 새 API: setPaletteSelection
  // ============================================================================
  const setPaletteSelection = useCallback((newSelection: PaletteSelection) => {
    setSelectionState(newSelection);
    savePaletteSelection(newSelection);
  }, []);

  // ============================================================================
  // 하위 호환 API (deprecated)
  // ============================================================================
  /** @deprecated setPaletteSelection 사용 권장 */
  const setPaletteName = useCallback((name: string) => {
    if (name === 'custom') {
      // custom은 colors가 필요하므로 무시
      return;
    }
    if (name.startsWith('custom-semantic:')) {
      const presetId = name.replace('custom-semantic:', '');
      setPaletteSelection(createCustomSemanticSelection(presetId));
    } else {
      setPaletteSelection(createPresetSelection(name));
    }
  }, [setPaletteSelection]);

  /** @deprecated setPaletteSelection 사용 권장 */
  const setCustomColors = useCallback((colors: ExternalPalette | null) => {
    if (colors) {
      setPaletteSelection(createCustomSelection(colors));
    }
  }, [setPaletteSelection]);

  /** @deprecated setPaletteSelection 사용 권장 */
  const setPalette = useCallback((colors: ExternalPalette) => {
    setPaletteSelection(createCustomSelection(colors));
  }, [setPaletteSelection]);

  /** @deprecated setPaletteSelection 사용 권장 */
  const applyCustomSemanticPreset = useCallback((preset: CustomSemanticPreset) => {
    setPaletteSelection(createCustomSemanticSelection(preset.id));
  }, [setPaletteSelection]);

  const setThemeName = (name: ThemeName) => {
    setStyleName(name);
  };

  // paletteName 파생 (하위 호환)
  const paletteName = useMemo(() => {
    switch (selection.type) {
      case 'preset':
        return selection.presetId;
      case 'custom':
        return 'custom';
      case 'custom-semantic':
        return `custom-semantic:${selection.presetId}`;
    }
  }, [selection]);

  // customColors 파생 (하위 호환)
  const customColors = useMemo(() => {
    return selection.type === 'custom' ? selection.colors : null;
  }, [selection]);

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
      if (selection.type === 'custom-semantic' && selection.presetId === id) {
        setPaletteSelection(createPresetSelection('default'));
      }
    },
    [selection, removeCustomSemanticPresetInternal, setPaletteSelection]
  );

  useEffect(() => {
    const expandedPalette = createPalette(paletteDefinition);
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
  }, [theme, styleName, systemPreset, paletteDefinition]);

  const setSystemPreset = (name: SystemPresetName) => {
    setSystemPresetState(name);
  };

  const value = {
    theme,
    themeName: styleName,
    setThemeName,
    // 새 API
    selection,
    setPaletteSelection,
    // 하위 호환 API (deprecated)
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
    paletteDefinition,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
