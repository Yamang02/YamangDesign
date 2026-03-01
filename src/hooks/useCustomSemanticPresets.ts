/**
 * 커스텀 시맨틱 프리셋 관리 훅
 * localStorage 로직을 컴포넌트에서 분리
 */
import { useState, useCallback } from 'react';
import {
  CUSTOM_SEMANTIC_PRESETS_STORAGE_KEY,
  type CustomSemanticPreset,
  type StoredCustomSemanticPresets,
} from '../constants/semantic-presets';

export interface UseCustomSemanticPresetsReturn {
  /** 현재 커스텀 시맨틱 프리셋 목록 */
  presets: CustomSemanticPreset[];
  /** 새 프리셋 추가 */
  add: (
    preset: Omit<CustomSemanticPreset, 'id' | 'createdAt'>
  ) => CustomSemanticPreset;
  /** 기존 프리셋 업데이트 */
  update: (
    id: string,
    updates: Partial<Pick<CustomSemanticPreset, 'semanticOverrides' | 'displayName'>>
  ) => void;
  /** 프리셋 삭제 */
  remove: (id: string) => void;
}

/**
 * 커스텀 시맨틱 프리셋 CRUD 훅
 * localStorage와 자동 동기화
 */
export function useCustomSemanticPresets(): UseCustomSemanticPresetsReturn {
  const [presets, setPresets] = useState<CustomSemanticPreset[]>(() => {
    try {
      const raw = localStorage.getItem(CUSTOM_SEMANTIC_PRESETS_STORAGE_KEY);
      if (!raw) return [];
      const parsed: StoredCustomSemanticPresets = JSON.parse(raw);
      return parsed?.presets ?? [];
    } catch {
      return [];
    }
  });

  const persist = useCallback((updated: CustomSemanticPreset[]) => {
    localStorage.setItem(
      CUSTOM_SEMANTIC_PRESETS_STORAGE_KEY,
      JSON.stringify({
        version: '1',
        presets: updated,
      } satisfies StoredCustomSemanticPresets)
    );
  }, []);

  const add = useCallback(
    (
      preset: Omit<CustomSemanticPreset, 'id' | 'createdAt'>
    ): CustomSemanticPreset => {
      const id = `custom-semantic-${crypto.randomUUID().slice(0, 8)}`;
      const full: CustomSemanticPreset = {
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
      updates: Partial<Pick<CustomSemanticPreset, 'semanticOverrides' | 'displayName'>>
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
