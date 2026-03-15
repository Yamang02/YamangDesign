/**
 * UI 상태 레이어 타입 정의
 * E11 P03: PaletteSelection을 도메인 레이어(palettes/)에서 상태 레이어(state/)로 분리
 */

import type { ColorInput } from '@shared/@types/tokens';

// ============================================================================
// PaletteSelection: 팔레트 선택 의도를 명시하는 단일 타입
// ============================================================================

/**
 * 팔레트 선택 상태 (discriminated union)
 *
 * 기존 paletteName + customColors 조합을 단일 타입으로 통합.
 * 선택 의도가 타입에 명시되어 잘못된 조합을 컴파일 타임에 방지.
 *
 * @example
 * // 프리셋 선택
 * { type: 'preset', presetId: 'default-spring-cream' }
 *
 * // 사용자 직접 색상 입력
 * { type: 'custom', colors: { primary: '#6366F1', ... } }
 *
 * // 커스텀 시맨틱 프리셋 (베이스 + 오버라이드)
 * { type: 'custom-semantic', presetId: 'custom-semantic-abc123' }
 */
export type PaletteSelection =
  | { type: 'preset'; presetId: string }
  | { type: 'custom'; colors: ColorInput }
  | { type: 'custom-semantic'; presetId: string };
