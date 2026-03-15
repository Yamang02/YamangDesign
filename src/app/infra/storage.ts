/**
 * P06: 컴포넌트 매핑 오버라이드 localStorage
 * P08: design-settings 블롭에 포함되어 있으면 해당 값을 우선 사용
 */
import { GLOBAL_SETTINGS_STORAGE_KEY } from '../components/GlobalSettings/types';

export const COMPONENT_MAPPING_STORAGE_KEY = 'yamang-component-mapping-overrides';

export type ComponentMappingOverrides = Record<string, Record<string, string>>;

export function loadComponentMappingOverrides(): ComponentMappingOverrides | null {
  try {
    const blobRaw = localStorage.getItem(GLOBAL_SETTINGS_STORAGE_KEY);
    if (blobRaw) {
      const blob = JSON.parse(blobRaw) as { componentMapping?: unknown };
      if (blob?.componentMapping && typeof blob.componentMapping === 'object') {
        return blob.componentMapping as ComponentMappingOverrides;
      }
    }
    const raw = localStorage.getItem(COMPONENT_MAPPING_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as unknown;
    if (!data || typeof data !== 'object') return null;
    return data as ComponentMappingOverrides;
  } catch {
    return null;
  }
}

export function saveComponentMappingOverrides(data: ComponentMappingOverrides): void {
  localStorage.setItem(COMPONENT_MAPPING_STORAGE_KEY, JSON.stringify(data));
}

/** P07/P08: 컴포넌트 매핑 오버라이드 전체 초기화 (별도 키 + design-settings 블롭에서 제거) */
export function clearComponentMappingOverrides(): void {
  localStorage.removeItem(COMPONENT_MAPPING_STORAGE_KEY);
  try {
    const raw = localStorage.getItem(GLOBAL_SETTINGS_STORAGE_KEY);
    if (raw) {
      const blob = JSON.parse(raw) as Record<string, unknown>;
      if ('componentMapping' in blob) {
        delete blob.componentMapping;
        localStorage.setItem(GLOBAL_SETTINGS_STORAGE_KEY, JSON.stringify(blob));
      }
    }
  } catch {
    /* ignore */
  }
}
