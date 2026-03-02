/**
 * E03: 전역 설정 상태 관리 (Phase 1: palette, styleName, systemPreset)
 * PaletteSelection 기반으로 마이그레이션
 */
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useTheme } from '../../../themes';
import type { ExternalPalette } from '../../../@types/tokens';
import type { StyleName, SystemPresetName } from '../../../@types/theme';
import type { PaletteSelection } from '../../../palettes/types';
import {
  createPresetSelection,
  createCustomSelection,
  isPaletteSelectionEqual,
} from '../../../utils/palette-selection';
import {
  GLOBAL_SETTINGS_STORAGE_KEY,
  GLOBAL_PRESETS_STORAGE_KEY,
  type StoredSettings,
  type StoredPreset,
  type StoredPresets,
} from '../types';
import {
  downloadYamangJSON,
  createGlobalSettingsPayload,
  parseYamangJSON,
  extractGlobalSettings,
  pickYamangJSONFile,
  YAMANG_FILENAMES,
  getImportErrorMessage,
} from '../../../utils/yamang-export';

const DEFAULT_PALETTE: ExternalPalette = {
  primary: '#6366F1',
  secondary: '#8B5CF6',
  accent: '#F59E0B',
  neutral: '#E5E7EB',
};

const DEFAULT_SELECTION: PaletteSelection = createCustomSelection(DEFAULT_PALETTE);

const STORAGE_VERSION = '1.0';

