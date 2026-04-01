/**
 * Theme context (`useTheme` 소비). ThemeProvider와 파일 분리(react-refresh/only-export-components).
 * 필드 그룹: PaletteSelection API, 스타일·시스템 프리셋, 하위 호환 `palette`, 시맨틱 매핑 오버라이드.
 */
import { createContext } from 'react';
import type {
  Theme,
  StyleName,
  SystemPresetName,
} from '@shared/@types/theme';
import type { ColorInput } from '@shared/@types/tokens';
import type { CustomThemePreset } from '../constants/semantic-presets';
import type { PaletteDefinition, SemanticMapping } from '../palettes/types';
import type { PaletteSelection } from '@shared/types/palette-selection';
import type { NeutralPresetName } from '../tokens/global/neutral-presets';

export interface ThemeContextValue {
  theme: Theme;

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

  neutralPreset: NeutralPresetName;
  setNeutralPreset: (name: NeutralPresetName) => void;

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
