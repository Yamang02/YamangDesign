/**
 * Yamang Design 통합 JSON Export/Import
 * 전역 설정·시맨틱 매핑을 동일한 스키마로 처리
 *
 * ## Export 파일 형식
 *
 * ### 1. 전역 설정 (yamang-design-settings.json)
 * - exportType: "global-settings"
 * - globalSettings: { palette, styleName, systemPreset, version, updatedAt }
 *
 * ### 2. 시맨틱 매핑 (semantic-mapping-{id}.json)
 * - exportType: "semantic-mapping"
 * - semanticMapping: { basePalette: { id, displayName, colors, bgStrategy }, overrides }
 */
import type { BgStrategy, PaletteDefinition, SemanticMapping } from '../palettes/types';
import {
  migrateV1ToV2,
  isStoredSettingsV1,
  type StoredSettings,
} from '../components/GlobalSettings/types';
import type { ComponentMappingOverrides } from './component-mapping-storage';

export const YAMANG_EXPORT_VERSION = '1.0';

/** Export 파일 종류 */
export type YamangExportType = 'global-settings' | 'semantic-mapping';

/** 파일명 상수 */
export const YAMANG_FILENAMES = {
  GLOBAL_SETTINGS: 'yamang-design-settings.json',
  SEMANTIC_MAPPING_PREFIX: 'semantic-mapping',
} as const;

/** 시맨틱 매핑의 기반 팔레트 정보 */
export interface BasePaletteInfo {
  id: string;
  displayName?: string;
  colors: PaletteDefinition['colors'];
  bgStrategy: BgStrategy;
}

/** 시맨틱 매핑 export 섹션 (기반 팔레트 + 오버라이드) */
export interface SemanticMappingExportSection {
  basePalette: BasePaletteInfo;
  overrides: Partial<SemanticMapping>;
}

/** 통합 Export 루트 스키마 */
export interface YamangDesignExport {
  version: string;
  exportedAt: string;
  /** 파일 종류 구분용 (import 시 경고 메시지에 사용) */
  exportType?: YamangExportType;
  globalSettings?: StoredSettings;
  semanticMapping?: SemanticMappingExportSection;
  /** P06: 컴포넌트별 토큰 오버라이드 */
  componentMapping?: ComponentMappingOverrides;
}

function createExportRoot(): Pick<YamangDesignExport, 'version' | 'exportedAt'> {
  return {
    version: YAMANG_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
  };
}

/** JSON 다운로드 유틸 (통일 포맷) */
export function downloadYamangJSON(payload: YamangDesignExport, filename: string): void {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** 전역 설정 export용 payload 생성 (componentMapping 선택 포함) */
export function createGlobalSettingsPayload(
  settings: StoredSettings,
  extras?: { componentMapping?: ComponentMappingOverrides | null }
): YamangDesignExport {
  const payload: YamangDesignExport = {
    ...createExportRoot(),
    exportType: 'global-settings',
    globalSettings: {
      ...settings,
      updatedAt: new Date().toISOString(),
    },
  };
  if (extras?.componentMapping && Object.keys(extras.componentMapping).length > 0) {
    payload.componentMapping = extras.componentMapping;
  }
  return payload;
}

/** 시맨틱 매핑 export용 payload 생성 (기반 팔레트 포함) */
export function createSemanticMappingPayload(
  definition: PaletteDefinition,
  overrides: Partial<SemanticMapping>,
  id: string
): YamangDesignExport {
  const displayName =
    definition.metadata?.displayName ?? definition.name;
  return {
    ...createExportRoot(),
    exportType: 'semantic-mapping',
    semanticMapping: {
      basePalette: {
        id,
        displayName,
        colors: definition.colors,
        bgStrategy: definition.bgStrategy,
      },
      overrides,
    },
  };
}

/** JSON 파일 선택 후 raw 텍스트 반환 */
export async function pickYamangJSONFile(): Promise<string | null> {
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
      reader.onload = () => resolve((reader.result as string) ?? null);
      reader.readAsText(file);
    };
    input.click();
  });
}

