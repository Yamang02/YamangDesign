/**
 * Style 레이어 - GUI 스타일을 독립적으로 관리
 * E02: Palette × Style 분리
 * P01: extractStyleVars, elevation/stroke → shadows 하위 호환
 */
import type { StyleDefinition, ResolvedStyle } from './types';

/**
 * StyleDefinition의 material/filter/spatial/createVars 슬롯에서 CSS 변수 맵 생성.
 *
 * surface/filter/spatial 변수는 슬롯이 없을 때도 항상 기본값을 포함해 출력한다.
 * 이유: LabLayout의 [data-shell] [data-context="preview"] CSS 규칙이 이 변수들을
 * *-global 앨리어스로 복원하므로, inline style에 명시적 기본값이 없으면 전역 테마의
 * surface 효과(예: glassmorphism blur)가 다른 스타일 프리뷰에 누수된다. (E11 P06)
 */
export function extractStyleVars(
  def: StyleDefinition,
  bgColor: string
): Record<string, string> {
  const vars: Record<string, string> = {
    '--ds-surface-backdrop': def.material?.backdropFilter ?? 'none',
    '--ds-surface-bg-alpha':
      def.material?.backgroundAlpha !== undefined
        ? String(def.material.backgroundAlpha)
        : '1',
    '--ds-surface-texture': def.material?.backgroundImage ?? 'none',
    '--ds-surface-blend': def.material?.backgroundBlendMode ?? 'normal',
    '--ds-filter': def.filter?.element ?? 'none',
    '--ds-perspective': def.spatial?.perspective ?? 'none',
    '--ds-transform-style': def.spatial?.transformStyle ?? 'flat',
  };

  const custom = def.createVars?.({ bgColor }) ?? {};
  return { ...vars, ...custom };
}

/**
 * Style 정의를 배경색에 적용하여 ResolvedStyle 생성
 * elevation → shadows 하위 호환 매핑(none/sm/md/lg/xl/inset) 포함
 */
export function createStyle(
  definition: StyleDefinition,
  bgColor: string
): ResolvedStyle {
  const elevation = definition.elevation.create({ bgColor });
  const shadows = {
    none: elevation[0],
    sm: elevation[1],
    md: elevation[2],
    lg: elevation[3],
    xl: elevation[4],
    inset: elevation.inset,
  };

  return {
    name: definition.name,
    shadows,
    border: {
      width: definition.stroke.width,
      style: definition.stroke.style,
    },
    vars: extractStyleVars(definition, bgColor),
  };
}

export type { StyleDefinition, ResolvedStyle, StyleName, ElevationScale } from './types';
export {
  minimalStyle,
  neumorphismStyle,
  brutalismStyle,
  glassmorphismStyle,
} from './presets';
