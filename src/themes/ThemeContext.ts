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
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
