/**
 * E03: 전역 설정 모달 타입
 */
import type { ExternalPalette } from '../../@types/tokens';
import type { StyleName, SystemPresetName } from '../../@types/theme';

export const GLOBAL_SETTINGS_STORAGE_KEY = 'yamang-design-settings';
export const GLOBAL_PRESETS_STORAGE_KEY = 'yamang-design-presets';

export interface StoredSettings {
  version: string;
  palette: ExternalPalette;
  styleName: StyleName;
  systemPreset: SystemPresetName;
  updatedAt: string;
}

export interface StoredPreset {
  id: string;
  name: string;
  settings: Omit<StoredSettings, 'updatedAt'>;
  createdAt: string;
}

export interface StoredPresets {
  version: string;
  presets: StoredPreset[];
}
