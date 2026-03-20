import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import {
  getThemeVariables,
  getSystemColorVariables,
  comparisonPresets,
} from '@domain/constants';
import { fontFamily } from '@domain/tokens/global/typography';
import type { PaletteName, StyleName, SystemPresetName } from '@shared/@types/theme';
import type { NeutralPresetName } from '@domain/tokens/global/neutral-presets';

type FontKey = 'sans' | 'mono';

interface LayoutPreviewControlsContextValue {
  palette: PaletteName;
  systemPreset: SystemPresetName;
  neutralPreset: NeutralPresetName;
  style: StyleName;
  font: FontKey;
  setPalette: (v: PaletteName) => void;
  setSystemPreset: (v: SystemPresetName) => void;
  setNeutralPreset: (v: NeutralPresetName) => void;
  setStyle: (v: StyleName) => void;
  setFont: (v: FontKey) => void;
  themeVars: Record<string, string>;
  fontFamilyValue: string;
}

const LayoutPreviewControlsContext = createContext<LayoutPreviewControlsContextValue | null>(null);

export function LayoutPreviewControlsProvider({ children }: { children: ReactNode }) {
  const [palette, setPalette] = useState<PaletteName>(comparisonPresets.palettes[0]);
  const [systemPreset, setSystemPreset] = useState<SystemPresetName>(comparisonPresets.systemPresets[0]);
  const [neutralPreset, setNeutralPreset] = useState<NeutralPresetName>(comparisonPresets.neutralPresets[0]);
  const [style, setStyle] = useState<StyleName>(comparisonPresets.styles[0]);
  const [font, setFont] = useState<FontKey>('sans');

  const themeVars = useMemo(
    () => ({
      ...getThemeVariables(palette, style, neutralPreset),
      ...getSystemColorVariables(systemPreset),
    }),
    [palette, style, systemPreset, neutralPreset]
  );

  const fontFamilyValue = font === 'sans' ? fontFamily.sans : fontFamily.mono;

  const value: LayoutPreviewControlsContextValue = {
    palette,
    systemPreset,
    neutralPreset,
    style,
    font,
    setPalette,
    setSystemPreset,
    setNeutralPreset,
    setStyle,
    setFont,
    themeVars,
    fontFamilyValue,
  };

  return (
    <LayoutPreviewControlsContext.Provider value={value}>
      {children}
    </LayoutPreviewControlsContext.Provider>
  );
}

export function useLayoutPreviewControls() {
  const context = useContext(LayoutPreviewControlsContext);
  if (!context) {
    throw new Error('useLayoutPreviewControls must be used within LayoutPreviewControlsProvider');
  }
  return context;
}
