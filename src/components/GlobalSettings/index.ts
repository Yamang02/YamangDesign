/**
 * E03/P05: 전역 설정 — 모달 제거, useGlobalSettings·타입·스토리지 키만 노출
 */
export { useGlobalSettings } from './hooks/useGlobalSettings';
export type { StoredSettings, StoredPreset, StoredSettingsV1 } from './types';
export {
  GLOBAL_SETTINGS_STORAGE_KEY,
  GLOBAL_PRESETS_STORAGE_KEY,
  migrateV1ToV2,
  isStoredSettingsV1,
  normalizeStoredSettings,
} from './types';
