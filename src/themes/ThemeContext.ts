/**
 * E03: Theme context - useTheme에서 소비
 * ThemeProvider와 분리하여 react-refresh/only-export-components 충족
 */
import { createContext } from 'react';
import type {
  Theme,
  ThemeName,
  PaletteName,
  StyleName,
  SystemPresetName,
} from '../@types/theme';
import type { ExternalPalette } from '../@types/tokens';
import type { CustomSemanticPreset } from '../constants/semantic-presets';
import type { PaletteDefinition } from '../palettes/types';

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
  systemPreset: SystemPresetName;
  setSystemPreset: (name: SystemPresetName) => void;
  /** 시맨틱 매핑 커스텀 프리셋 (localStorage) */
  customSemanticPresets: CustomSemanticPreset[];
  addCustomSemanticPreset: (preset: Omit<CustomSemanticPreset, 'id' | 'createdAt'>) => CustomSemanticPreset;
  updateCustomSemanticPreset: (id: string, updates: Partial<Pick<CustomSemanticPreset, 'semanticOverrides' | 'displayName'>>) => void;
  deleteCustomSemanticPreset: (id: string) => void;
  applyCustomSemanticPreset: (preset: CustomSemanticPreset) => void;
  /** 현재 적용된 팔레트 정의 (Overview 등에서 사용) */
  paletteDefinition: PaletteDefinition;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
