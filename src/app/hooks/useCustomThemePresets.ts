/**
 * 커스텀 테마 프리셋 관리 훅
 * localStorage 로직을 컴포넌트에서 분리
 */
import { useState, useCallback } from 'react';
import {
  CUSTOM_THEME_PRESETS_STORAGE_KEY,
  CUSTOM_SEMANTIC_PRESETS_STORAGE_KEY,
  type CustomThemePreset,
  type StoredCustomThemePresets,
} from '@domain/constants/semantic-presets';

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

/**
 * 커스텀 테마 프리셋 CRUD 훅
 * localStorage와 자동 동기화
 * localStorage 마이그레이션: 기존 'yamang-custom-semantic-presets' 키 → 새 키로 이전
 */
export function useCustomThemePresets(): UseCustomThemePresetsReturn {
  const [presets, setPresets] = useState<CustomThemePreset[]>(() => {
    try {
      // 새 키에서 먼저 읽기
      const raw = localStorage.getItem(CUSTOM_THEME_PRESETS_STORAGE_KEY);
      if (raw) {
        const parsed: StoredCustomThemePresets = JSON.parse(raw);
        return parsed?.presets ?? [];
      }
      // 새 키가 없으면 구 키에서 마이그레이션
      const legacyRaw = localStorage.getItem(CUSTOM_SEMANTIC_PRESETS_STORAGE_KEY);
      if (legacyRaw) {
        const parsed: StoredCustomThemePresets = JSON.parse(legacyRaw);
        const migrated = parsed?.presets ?? [];
        // 새 키로 저장
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
