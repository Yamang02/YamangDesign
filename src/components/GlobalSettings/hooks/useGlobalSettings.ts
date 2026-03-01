/**
 * E03: 전역 설정 상태 관리 (Phase 1: palette, styleName, systemPreset)
 */
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useTheme } from '../../../themes';
import type { ExternalPalette } from '../../../@types/tokens';
import type { StyleName, SystemPresetName } from '../../../@types/theme';
import {
  GLOBAL_SETTINGS_STORAGE_KEY,
  GLOBAL_PRESETS_STORAGE_KEY,
  type StoredSettings,
  type StoredPreset,
  type StoredPresets,
} from '../types';

const DEFAULT_PALETTE: ExternalPalette = {
  primary: '#6366F1',
  secondary: '#8B5CF6',
  accent: '#F59E0B',
  neutral: '#E5E7EB',
};

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

function downloadJSON(data: object, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function pickJSONFile(): Promise<Partial<StoredSettings> | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) {
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const text = reader.result as string;
          const data = JSON.parse(text) as Partial<StoredSettings>;
          resolve(data);
        } catch {
          resolve(null);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  });
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

export function useGlobalSettings() {
  const {
    palette,
    styleName,
    systemPreset,
    setPalette,
    setStyleName,
    setSystemPreset,
  } = useTheme();

  const [localPalette, setLocalPalette] = useState<ExternalPalette>(palette);
  const [localStyleName, setLocalStyleName] = useState<StyleName>(styleName);
  const [localSystemPreset, setLocalSystemPreset] =
    useState<SystemPresetName>(systemPreset);

  // Sync local state when theme changes externally (e.g. from Playground)
  useEffect(() => {
    setLocalPalette(palette);
    setLocalStyleName(styleName);
    setLocalSystemPreset(systemPreset);
  }, [palette, styleName, systemPreset]);

  const hasChanges = useMemo(() => {
    return (
      JSON.stringify(localPalette) !== JSON.stringify(palette) ||
      localStyleName !== styleName ||
      localSystemPreset !== systemPreset
    );
  }, [localPalette, localStyleName, localSystemPreset, palette, styleName, systemPreset]);

  const apply = useCallback(() => {
    setPalette(localPalette);
    setStyleName(localStyleName);
    setSystemPreset(localSystemPreset);
    saveStoredSettings({
      version: STORAGE_VERSION,
      palette: localPalette,
      styleName: localStyleName,
      systemPreset: localSystemPreset,
    });
  }, [localPalette, localStyleName, localSystemPreset, setPalette, setStyleName, setSystemPreset]);

  const reset = useCallback(() => {
    setLocalPalette(DEFAULT_PALETTE);
    setLocalStyleName('minimal');
    setLocalSystemPreset('default');
  }, []);

  const exportSettings = useCallback(() => {
    const data: StoredSettings = {
      version: STORAGE_VERSION,
      palette: localPalette,
      styleName: localStyleName,
      systemPreset: localSystemPreset,
      updatedAt: new Date().toISOString(),
    };
    downloadJSON(data, 'yamang-design-settings.json');
  }, [localPalette, localStyleName, localSystemPreset]);

  const importSettings = useCallback(async () => {
    const data = await pickJSONFile();
    if (!data || !validateImportedSettings(data)) return;
    if (data.palette) setLocalPalette(data.palette as ExternalPalette);
    if (data.styleName) setLocalStyleName(data.styleName as StyleName);
    if (data.systemPreset) setLocalSystemPreset(data.systemPreset as SystemPresetName);
  }, []);

  const [userPresets, setUserPresets] = useState<StoredPreset[]>(() =>
    loadStoredPresets()
  );

  const saveAsPreset = useCallback(
    (name: string) => {
      const newPreset: StoredPreset = {
        id: generatePresetId(),
        name: name.trim() || 'Untitled',
        settings: {
          version: STORAGE_VERSION,
          palette: localPalette,
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
    [localPalette, localStyleName, localSystemPreset]
  );

  const loadUserPreset = useCallback((preset: StoredPreset) => {
    const s = preset.settings;
    if (s.palette) setLocalPalette(s.palette);
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

  return {
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
