/**
 * E03: Palette × Style 조합 기반 ThemeProvider
 * PaletteSelection 기반 단일 상태 모델
 */
import { useState, useLayoutEffect, useMemo, useCallback, type ReactNode } from 'react';
import type {
  StyleName,
  SystemPresetName,
} from '@shared/@types/theme';
import type { ColorInput } from '@shared/@types/tokens';
import type { PaletteSelection } from '@app/state/types';
import {
  savePaletteSelection,
  loadPaletteSelection,
  createPresetSelection,
  createCustomSelection,
} from '@app/state/palette-selection';
import { siteStyle } from '@app/config/site-style';
import { flattenToCSSVars, injectCSSVariables } from '@shared/utils/css';
import { getMergedMapping } from '../palettes/mapping/resolve';
import { defaultSemanticMappings } from '../palettes/strategies/default-mappings';
import type { StoredSettings } from '@app/components/GlobalSettings/types';
import { flattenTokenSet, buildThemeAndTokenSet } from './token-set';
import { stylePresets } from './presets';
import type { CustomThemePreset } from '../constants/semantic-presets';
import { usePaletteSelection } from '@app/hooks/usePaletteResolution';
import { useCustomThemePresets } from '@app/hooks/useCustomThemePresets';
import {
  spacing,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  borderRadius,
  borderWidth,
  componentHeight,
  iconSize,
  componentSize,
  zIndex,
  duration,
  easing,
  stateLayer,
} from '../tokens/global';
import { generateTextStyleVars } from '../tokens/typography';
import { ThemeContext } from './ThemeContext';

export type { ThemeContextValue } from './ThemeContext';

export interface ThemeProviderProps {
  children: ReactNode;
  initialStyle?: StyleName;
  /** @deprecated initialStyle 사용 권장 */
  initialTheme?: StyleName;
  initialStyleName?: StyleName;
  /** @deprecated initialSelection 사용 권장 */
  initialPaletteName?: string;
  /** @deprecated initialSelection 사용 권장 */
  initialPalette?: ColorInput;
  /** 초기 팔레트 선택 상태 */
  initialSelection?: PaletteSelection;
  systemPreset?: SystemPresetName;
  /** P05: 적용된 전역 설정 (시맨틱 매핑 등). 변경 시 테마에 반영 */
  appliedSettings?: StoredSettings | null;
}

export function ThemeProvider({
  children,
  initialStyle,
  initialTheme,
  initialStyleName = initialStyle ?? initialTheme ?? siteStyle.defaults.style,
  initialPaletteName,
  initialPalette,
  initialSelection,
  systemPreset: initialSystemPreset = 'default',
  appliedSettings = null,
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
    return loadPaletteSelection() ?? createPresetSelection(siteStyle.defaults.palette);
  });

  // 커스텀 테마 프리셋 관리 (localStorage 연동)
  const {
    presets: customSemanticPresets,
    add: addCustomSemanticPresetInternal,
    update: updateCustomSemanticPreset,
    remove: removeCustomSemanticPresetInternal,
  } = useCustomThemePresets();

  // 팔레트 해석 (PaletteSelection → PaletteDefinition)
  const { definition: paletteDefinition, colors: palette } = usePaletteSelection(
    selection,
    customSemanticPresets
  );

  // P05: 전역 시맨틱 오버라이드 병합 (설정 페이지 적용분)
  const definitionForTheme = useMemo(() => {
    const base = defaultSemanticMappings[paletteDefinition.bgStrategy];
    const withDef = getMergedMapping(base, paletteDefinition.semanticMapping);
    const merged = getMergedMapping(withDef, appliedSettings?.semanticMapping ?? undefined);
    return { ...paletteDefinition, semanticMapping: merged };
  }, [paletteDefinition, appliedSettings?.semanticMapping]);

  // P08: design-settings 적용 시 selection을 palette 스냅샷으로 동기화
  const [prevAppliedSettings, setPrevAppliedSettings] = useState(appliedSettings);
  if (prevAppliedSettings !== appliedSettings) {
    setPrevAppliedSettings(appliedSettings);
    if (appliedSettings?.palette) {
      setSelectionState(createCustomSelection(appliedSettings.palette));
    }
  }

  // ============================================================================
  // 새 API: setPaletteSelection
  // ============================================================================
  const setPaletteSelection = useCallback((newSelection: PaletteSelection) => {
    setSelectionState(newSelection);
    savePaletteSelection(newSelection);
  }, []);

  // P05: theme + tokenSet을 buildThemeAndTokenSet으로 한 번에 계산 (createPalette 중복 호출 제거)
  const { theme, tokenSet } = useMemo(() => {
    const styleDef = stylePresets[styleName] ?? stylePresets.minimal;
    return buildThemeAndTokenSet(definitionForTheme, styleDef, { systemPreset });
  }, [definitionForTheme, styleName, systemPreset]);

  // 커스텀 프리셋 CRUD 래퍼 (삭제 시 현재 팔레트 초기화 포함)
  const addCustomSemanticPreset = useCallback(
    (preset: Omit<CustomThemePreset, 'id' | 'createdAt'>) => {
      return addCustomSemanticPresetInternal(preset);
    },
    [addCustomSemanticPresetInternal]
  );

  const deleteCustomSemanticPreset = useCallback(
    (id: string) => {
      removeCustomSemanticPresetInternal(id);
      // 현재 선택된 프리셋이 삭제되면 기본값으로 초기화
      if (selection.type === 'custom-semantic' && selection.presetId === id) {
        setPaletteSelection(createPresetSelection(siteStyle.defaults.palette));
      }
    },
    [selection, removeCustomSemanticPresetInternal, setPaletteSelection]
  );

  useLayoutEffect(() => {
    const paletteStyleVars = flattenTokenSet(tokenSet);

    // Global alias vars: each palette+style var also exposed as {var}-global
    const globalAliasVars = Object.fromEntries(
      Object.entries(paletteStyleVars).map(([k, v]) => [`${k}-global`, v])
    );

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
      'icon-size': iconSize,
      'component-size': componentSize,
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

    injectCSSVariables({
      ...primitiveCSSVars,
      ...paletteStyleVars,
      ...globalAliasVars,
      ...stateLayerVars,
      ...typographyVars,
    });

    document.documentElement.setAttribute('data-palette', theme.palette);
    document.documentElement.setAttribute('data-style', theme.style);
    document.documentElement.setAttribute('data-theme', styleName);
    document.documentElement.setAttribute('data-system-preset', systemPreset);
  }, [theme, tokenSet, styleName, systemPreset]);

  const setSystemPreset = (name: SystemPresetName) => {
    setSystemPresetState(name);
  };

  const value = {
    theme,
    selection,
    setPaletteSelection,
    styleName,
    setStyleName,
    palette,
    systemPreset,
    setSystemPreset,
    customSemanticPresets,
    addCustomSemanticPreset,
    updateCustomSemanticPreset,
    deleteCustomSemanticPreset,
    paletteDefinition,
    semanticMapping: appliedSettings?.semanticMapping ?? null,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