/** JSON 파싱 + 루트 검증 */
export function parseYamangJSON(raw: string): YamangDesignExport | null {
  try {
    const data = JSON.parse(raw) as YamangDesignExport;
    if (!data || typeof data !== 'object' || !data.version || !data.exportedAt) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

/** P06: payload에서 컴포넌트 매핑 오버라이드 추출 */
export function extractComponentMapping(
  payload: YamangDesignExport
): ComponentMappingOverrides | null {
  const m = payload.componentMapping;
  if (!m || typeof m !== 'object') return null;
  return m as ComponentMappingOverrides;
}

/** 전역 설정 import: payload에서 globalSettings 추출 (v1이면 v2로 마이그레이션) */
export function extractGlobalSettings(
  payload: YamangDesignExport
): StoredSettings | null {
  const g = payload.globalSettings;
  if (!g || typeof g !== 'object') return null;
  if (!g.palette || !g.styleName || !g.systemPreset) return null;
  if (isStoredSettingsV1(g)) return migrateV1ToV2(g);
  return g as StoredSettings;
}

/** 시맨틱 매핑 import: payload에서 overrides 추출 (레거시 형식 호환) */
export function extractSemanticOverrides(
  payload: unknown
): Partial<SemanticMapping> | null {
  if (!payload || typeof payload !== 'object') return null;

  // 신규 통합 스키마
  const p = payload as YamangDesignExport;
  if (p.semanticMapping?.overrides && typeof p.semanticMapping.overrides === 'object') {
    return p.semanticMapping.overrides;
  }

  // 레거시: { semanticOverrides: ... }
  const legacy = payload as { semanticOverrides?: Partial<SemanticMapping> };
  if (legacy.semanticOverrides && typeof legacy.semanticOverrides === 'object') {
    return legacy.semanticOverrides;
  }

  // 레거시: 직접 Partial<SemanticMapping>
  const direct = payload as Partial<SemanticMapping>;
  if (direct.bg || direct.text || direct.border) {
    return direct;
  }

  return null;
}

/** Import 컨텍스트별 경고 메시지 */
export const IMPORT_MESSAGES = {
  'global-settings': {
    wrongFileType:
      '이 파일에는 전역 설정이 없습니다.\n시맨틱 매핑 전용 파일인 것 같습니다.\n전역 설정을 가져오려면 "yamang-design-settings.json" 파일을 선택해 주세요.',
    invalidFormat: '올바른 전역 설정 파일이 아닙니다.\n"yamang-design-settings.json" 형식의 파일을 선택해 주세요.',
  },
  'semantic-mapping': {
    wrongFileType:
      '이 파일에는 시맨틱 매핑이 없습니다.\n전역 설정 전용 파일인 것 같습니다.\n시맨틱 매핑을 가져오려면 "semantic-mapping-*.json" 파일을 선택해 주세요.',
    invalidFormat: '올바른 시맨틱 매핑 파일이 아닙니다.\n시맨틱 매핑 내보내기로 생성한 JSON 파일을 선택해 주세요.',
  },
} as const;

/** payload에서 exportType 추론 (없으면 섹션 기반) */
export function getExportType(payload: YamangDesignExport | null): YamangExportType | null {
  if (!payload || typeof payload !== 'object') return null;
  if (payload.exportType) return payload.exportType;
  if (payload.semanticMapping) return 'semantic-mapping';
  if (payload.globalSettings) return 'global-settings';
  return null;
}

/** Import 실패 시 표시할 메시지 반환 */
export function getImportErrorMessage(
  context: YamangExportType,
  parsedPayload: YamangDesignExport | null
): string {
  const detected = parsedPayload ? getExportType(parsedPayload) : null;
  const isWrongFileType =
    detected &&
    ((context === 'global-settings' && detected === 'semantic-mapping') ||
     (context === 'semantic-mapping' && detected === 'global-settings'));
  const messages = IMPORT_MESSAGES[context];
  return isWrongFileType ? messages.wrongFileType : messages.invalidFormat;
}
