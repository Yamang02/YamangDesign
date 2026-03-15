/**
 * PaletteSelection 직렬화/역직렬화 및 유틸리티 함수
 * E11 P03: utils/palette-selection.ts에서 state/ 레이어로 이동
 */
import type { PaletteSelection } from './types';
import type { ColorInput } from '@shared/@types/tokens';

export const PALETTE_SELECTION_STORAGE_KEY = 'yamang-palette-selection';
const STORAGE_VERSION = '1';

interface StoredPaletteSelection {
  version: string;
  selection: PaletteSelection;
  updatedAt: string;
}

/**
 * PaletteSelection을 localStorage에 저장
 */
export function savePaletteSelection(selection: PaletteSelection): void {
  const data: StoredPaletteSelection = {
    version: STORAGE_VERSION,
    selection,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(PALETTE_SELECTION_STORAGE_KEY, JSON.stringify(data));
}

/**
 * localStorage에서 PaletteSelection 로드
 * @returns 저장된 selection 또는 null
 */
export function loadPaletteSelection(): PaletteSelection | null {
  try {
    const raw = localStorage.getItem(PALETTE_SELECTION_STORAGE_KEY);
    if (!raw) return null;

    const data: StoredPaletteSelection = JSON.parse(raw);
    if (!data.selection || !isValidPaletteSelection(data.selection)) {
      return null;
    }
    return data.selection;
  } catch {
    return null;
  }
}

/**
 * PaletteSelection 타입 가드
 */
export function isValidPaletteSelection(value: unknown): value is PaletteSelection {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;

  if (obj.type === 'preset') {
    return typeof obj.presetId === 'string';
  }
  if (obj.type === 'custom') {
    return (
      typeof obj.colors === 'object' &&
      obj.colors !== null &&
      typeof (obj.colors as ColorInput).primary === 'string'
    );
  }
  if (obj.type === 'custom-semantic') {
    return typeof obj.presetId === 'string';
  }
  return false;
}

/**
 * PaletteSelection 헬퍼: 프리셋 선택 생성
 */
export function createPresetSelection(presetId: string): PaletteSelection {
  return { type: 'preset', presetId };
}

/**
 * PaletteSelection 헬퍼: 커스텀 색상 선택 생성
 */
export function createCustomSelection(colors: ColorInput): PaletteSelection {
  return { type: 'custom', colors };
}

/**
 * PaletteSelection 헬퍼: 커스텀 시맨틱 프리셋 선택 생성
 */
export function createCustomSemanticSelection(presetId: string): PaletteSelection {
  return { type: 'custom-semantic', presetId };
}

/**
 * PaletteSelection 비교 (deep equality)
 */
export function isPaletteSelectionEqual(
  a: PaletteSelection,
  b: PaletteSelection
): boolean {
  if (a.type !== b.type) return false;

  switch (a.type) {
    case 'preset':
      return a.presetId === (b as typeof a).presetId;
    case 'custom':
      return JSON.stringify(a.colors) === JSON.stringify((b as typeof a).colors);
    case 'custom-semantic':
      return a.presetId === (b as typeof a).presetId;
  }
}
