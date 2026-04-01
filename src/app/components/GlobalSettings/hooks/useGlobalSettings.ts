/**
 * 전역 설정 UI용 훅: Theme의 selection·style·preset과 동기화되는 로컬 draft.
 * apply 시 Theme·design-settings 저장소·componentMapping blob을 갱신한다.
 * import/export·사용자 프리셋 CRUD 포함. `palette` 필드는 selection을 해석한 ColorInput(하위 호환).
 * @see docs/design/ARCHITECTURE.md — 레이어·설정 흐름
 */
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useTheme } from '@domain/themes';
import type { ColorInput } from '@shared/@types/tokens';
import type { StyleName, SystemPresetName } from '@shared/@types/theme';
import type { NeutralPresetName } from '@domain/tokens/global/neutral-presets';
import type { PaletteSelection } from '../../../state/types';
import {
  createPresetSelection,
  createCustomSelection,
  isPaletteSelectionEqual,
} from '../../../state/palette-selection';
import { resolveSelection } from '../../../hooks/usePaletteResolution';
import type { CustomThemePreset } from '@domain/constants/semantic-presets';
import type { SemanticMapping } from '@domain/palettes/types';
import { palettePresets } from '@domain/themes/presets';
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
} from '@app/infra/export';
import {
  loadComponentMappingOverrides,
  saveComponentMappingOverrides,
} from '@app/infra/storage';

const DEFAULT_PALETTE: ColorInput = { ...palettePresets.default.colors };

const DEFAULT_SELECTION: PaletteSelection = createCustomSelection(DEFAULT_PALETTE);

const STORAGE_VERSION = '2.0' as const;

