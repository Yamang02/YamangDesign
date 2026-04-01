/**
 * 커스텀 테마 프리셋 CRUD — localStorage와 동기화.
 * 초기 로드: 신규 스토리지 키를 먼저 읽고, 없으면 레거시 키에서 마이그레이션 후 신규 키에 저장.
 */
import { useState, useCallback } from 'react';
import {
  CUSTOM_THEME_PRESETS_STORAGE_KEY,
  type CustomThemePreset,
  type StoredCustomThemePresets,
} from '@domain/constants/semantic-presets';

/** 마이그레이션 전용 구 키 (semantic-presets의 deprecated 상수와 동일 값) */
const LEGACY_SEMANTIC_PRESETS_STORAGE_KEY = 'yamang-custom-semantic-presets';

export interface UseCustomThemePresetsReturn {
  /** 현재 커스텀 테마 프리셋 목록 */
  presets: CustomThemePreset[];
  /** 새 프리셋 추가 */
  add: (
    preset: Omit<CustomThemePreset, 'id' | 'createdAt'>
  ) => CustomThemePreset;
  /** 기존 프리셋 업데이트 */
  update: (
    id: string,
    updates: Partial<Pick<CustomThemePreset, 'semanticOverrides' | 'displayName'>>
  ) => void;
  /** 프리셋 삭제 */
  remove: (id: string) => void;
}

export function useCustomThemePresets(): UseCustomThemePresetsReturn {
  const [presets, setPresets] = useState<CustomThemePreset[]>(() => {
    try {
      const raw = localStorage.getItem(CUSTOM_THEME_PRESETS_STORAGE_KEY);
      if (raw) {
        const parsed: StoredCustomThemePresets = JSON.parse(raw);
        return parsed?.presets ?? [];
      }
      const legacyRaw = localStorage.getItem(LEGACY_SEMANTIC_PRESETS_STORAGE_KEY);
      if (legacyRaw) {
        const parsed: StoredCustomThemePresets = JSON.parse(legacyRaw);
        const migrated = parsed?.presets ?? [];
        localStorage.setItem(
          CUSTOM_THEME_PRESETS_STORAGE_KEY,
          JSON.stringify({ version: '1', presets: migrated } satisfies StoredCustomThemePresets)
        );
        return migrated;
      }
      return [];
    } catch {
      return [];
    }
  });

  const persist = useCallback((updated: CustomThemePreset[]) => {
    localStorage.setItem(
      CUSTOM_THEME_PRESETS_STORAGE_KEY,
      JSON.stringify({
        version: '1',
        presets: updated,
      } satisfies StoredCustomThemePresets)
    );
  }, []);

  const add = useCallback(
    (
      preset: Omit<CustomThemePreset, 'id' | 'createdAt'>
    ): CustomThemePreset => {
      const id = `custom-semantic-${crypto.randomUUID().slice(0, 8)}`;
      const full: CustomThemePreset = {
        ...preset,
        id,
        createdAt: new Date().toISOString(),
      };
      setPresets((prev) => {
        const next = [...prev, full];
        persist(next);
        return next;
      });
      return full;
    },
    [persist]
  );

  const update = useCallback(
    (
      id: string,
      updates: Partial<Pick<CustomThemePreset, 'semanticOverrides' | 'displayName'>>
    ) => {
      setPresets((prev) => {
        const next = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const remove = useCallback(
    (id: string) => {
      setPresets((prev) => {
        const next = prev.filter((p) => p.id !== id);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  return { presets, add, update, remove };
}
