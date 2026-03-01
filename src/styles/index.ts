/**
 * Style 레이어 - GUI 스타일을 독립적으로 관리
 * E02: Palette × Style 분리
 */
import type { StyleDefinition, ResolvedStyle } from './types';

/**
 * Style 정의를 배경색에 적용하여 ResolvedStyle 생성
 */
export function createStyle(
  definition: StyleDefinition,
  bgColor: string
): ResolvedStyle {
  return {
    name: definition.name,
    shadows: definition.createShadows(bgColor),
    border: {
      width: definition.border.width,
      style: definition.border.style,
    },
  };
}

export type { StyleDefinition, ResolvedStyle, StyleName } from './types';
export {
  minimalStyle,
  neumorphismStyle,
  brutalismStyle,
} from './presets';
