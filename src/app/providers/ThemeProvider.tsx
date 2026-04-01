/**
 * Palette × Style 조합 기반 ThemeProvider (앱 레이어).
 * UI·저장소·훅에 의존하는 부분은 domain ThemeContext와 분리한다.
 * @see docs/design/ARCHITECTURE.md — 레이어·테마
 */
import { useState, useLayoutEffect, useMemo, useCallback, type ReactNode } from 'react';
import type { StyleName, SystemPresetName } from '@shared/@types/theme';
import type { ColorInput } from '@shared/@types/tokens';
import type { PaletteSelection } from '@shared/types/palette-selection';
import { neutralPresets } from '@domain/tokens/global/neutral-presets';
import type { NeutralPresetName } from '@domain/tokens/global/neutral-presets';
import {
  savePaletteSelection,
  loadPaletteSelection,
  createPresetSelection,
  createCustomSelection,
} from '@app/state/palette-selection';
import { siteStyle } from '@app/config/site-style';
import { flattenToCSSVars, injectCSSVariables } from '@shared/utils/css';
import { getMergedMapping } from '@domain/palettes/mapping/resolve';
import { defaultSemanticMappings } from '@domain/palettes/strategies/default-mappings';
import type { StoredSettings } from '@app/components/GlobalSettings/types';
import { flattenTokenSet, buildThemeAndTokenSet } from '@domain/themes/token-set';
import { stylePresets } from '@domain/themes/presets';
import type { CustomThemePreset } from '@domain/constants/semantic-presets';
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
} from '@domain/tokens/global';
import { generateTextStyleVars } from '@domain/tokens/typography';
import { ThemeContext } from '@domain/themes/ThemeContext';

export type { ThemeContextValue } from '@domain/themes/ThemeContext';

function resolveInitialPaletteSelection(
  initialSelection: PaletteSelection | undefined,
  initialPalette: ColorInput | undefined,
  initialPaletteName: string | undefined,
): PaletteSelection {
  if (initialSelection) return initialSelection;
  if (initialPalette) return createCustomSelection(initialPalette);
  if (initialPaletteName) return createPresetSelection(initialPaletteName);
  return loadPaletteSelection() ?? createPresetSelection(siteStyle.defaults.palette);
}

export interface ThemeProviderProps {
  children: ReactNode;
  initialStyle?: StyleName;
  /** Legacy: initialStyle과 동일 의미 */
  initialTheme?: StyleName;
  initialStyleName?: StyleName;
  /** Legacy: initialSelection 또는 createPresetSelection으로 대체 */
  initialPaletteName?: string;
  /** Legacy: initialSelection(createCustomSelection(...))으로 대체 */
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
}: Readonly<ThemeProviderProps>) {
  const [styleName, setStyleName] = useState<StyleName>(initialStyleName);
  const [systemPreset, setSystemPresetState] = useState<SystemPresetName>(initialSystemPreset); // NOSONAR typescript:S6754 — 공개 setSystemPreset과 구분
  const [neutralPreset, setNeutralPresetState] = useState<NeutralPresetName>(appliedSettings?.neutralPreset ?? 'gray'); // NOSONAR typescript:S6754

  const [selection, setSelectionState] = useState<PaletteSelection>( // NOSONAR typescript:S6754
    () => resolveInitialPaletteSelection(initialSelection, initialPalette, initialPaletteName)
  );

  const {
    presets: customSemanticPresets,
    add: addCustomSemanticPresetInternal,
    update: updateCustomSemanticPreset,
    remove: removeCustomSemanticPresetInternal,
  } = useCustomThemePresets();

  const { definition: paletteDefinition, colors: palette } = usePaletteSelection(
    selection,
    customSemanticPresets
  );

  const definitionForTheme = useMemo(() => {
    const base = defaultSemanticMappings[paletteDefinition.bgStrategy];
    const withDef = getMergedMapping(base, paletteDefinition.semanticMapping);
    const merged = getMergedMapping(withDef, appliedSettings?.semanticMapping ?? undefined);
    return { ...paletteDefinition, semanticMapping: merged };
  }, [paletteDefinition, appliedSettings?.semanticMapping]);

  const [prevAppliedSettings, setPrevAppliedSettings] = useState(appliedSettings);
  if (prevAppliedSettings !== appliedSettings) {
    setPrevAppliedSettings(appliedSettings);
    if (appliedSettings?.palette) {
      setSelectionState(createCustomSelection(appliedSettings.palette));
    }
    if (appliedSettings?.neutralPreset) {
      setNeutralPresetState(appliedSettings.neutralPreset);
    }
  }

  const setPaletteSelection = useCallback((newSelection: PaletteSelection) => {
    setSelectionState(newSelection);
    savePaletteSelection(newSelection);
  }, []);

  const { theme, tokenSet } = useMemo(() => {
    const styleDef = stylePresets[styleName] ?? stylePresets.minimal;
    const neutralScale = neutralPresets[neutralPreset]?.scale;
    return buildThemeAndTokenSet(definitionForTheme, styleDef, { systemPreset, neutralPreset: neutralScale ? neutralPreset : undefined });
  }, [definitionForTheme, styleName, systemPreset, neutralPreset]);

  const addCustomSemanticPreset = useCallback(
    (preset: Omit<CustomThemePreset, 'id' | 'createdAt'>) => {
      return addCustomSemanticPresetInternal(preset);
    },
    [addCustomSemanticPresetInternal]
  );

  const deleteCustomSemanticPreset = useCallback(
    (id: string) => {
      removeCustomSemanticPresetInternal(id);
      if (selection.type === 'custom-semantic' && selection.presetId === id) {
        setPaletteSelection(createPresetSelection(siteStyle.defaults.palette));
      }
    },
    [selection, removeCustomSemanticPresetInternal, setPaletteSelection]
  );

  useLayoutEffect(() => {
    const paletteStyleVars = flattenTokenSet(tokenSet);

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

    document.documentElement.dataset.palette = theme.palette;
    document.documentElement.dataset.style = theme.style;
    document.documentElement.dataset.theme = styleName;
    document.documentElement.dataset.systemPreset = systemPreset;
  }, [theme, tokenSet, styleName, systemPreset]);

  const setSystemPreset = useCallback((name: SystemPresetName) => {
    setSystemPresetState(name);
  }, []);

  const setNeutralPreset = useCallback((name: NeutralPresetName) => {
    setNeutralPresetState(name);
  }, []);

  const semanticMapping = appliedSettings?.semanticMapping ?? null;

  const value = useMemo(() => ({
    theme,
    selection,
    setPaletteSelection,
    styleName,
    setStyleName,
    palette,
    systemPreset,
    setSystemPreset,
    neutralPreset,
    setNeutralPreset,
    customSemanticPresets,
    addCustomSemanticPreset,
    updateCustomSemanticPreset,
    deleteCustomSemanticPreset,
    paletteDefinition,
    semanticMapping,
  }), [
    theme, selection, setPaletteSelection, styleName, palette,
    systemPreset, setSystemPreset, neutralPreset, setNeutralPreset,
    customSemanticPresets, addCustomSemanticPreset, updateCustomSemanticPreset,
    deleteCustomSemanticPreset, paletteDefinition, semanticMapping,
  ]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
