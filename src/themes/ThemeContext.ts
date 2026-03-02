/**
 * E03: Theme context - useTheme에서 소비
 * ThemeProvider와 분리하여 react-refresh/only-export-components 충족
 */
import { createContext } from 'react';
import type {
  Theme,
  ThemeName,
  StyleName,
  SystemPresetName,
} from '../@types/theme';
import type { ExternalPalette } from '../@types/tokens';
import type { CustomSemanticPreset } from '../constants/semantic-presets';
import type { PaletteDefinition, PaletteSelection } from '../palettes/types';

export interface ThemeContextValue {
  theme: Theme;
  /** @deprecated setStyleName 사용 */
  themeName: StyleName;
  /** @deprecated setStyleName 사용 */
  setThemeName: (name: ThemeName) => void;

  // ============================================================================
  // 새 API: PaletteSelection 기반
  // ============================================================================
  /** 현재 팔레트 선택 상태 */
  selection: PaletteSelection;
  /** 팔레트 선택 변경 (단일 API) */
  setPaletteSelection: (selection: PaletteSelection) => void;

  // ============================================================================
  // 하위 호환 API (deprecated)
  // ============================================================================
  /** @deprecated selection 사용 권장 */
  paletteName: string;
  styleName: StyleName;
  /** @deprecated setPaletteSelection 사용 권장 */
  setPaletteName: (name: string) => void;
  setStyleName: (name: StyleName) => void;
  /** @deprecated selection.type === 'custom' ? selection.colors : null */
  customColors: ExternalPalette | null;
  /** @deprecated setPaletteSelection({ type: 'custom', colors }) 사용 */
  setCustomColors: (colors: ExternalPalette | null) => void;
  palette: ExternalPalette;
  /** @deprecated setPaletteSelection({ type: 'custom', colors }) 사용 */
  setPalette: (palette: ExternalPalette) => void;

  systemPreset: SystemPresetName;
  setSystemPreset: (name: SystemPresetName) => void;

  /** 시맨틱 매핑 커스텀 프리셋 (localStorage) */
  customSemanticPresets: CustomSemanticPreset[];
  addCustomSemanticPreset: (preset: Omit<CustomSemanticPreset, 'id' | 'createdAt'>) => CustomSemanticPreset;
  updateCustomSemanticPreset: (id: string, updates: Partial<Pick<CustomSemanticPreset, 'semanticOverrides' | 'displayName'>>) => void;
  deleteCustomSemanticPreset: (id: string) => void;
  /** @deprecated setPaletteSelection({ type: 'custom-semantic', presetId }) 사용 */
  applyCustomSemanticPreset: (preset: CustomSemanticPreset) => void;

  /** 현재 적용된 팔레트 정의 (Overview 등에서 사용) */
  paletteDefinition: PaletteDefinition;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