function saveStoredSettings(settings: Omit<StoredSettings, 'updatedAt'>): void {
  const toSave: StoredSettings = {
    ...settings,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(GLOBAL_SETTINGS_STORAGE_KEY, JSON.stringify(toSave));
}

function loadStoredPresets(): StoredPreset[] {
  try {
    const raw = localStorage.getItem(GLOBAL_PRESETS_STORAGE_KEY);
    if (!raw) return [];
    const data: StoredPresets = JSON.parse(raw);
    if (!data.presets || !Array.isArray(data.presets)) return [];
    return data.presets;
  } catch {
    return [];
  }
}

function saveStoredPresets(presets: StoredPreset[]): void {
  const data: StoredPresets = {
    version: STORAGE_VERSION,
    presets,
  };
  localStorage.setItem(GLOBAL_PRESETS_STORAGE_KEY, JSON.stringify(data));
}

function generatePresetId(): string {
  return `preset-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function validateImportedSettings(data: unknown): data is Partial<StoredSettings> {
  if (!data || typeof data !== 'object') return false;
  const o = data as Record<string, unknown>;
  return (
    (o.palette == null || (typeof o.palette === 'object' && o.palette !== null)) &&
    (o.styleName == null || typeof o.styleName === 'string') &&
    (o.systemPreset == null || typeof o.systemPreset === 'string')
  );
}

/** selection에서 palette 추출 (custom일 때만 colors 반환) */
function extractPaletteFromSelection(selection: PaletteSelection): ExternalPalette {
  return selection.type === 'custom' ? selection.colors : DEFAULT_PALETTE;
}

export function useGlobalSettings() {
  const {
    selection,
    setPaletteSelection,
    styleName,
    systemPreset,
    setStyleName,
    setSystemPreset,
  } = useTheme();

  // 로컬 상태 (모달 내에서 편집용)
  const [localSelection, setLocalSelection] = useState<PaletteSelection>(selection);
  const [localStyleName, setLocalStyleName] = useState<StyleName>(styleName);
  const [localSystemPreset, setLocalSystemPreset] =
    useState<SystemPresetName>(systemPreset);

  // 전역 상태가 바뀌면 로컬 상태 동기화
  useEffect(() => {
    queueMicrotask(() => {
      setLocalSelection(selection);
      setLocalStyleName(styleName);
      setLocalSystemPreset(systemPreset);
    });
  }, [selection, styleName, systemPreset]);

  // 변경 여부 확인
  const hasChanges = useMemo(() => {
    return (
      !isPaletteSelectionEqual(localSelection, selection) ||
      localStyleName !== styleName ||
      localSystemPreset !== systemPreset
    );
  }, [localSelection, localStyleName, localSystemPreset, selection, styleName, systemPreset]);

  // 적용: 전역 상태에 반영
  const apply = useCallback(() => {
    if (!isPaletteSelectionEqual(localSelection, selection)) {
      setPaletteSelection(localSelection);
    }
    if (localStyleName !== styleName) {
      setStyleName(localStyleName);
    }
    if (localSystemPreset !== systemPreset) {
      setSystemPreset(localSystemPreset);
    }
    // legacy storage 호환
    const paletteForStorage = extractPaletteFromSelection(localSelection);
    saveStoredSettings({
      version: STORAGE_VERSION,
      palette: paletteForStorage,
      styleName: localStyleName,
      systemPreset: localSystemPreset,
    });
  }, [localSelection, localStyleName, localSystemPreset, selection, styleName, systemPreset, setPaletteSelection, setStyleName, setSystemPreset]);

  // 초기화
  const reset = useCallback(() => {
    setLocalSelection(DEFAULT_SELECTION);
    setLocalStyleName('minimal');
    setLocalSystemPreset('default');
  }, []);

  // 내보내기
  const exportSettings = useCallback(() => {
    const paletteForExport = extractPaletteFromSelection(localSelection);
    const settings: StoredSettings = {
      version: STORAGE_VERSION,
      palette: paletteForExport,
      styleName: localStyleName,
      systemPreset: localSystemPreset,
      updatedAt: new Date().toISOString(),
    };
    const payload = createGlobalSettingsPayload(settings);
    downloadYamangJSON(payload, YAMANG_FILENAMES.GLOBAL_SETTINGS);
  }, [localSelection, localStyleName, localSystemPreset]);

  // 가져오기
  const importSettings = useCallback(async () => {
    const raw = await pickYamangJSONFile();
    if (!raw) return;
    const payload = parseYamangJSON(raw);
    let data: Partial<StoredSettings> | null = payload ? extractGlobalSettings(payload) : null;
    if (!data) {
      try {
        const legacy = JSON.parse(raw) as Partial<StoredSettings>;
        if (validateImportedSettings(legacy)) data = legacy;
      } catch {
        /* ignore */
      }
    }
    if (!data || !validateImportedSettings(data)) {
      window.alert(getImportErrorMessage('global-settings', payload));
      return;
    }
    if (data.palette) {
      setLocalSelection(createCustomSelection(data.palette as ExternalPalette));
    }
    if (data.styleName) setLocalStyleName(data.styleName as StyleName);
    if (data.systemPreset) setLocalSystemPreset(data.systemPreset as SystemPresetName);
  }, []);

  // 사용자 프리셋 관리
  const [userPresets, setUserPresets] = useState<StoredPreset[]>(() =>
    loadStoredPresets()
  );

  const saveAsPreset = useCallback(
    (name: string) => {
      const paletteForPreset = extractPaletteFromSelection(localSelection);
      const newPreset: StoredPreset = {
        id: generatePresetId(),
        name: name.trim() || 'Untitled',
        settings: {
          version: STORAGE_VERSION,
          palette: paletteForPreset,
          styleName: localStyleName,
          systemPreset: localSystemPreset,
        },
        createdAt: new Date().toISOString(),
      };
      setUserPresets((prev) => {
        const next = [...prev, newPreset];
        saveStoredPresets(next);
        return next;
      });
    },
    [localSelection, localStyleName, localSystemPreset]
  );

  const loadUserPreset = useCallback((preset: StoredPreset) => {
    const s = preset.settings;
    if (s.palette) {
      setLocalSelection(createCustomSelection(s.palette));
    }
    if (s.styleName) setLocalStyleName(s.styleName);
    if (s.systemPreset) setLocalSystemPreset(s.systemPreset);
  }, []);

  const deleteUserPreset = useCallback((id: string) => {
    setUserPresets((prev) => {
      const next = prev.filter((p) => p.id !== id);
      saveStoredPresets(next);
      return next;
    });
  }, []);

  // ============================================================================
  // 하위 호환: palette(ExternalPalette) 인터페이스 유지
  // ============================================================================
  const localPalette = useMemo(() => extractPaletteFromSelection(localSelection), [localSelection]);

  const setLocalPalette = useCallback((colors: ExternalPalette) => {
    setLocalSelection(createCustomSelection(colors));
  }, []);

  /** 프리셋 선택 (새 API) */
  const selectPreset = useCallback((presetId: string) => {
    setLocalSelection(createPresetSelection(presetId));
  }, []);

  return {
    // 새 API
    selection: localSelection,
    setSelection: setLocalSelection,
    selectPreset,
    // 하위 호환 API
    palette: localPalette,
    styleName: localStyleName,
    systemPreset: localSystemPreset,
    setPalette: setLocalPalette,
    setStyleName: setLocalStyleName,
    setSystemPreset: setLocalSystemPreset,
    hasChanges,
    apply,
    reset,
    exportSettings,
    importSettings,
    userPresets,
    saveAsPreset,
    loadUserPreset,
    deleteUserPreset,
  };
}
