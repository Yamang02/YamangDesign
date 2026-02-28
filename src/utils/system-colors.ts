/**
 * E08: 시스템 컬러 CSS 변수 생성
 */
import type { SystemColorPreset } from '../tokens/primitives/system-colors';

export function generateSystemColorVars(
  preset: SystemColorPreset
): Record<string, string> {
  const vars: Record<string, string> = {};

  for (const [name, scale] of Object.entries(preset.colors)) {
    vars[`--ds-color-system-${name}-bg`] = scale[50];
    vars[`--ds-color-system-${name}`] = scale[500];
    vars[`--ds-color-system-${name}-emphasis`] = scale[700];
  }

  return vars;
}
