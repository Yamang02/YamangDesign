/**
 * E03: 전역 설정 모달 타입
 * P05: v2 — semanticMapping, palettePresetId 추가
 * P08: styleName 보정, palettePresetId는 저장하지 않음(호환용으로 타입만 유지)
 */
import type { ColorInput } from '@shared/@types/tokens';
import type { StyleName, SystemPresetName } from '@shared/@types/theme';
import type { SemanticMapping } from '@domain/palettes/types';
import type { NeutralPresetName } from '@domain/tokens/global/neutral-presets';

const VALID_STYLE_NAMES: StyleName[] = ['minimal', 'neumorphism', 'brutalism', 'glassmorphism'];
function normalizeStyleName(v: unknown): StyleName {
  if (typeof v === 'string' && VALID_STYLE_NAMES.includes(v as StyleName)) return v as StyleName;
  return 'minimal';
}

export const GLOBAL_SETTINGS_STORAGE_KEY = 'yamang-design-settings';
export const GLOBAL_PRESETS_STORAGE_KEY = 'yamang-design-presets';

/** v1 스키마 (마이그레이션용) */
export interface StoredSettingsV1 {
  version: '1.0';
  palette: ColorInput;
  styleName: StyleName;
  systemPreset: SystemPresetName;
  updatedAt?: string;
}

export interface StoredSettings {
  version: '2.0';
  palette: ColorInput;
  palettePresetId?: string;
  semanticMapping: Partial<SemanticMapping> | null;
  styleName: StyleName;
  systemPreset: SystemPresetName;
  neutralPreset?: NeutralPresetName;
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

/** v1 → v2 마이그레이션 (누락 필드 기본값, P08: styleName 보정) */
export function migrateV1ToV2(v1: StoredSettingsV1): StoredSettings {
  return {
    version: '2.0',
    palette: v1.palette,
    palettePresetId: undefined,
    semanticMapping: null,
    styleName: normalizeStyleName(v1.styleName),
    systemPreset: v1.systemPreset,
    updatedAt: v1.updatedAt ?? new Date().toISOString(),
  };
}

/** P08: 로드된 설정에서 styleName 보정 (undefined/비유효 시 minimal) */
export function normalizeStoredSettings(s: Partial<StoredSettings> | null): Partial<StoredSettings> | null {
  if (!s || typeof s !== 'object') return s;
  if (s.styleName !== undefined) (s as StoredSettings).styleName = normalizeStyleName(s.styleName);
  return s;
}

export function isStoredSettingsV1(
  data: unknown
): data is StoredSettingsV1 {
  if (!data || typeof data !== 'object') return false;
  const o = data as Record<string, unknown>;
  return o.version === '1.0';
}
