import { useState, useEffect, useCallback, useMemo } from 'react';
import type { PalettePreset, PalettePresetsStorage } from '@shared/@types/palette';
import type { ColorInput } from '@shared/@types/tokens';
import { colorStartPoints } from '@domain/constants/palette-definitions';

const STORAGE_KEY = 'yamang-palette-presets';
const STORAGE_VERSION = 1;

const defaultPresets: PalettePreset[] = Object.entries(colorStartPoints).map(
  ([id, palette]) => ({
    id: `default-${id}`,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    palette,
    createdAt: 0,
    isDefault: true,
  })
);

function generateId(): string {
  return `preset-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function loadFromStorage(): PalettePreset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const data: PalettePresetsStorage = JSON.parse(raw);

    if (data.version !== STORAGE_VERSION) return [];

    return data.presets;
  } catch {
    return [];
  }
}

function saveToStorage(presets: PalettePreset[]): void {
  const data: PalettePresetsStorage = {
    version: STORAGE_VERSION,
    presets: presets.filter((p) => !p.isDefault), // 기본 프리셋은 저장하지 않음
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export interface UsePalettePresetsReturn {
  presets: PalettePreset[];
  savePreset: (name: string, palette: ColorInput) => PalettePreset;
  deletePreset: (id: string) => void;
  updatePreset: (id: string, name: string, palette: ColorInput) => void;
  getPreset: (id: string) => PalettePreset | undefined;
  exportPresets: () => string;
  importPresets: (json: string) => boolean;
}

export function usePalettePresets(): UsePalettePresetsReturn {
  const [userPresets, setUserPresets] = useState<PalettePreset[]>(() => loadFromStorage());

  const presets = useMemo(() => [...defaultPresets, ...userPresets], [userPresets]);

  useEffect(() => {
    saveToStorage(userPresets);
  }, [userPresets]);

  const savePreset = useCallback((name: string, palette: ColorInput): PalettePreset => {
    const newPreset: PalettePreset = {
      id: generateId(),
      name: name.trim() || 'Untitled',
      palette,
      createdAt: Date.now(),
    };

    setUserPresets((prev) => [...prev, newPreset]);
    return newPreset;
  }, []);

  const deletePreset = useCallback((id: string): void => {
    setUserPresets((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updatePreset = useCallback((id: string, name: string, palette: ColorInput): void => {
    setUserPresets((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, name: name.trim() || p.name, palette }
          : p
      )
    );
  }, []);

  const getPreset = useCallback(
    (id: string): PalettePreset | undefined => {
      return presets.find((p) => p.id === id);
    },
    [presets]
  );

  const exportPresets = useCallback((): string => {
    const exportData = {
      version: STORAGE_VERSION,
      exportedAt: new Date().toISOString(),
      presets: userPresets,
    };
    return JSON.stringify(exportData, null, 2);
  }, [userPresets]);

  const importPresets = useCallback((json: string): boolean => {
    try {
      const data = JSON.parse(json);

      if (!data.presets || !Array.isArray(data.presets)) {
        return false;
      }

      const importedPresets: PalettePreset[] = data.presets.map((p: PalettePreset) => ({
        ...p,
        id: generateId(), // 새 ID 부여
        createdAt: Date.now(),
        isDefault: false,
      }));

      setUserPresets((prev) => [...prev, ...importedPresets]);
      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    presets,
    savePreset,
    deletePreset,
    updatePreset,
    getPreset,
    exportPresets,
    importPresets,
  };
}
