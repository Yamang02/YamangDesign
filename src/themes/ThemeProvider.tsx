/**
 * E03: Palette × Style 조합 기반 ThemeProvider
 */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import type {
  Theme,
  ThemeName,
  PaletteName,
  StyleName,
  SystemPresetName,
} from '../@types/theme';
import type { ExternalPalette } from '../@types/tokens';
import { flattenToCSSVars, injectCSSVariables } from '../utils/css';
import { combineTheme } from './combine';
import {
  palettePresets,
  stylePresets,
  toCustomPaletteDefinition,
} from './presets';
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

export interface ThemeContextValue {
  theme: Theme;
  /** @deprecated setStyleName 사용 */
  themeName: StyleName;
  /** @deprecated setStyleName 사용 */
  setThemeName: (name: ThemeName) => void;
  paletteName: PaletteName;
  styleName: StyleName;
  setPaletteName: (name: PaletteName) => void;
  setStyleName: (name: StyleName) => void;
  customColors: ExternalPalette | null;
  setCustomColors: (colors: ExternalPalette | null) => void;
  palette: ExternalPalette;
  setPalette: (palette: ExternalPalette) => void;
  /** E08: 시스템 컬러 프리셋 */
  systemPreset: SystemPresetName;
  setSystemPreset: (name: SystemPresetName) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: ReactNode;
  /** @deprecated initialStyleName 사용 */
  initialTheme?: ThemeName;
  initialStyleName?: StyleName;
  initialPaletteName?: PaletteName;
  initialPalette?: ExternalPalette;
  /** E08: 시스템 컬러 프리셋 (기본: 'default') */
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

  const setPaletteName = (name: PaletteName) => {
    setPaletteNameState(name);
    if (name !== 'custom') setCustomColorsState(null);
  };

  const setCustomColors = (colors: ExternalPalette | null) => {
    setCustomColorsState(colors);
    if (colors) setPaletteNameState('custom');
  };

  const setThemeName = (name: ThemeName) => {
    if (name === 'minimal' || name === 'neumorphism') {
      setStyleName(name);
    }
  };

  const paletteDefinition = useMemo(() => {
    if (customColors) return toCustomPaletteDefinition(customColors);
    const preset = palettePresets[paletteName as Exclude<PaletteName, 'custom'>];
    return preset ?? palettePresets.default;
  }, [paletteName, customColors]);

  const theme = useMemo(() => {
    const styleDef = stylePresets[styleName] ?? stylePresets.minimal;
    return combineTheme(paletteDefinition, styleDef);
  }, [paletteDefinition, styleName]);

  const palette: ExternalPalette = useMemo(() => {
    if (customColors) return customColors;
    const p = palettePresets[paletteName as Exclude<PaletteName, 'custom'>] ?? palettePresets.default;
    return p.colors as ExternalPalette;
  }, [customColors, paletteName]);

  const setPalette = (colors: ExternalPalette) => {
    setCustomColors(colors);
  };

  useEffect(() => {
    const themeCSSVars = flattenToCSSVars({
      color: theme.colors,
      shadow: theme.shadows,
      border: theme.border,
    });

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
      ...themeCSSVars,
      ...stateLayerVars,
      ...typographyVars,
      ...systemVars,
    });

    document.documentElement.setAttribute('data-palette', theme.palette);
    document.documentElement.setAttribute('data-style', theme.style);
    document.documentElement.setAttribute('data-theme', styleName);
    document.documentElement.setAttribute('data-system-preset', systemPreset);
  }, [theme, styleName, systemPreset]);

  const setSystemPreset = (name: SystemPresetName) => {
    setSystemPresetState(name);
  };

  const value: ThemeContextValue = {
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
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
