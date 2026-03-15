/**
 * E03: 전역 설정 상태 관리 (Phase 1: palette, styleName, systemPreset)
 * PaletteSelection 기반으로 마이그레이션
 */
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useTheme } from '../../../themes';
import type { ColorInput } from '../../../@types/tokens';
import type { StyleName, SystemPresetName } from '../../../@types/theme';
import type { PaletteSelection } from '../../../state/types';
import {
  createPresetSelection,
  createCustomSelection,
  isPaletteSelectionEqual,
} from '../../../state/palette-selection';
import { resolveSelection } from '../../../hooks/usePaletteResolution';
import type { CustomThemePreset } from '../../../constants/semantic-presets';
import type { SemanticMapping } from '../../../palettes/types';
import {
  GLOBAL_SETTINGS_STORAGE_KEY,
  GLOBAL_PRESETS_STORAGE_KEY,
  migrateV1ToV2,
  isStoredSettingsV1,
  type StoredSettings,
  type StoredPreset,
  type StoredPresets,
} from '../types';
import {
  downloadYamangJSON,
  createGlobalSettingsPayload,
  parseYamangJSON,
  extractGlobalSettings,
  extractComponentMapping,
  pickYamangJSONFile,
  YAMANG_FILENAMES,
  getImportErrorMessage,
} from '../../../utils/yamang-export';
import {
  loadComponentMappingOverrides,
  saveComponentMappingOverrides,
} from '../../../utils/component-mapping-storage';

const DEFAULT_PALETTE: ColorInput = {
  primary: '#6366F1',
  secondary: '#8B5CF6',
  accent: '#F59E0B',
  neutral: '#E5E7EB',
};

const DEFAULT_SELECTION: PaletteSelection = createCustomSelection(DEFAULT_PALETTE);

const STORAGE_VERSION = '2.0' as const;

/** P08: design-settings 한 덩어리 (설정 + componentMapping) */
function saveDesignSystemBlob(
  settings: Omit<StoredSettings, 'updatedAt'>,
  componentMapping: import('../../../utils/component-mapping-storage').ComponentMappingOverrides | null
): void {
  const toSave = {
    ...settings,
    updatedAt: new Date().toISOString(),
    ...(componentMapping && Object.keys(componentMapping).length > 0 ? { componentMapping } : {}),
  };
  localStorage.setItem(GLOBAL_SETTINGS_STORAGE_KEY, JSON.stringify(toSave));
}

function loadStoredPresets(): StoredPreset[] {
  try {
    const raw = localStorage.getItem(GLOBAL_PRESETS_STORAGE_KEY);
    if (!raw) return [];
    const data: StoredPresets = JSON.parse(raw);
    if (!data.presets || !Array.isArray(data.presets)) return [];
    return data.presets.map((p) => ({
      ...p,
      settings: isStoredSettingsV1(p.settings as unknown)
        ? migrateV1ToV2(p.settings as unknown as import('../types').StoredSettingsV1)
        : p.settings,
    }));
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
    (o.systemPreset == null || typeof o.systemPreset === 'string') &&
    (o.semanticMapping == null || (typeof o.semanticMapping === 'object'))
  );
}

const EMPTY_SEMANTIC_PRESETS: CustomThemePreset[] = [];

/** P08: selection을 해석해 항상 실제 팔레트 색상 반환 (preset이면 preset colors) */
function resolvePaletteFromSelection(
  selection: PaletteSelection,
  customSemanticPresets: CustomThemePreset[]
): ColorInput {
  const resolved = resolveSelection(selection, customSemanticPresets);
  return resolved.colors;
}