function parseRawSettings(raw: string): Partial<StoredSettings> | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (isStoredSettingsV1(parsed)) {
      return migrateV1ToV2(parsed);
    }
    if (validateImportedSettings(parsed)) {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function saveDesignSystemBlob(
  settings: Omit<StoredSettings, 'updatedAt'>,
  componentMapping: import('@app/infra/storage').ComponentMappingOverrides | null
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
    neutralPreset,
    setNeutralPreset,
    semanticMapping: themeSemanticMapping,
    customSemanticPresets,
  } = useTheme();

  const [localSelection, setLocalSelection] = useState<PaletteSelection>(selection);
  const [localStyleName, setLocalStyleName] = useState<StyleName>(styleName);
  const [localSystemPreset, setLocalSystemPreset] =
    useState<SystemPresetName>(systemPreset);
  const [localNeutralPreset, setLocalNeutralPreset] = useState<NeutralPresetName>(neutralPreset);
  const [localSemanticMapping, setLocalSemanticMapping] = useState<Partial<SemanticMapping> | null>(
    themeSemanticMapping ?? null
  );

  const semanticPresets = customSemanticPresets ?? EMPTY_SEMANTIC_PRESETS;

  useEffect(() => {
    queueMicrotask(() => {
      setLocalSelection(selection);
      setLocalStyleName(styleName);
      setLocalSystemPreset(systemPreset);
      setLocalNeutralPreset(neutralPreset);
      setLocalSemanticMapping(themeSemanticMapping ?? null);
    });
  }, [selection, styleName, systemPreset, neutralPreset, themeSemanticMapping]);

  const hasChanges = useMemo(() => {
    const mappingEqual =
      (localSemanticMapping == null && themeSemanticMapping == null) ||
      JSON.stringify(localSemanticMapping ?? {}) === JSON.stringify(themeSemanticMapping ?? {});
    return (
      !isPaletteSelectionEqual(localSelection, selection) ||
      localStyleName !== styleName ||
      localSystemPreset !== systemPreset ||
      localNeutralPreset !== neutralPreset ||
      !mappingEqual
    );
  }, [localSelection, localStyleName, localSystemPreset, localNeutralPreset, localSemanticMapping, selection, styleName, systemPreset, neutralPreset, themeSemanticMapping]);

  const getDraft = useCallback((): StoredSettings => {
    const paletteForStorage = resolvePaletteFromSelection(localSelection, semanticPresets);
    return {
      version: '2.0',
      palette: paletteForStorage,
      palettePresetId: localSelection.type === 'preset' ? localSelection.presetId : undefined,
      semanticMapping: localSemanticMapping ?? null,
      styleName: localStyleName,
      systemPreset: localSystemPreset,
      neutralPreset: localNeutralPreset,
      updatedAt: new Date().toISOString(),
    };
  }, [localSelection, localSemanticMapping, localStyleName, localSystemPreset, localNeutralPreset, semanticPresets]);

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
    if (localNeutralPreset !== neutralPreset) {
      setNeutralPreset(localNeutralPreset);
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
        neutralPreset: draft.neutralPreset,
      },
      componentMapping
    );
    options?.onApply?.(draft);
  }, [localSelection, localStyleName, localSystemPreset, localNeutralPreset, selection, styleName, systemPreset, neutralPreset, setPaletteSelection, setStyleName, setSystemPreset, setNeutralPreset, getDraft, options]);

  const reset = useCallback(() => {
    setLocalSelection(DEFAULT_SELECTION);
    setLocalStyleName('minimal');
    setLocalSystemPreset('default');
    setLocalNeutralPreset('gray');
    setLocalSemanticMapping(null);
  }, []);

  const exportSettings = useCallback(() => {
    const payload = createGlobalSettingsPayload(getDraft(), {
      componentMapping: loadComponentMappingOverrides() ?? undefined,
    });
    downloadYamangJSON(payload, YAMANG_FILENAMES.GLOBAL_SETTINGS);
  }, [getDraft]);

  const importSettings = useCallback(async () => {
    const raw = await pickYamangJSONFile();
    if (!raw) return;
    const payload = parseYamangJSON(raw);
    let data: Partial<StoredSettings> | null = payload ? extractGlobalSettings(payload) : null;
    data ??= parseRawSettings(raw);
    if (!data || !validateImportedSettings(data)) {
      globalThis.alert(getImportErrorMessage('global-settings', payload));
      return;
    }
    if (data.palette) {
      setLocalSelection(createCustomSelection(data.palette));
    }
    if (data.styleName) setLocalStyleName(data.styleName);
    if (data.systemPreset) setLocalSystemPreset(data.systemPreset);
    if (data.neutralPreset) setLocalNeutralPreset(data.neutralPreset);
    if (data.semanticMapping !== undefined) {
      setLocalSemanticMapping(data.semanticMapping ?? null);
    }
    const componentMapping = payload ? extractComponentMapping(payload) : null;
    if (componentMapping && Object.keys(componentMapping).length > 0) {
      saveComponentMappingOverrides(componentMapping);
    }
  }, []);

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
    if (s.neutralPreset) setLocalNeutralPreset(s.neutralPreset);
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

  const localPalette = useMemo(
    () => resolvePaletteFromSelection(localSelection, semanticPresets),
    [localSelection, semanticPresets]
  );

  const setLocalPalette = useCallback((colors: ColorInput) => {
    setLocalSelection(createCustomSelection(colors));
  }, []);

  const selectPreset = useCallback((presetId: string) => {
    const def = resolveSelection(createPresetSelection(presetId), semanticPresets);
    setLocalSelection(createCustomSelection(def.colors));
  }, [semanticPresets]);

  return {
    selection: localSelection,
    setSelection: setLocalSelection,
    selectPreset,
    semanticMapping: localSemanticMapping,
    setSemanticMapping: setLocalSemanticMapping,
    getDraft,
    palette: localPalette,
    styleName: localStyleName,
    systemPreset: localSystemPreset,
    setPalette: setLocalPalette,
    setStyleName: setLocalStyleName,
    setSystemPreset: setLocalSystemPreset,
    neutralPreset: localNeutralPreset,
    setNeutralPreset: setLocalNeutralPreset,
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
