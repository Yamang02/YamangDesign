import type { ColorInput } from '@shared/@types/tokens';

/**
 * 팔레트 선택 상태 (discriminated union) — app/domain 공통 계약.
 *
 * @example
 * { type: 'preset', presetId: 'default' }
 * { type: 'custom', colors: { primary: '#6366F1', ... } }
 * { type: 'custom-semantic', presetId: 'custom-semantic-abc123' }
 */
export type PaletteSelection =
  | { type: 'preset'; presetId: string }
  | { type: 'custom'; colors: ColorInput }
  | { type: 'custom-semantic'; presetId: string };
