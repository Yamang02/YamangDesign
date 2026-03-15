/**
 * E03: Theme context - useTheme에서 소비
 * ThemeProvider와 분리하여 react-refresh/only-export-components 충족
 */
import { createContext } from 'react';
import type {
  Theme,
  StyleName,
  SystemPresetName,
} from '../@types/theme';
import type { ColorInput } from '../@types/tokens';
import type { CustomThemePreset } from '../constants/semantic-presets';
import type { PaletteDefinition, SemanticMapping } from '../palettes/types';
import type { PaletteSelection } from '../state/types';

export interface ThemeContextValue {
  theme: Theme;

  // ============================================================================
  // 새 API: PaletteSelection 기반
  // ============================================================================
  /** 현재 팔레트 선택 상태 */
  selection: PaletteSelection;
  /** 팔레트 선택 변경 (단일 API) */
  setPaletteSelection: (selection: PaletteSelection) => void;

  styleName: StyleName;
  setStyleName: (name: StyleName) => void;

  /** 하위 호환: 해석된 색상 (ColorInput). 직접 색상이 필요한 경우 사용 */
  palette: ColorInput;

  systemPreset: SystemPresetName;
  setSystemPreset: (name: SystemPresetName) => void;

  /** 커스텀 테마 프리셋 (localStorage) */
  customSemanticPresets: CustomThemePreset[];
  addCustomSemanticPreset: (preset: Omit<CustomThemePreset, 'id' | 'createdAt'>) => CustomThemePreset;
  updateCustomSemanticPreset: (id: string, updates: Partial<Pick<CustomThemePreset, 'semanticOverrides' | 'displayName'>>) => void;
  deleteCustomSemanticPreset: (id: string) => void;

  /** 현재 적용된 팔레트 정의 (Overview 등에서 사용) */
  paletteDefinition: PaletteDefinition;

  /** P05: 전역 시맨틱 매핑 오버라이드 (설정 페이지 적용분) */
  semanticMapping: Partial<SemanticMapping> | null;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