export function useGlobalSettings(options?: { onApply?: (draft: StoredSettings) => void }) {
  const {
    selection,
    setPaletteSelection,
    styleName,
    systemPreset,
    setStyleName,
    setSystemPreset,
    semanticMapping: themeSemanticMapping,
    customSemanticPresets,
  } = useTheme();

  // 로컬 상태 (설정 페이지 draft)
  const [localSelection, setLocalSelection] = useState<PaletteSelection>(selection);
  const [localStyleName, setLocalStyleName] = useState<StyleName>(styleName);
  const [localSystemPreset, setLocalSystemPreset] =
    useState<SystemPresetName>(systemPreset);
  const [localSemanticMapping, setLocalSemanticMapping] = useState<Partial<SemanticMapping> | null>(
    themeSemanticMapping ?? null
  );

  const semanticPresets = customSemanticPresets ?? EMPTY_SEMANTIC_PRESETS;

  // 전역 상태가 바뀌면 로컬 상태 동기화
  useEffect(() => {
    queueMicrotask(() => {
      setLocalSelection(selection);
      setLocalStyleName(styleName);
      setLocalSystemPreset(systemPreset);
      setLocalSemanticMapping(themeSemanticMapping ?? null);
    });
  }, [selection, styleName, systemPreset, themeSemanticMapping]);

  // 변경 여부 확인
  const hasChanges = useMemo(() => {
    const mappingEqual =
      (localSemanticMapping == null && themeSemanticMapping == null) ||
      JSON.stringify(localSemanticMapping ?? {}) === JSON.stringify(themeSemanticMapping ?? {});
    return (
      !isPaletteSelectionEqual(localSelection, selection) ||
      localStyleName !== styleName ||
      localSystemPreset !== systemPreset ||
      !mappingEqual
    );
  }, [localSelection, localStyleName, localSystemPreset, localSemanticMapping, selection, styleName, systemPreset, themeSemanticMapping]);

  /** 현재 draft를 StoredSettings v2로 반환 (P08: 저장 시 palette만 사용, palettePresetId 미저장) */
  const getDraft = useCallback((): StoredSettings => {
    const paletteForStorage = resolvePaletteFromSelection(localSelection, semanticPresets);
    return {
      version: '2.0',
      palette: paletteForStorage,
      palettePresetId: localSelection.type === 'preset' ? localSelection.presetId : undefined,
      semanticMapping: localSemanticMapping ?? null,
      styleName: localStyleName,
      systemPreset: localSystemPreset,
      updatedAt: new Date().toISOString(),
    };
  }, [localSelection, localSemanticMapping, localStyleName, localSystemPreset, semanticPresets]);

  // 적용: 전역 상태 + storage 반영 후 onApply 콜백
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
    const draft = getDraft();
    const componentMapping = loadComponentMappingOverrides();
    saveDesignSystemBlob(
      {
        version: '2.0',
        palette: draft.palette,
        palettePresetId: undefined,
        semanticMapping: draft.semanticMapping,
        styleName: draft.styleName,
        systemPreset: draft.systemPreset,
      },
      componentMapping
    );
    options?.onApply?.(draft);
  }, [localSelection, localStyleName, localSystemPreset, localSemanticMapping, selection, styleName, systemPreset, setPaletteSelection, setStyleName, setSystemPreset, getDraft, options]);

  // 초기화
  const reset = useCallback(() => {
    setLocalSelection(DEFAULT_SELECTION);
    setLocalStyleName('minimal');
    setLocalSystemPreset('default');
    setLocalSemanticMapping(null);
  }, []);

  // 내보내기 (P06: 컴포넌트 매핑 오버라이드 포함)
  const exportSettings = useCallback(() => {
    const payload = createGlobalSettingsPayload(getDraft(), {
      componentMapping: loadComponentMappingOverrides() ?? undefined,
    });
    downloadYamangJSON(payload, YAMANG_FILENAMES.GLOBAL_SETTINGS);
  }, [getDraft]);

  // 가져오기 (P06: 컴포넌트 매핑 오버라이드 복원)
  const importSettings = useCallback(async () => {
    const raw = await pickYamangJSONFile();
    if (!raw) return;
    const payload = parseYamangJSON(raw);
    let data: Partial<StoredSettings> | null = payload ? extractGlobalSettings(payload) : null;
    if (!data) {
      try {
        const parsed = JSON.parse(raw) as unknown;
        if (isStoredSettingsV1(parsed)) {
          data = migrateV1ToV2(parsed);
        } else if (validateImportedSettings(parsed)) {
          data = parsed as Partial<StoredSettings>;
        }
      } catch {
        /* ignore */
      }
    }
    if (!data || !validateImportedSettings(data)) {
      window.alert(getImportErrorMessage('global-settings', payload));
      return;
    }
    if (data.palette) {
      setLocalSelection(createCustomSelection(data.palette as ColorInput));
    }
    if (data.styleName) setLocalStyleName(data.styleName as StyleName);
    if (data.systemPreset) setLocalSystemPreset(data.systemPreset as SystemPresetName);
    if (data.semanticMapping !== undefined) {
      setLocalSemanticMapping(data.semanticMapping ?? null);
    }
    const componentMapping = payload ? extractComponentMapping(payload) : null;
    if (componentMapping && Object.keys(componentMapping).length > 0) {
      saveComponentMappingOverrides(componentMapping);
    }
  }, []);

  // 사용자 프리셋 관리
  const [userPresets, setUserPresets] = useState<StoredPreset[]>(() =>
    loadStoredPresets()
  );

  const saveAsPreset = useCallback(
    (name: string) => {
      const draft = getDraft();
      const newPreset: StoredPreset = {
        id: generatePresetId(),
        name: name.trim() || 'Untitled',
        settings: {
          version: '2.0',
          palette: draft.palette,
          palettePresetId: draft.palettePresetId,
          semanticMapping: draft.semanticMapping,
          styleName: draft.styleName,
          systemPreset: draft.systemPreset,
        },
        createdAt: new Date().toISOString(),
      };
      setUserPresets((prev) => {
        const next = [...prev, newPreset];
        saveStoredPresets(next);
        return next;
      });
    },
    [getDraft]
  );

  const loadUserPreset = useCallback((preset: StoredPreset) => {
    const s = isStoredSettingsV1(preset.settings as unknown)
      ? migrateV1ToV2(preset.settings as unknown as import('../types').StoredSettingsV1)
      : preset.settings;
    if (s.palette) {
      setLocalSelection(createCustomSelection(s.palette));
    }
    if (s.styleName) setLocalStyleName(s.styleName);
    if (s.systemPreset) setLocalSystemPreset(s.systemPreset);
    if (s.semanticMapping !== undefined) {
      setLocalSemanticMapping(s.semanticMapping ?? null);
    }
  }, []);

  const deleteUserPreset = useCallback((id: string) => {
    setUserPresets((prev) => {
      const next = prev.filter((p) => p.id !== id);
      saveStoredPresets(next);
      return next;
    });
  }, []);

  // ============================================================================
  // 하위 호환: palette(ColorInput) — P08: preset 선택 시에도 해석된 colors 사용
  // ============================================================================
  const localPalette = useMemo(
    () => resolvePaletteFromSelection(localSelection, semanticPresets),
    [localSelection, semanticPresets]
  );

  const setLocalPalette = useCallback((colors: ColorInput) => {
    setLocalSelection(createCustomSelection(colors));
  }, []);

  /** 프리셋 선택 (P08: 선택 시 palette에 복사해 항상 custom처럼 동작, 좌측 팔레트 갱신) */
  const selectPreset = useCallback((presetId: string) => {
    const def = resolveSelection(createPresetSelection(presetId), semanticPresets);
    setLocalSelection(createCustomSelection(def.colors));
  }, [semanticPresets]);

  return {
    // 새 API
    selection: localSelection,
    setSelection: setLocalSelection,
    selectPreset,
    semanticMapping: localSemanticMapping,
    setSemanticMapping: setLocalSemanticMapping,
    getDraft,
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
