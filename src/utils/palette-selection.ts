/**
 * PaletteSelection 유틸리티 — 하위 호환 re-export
 * E11 P03: 실제 구현은 src/state/palette-selection.ts로 이동됨
 */
export {
  PALETTE_SELECTION_STORAGE_KEY,
  savePaletteSelection,
  isValidPaletteSelection,
  createPresetSelection,
  createCustomSelection,
  createCustomSemanticSelection,
  isPaletteSelectionEqual,
} from '../state/palette-selection';

import { loadPaletteSelection as _loadPaletteSelection, createPresetSelection } from '../state/palette-selection';
import type { PaletteSelection } from '../state/types';

/**
 * localStorage에서 PaletteSelection 로드
 * @returns 저장된 selection 또는 기본값 (하위 호환: null 대신 기본값 반환)
 * @deprecated state/palette-selection의 loadPaletteSelection 사용 권장
 */
export function loadPaletteSelection(): PaletteSelection {
  return _loadPaletteSelection() ?? createPresetSelection('default');
}

/**
 * 기본 PaletteSelection 반환
 * @deprecated createPresetSelection('default') 사용 권장
 */
export function getDefaultSelection(): PaletteSelection {
  return createPresetSelection('default');
}
