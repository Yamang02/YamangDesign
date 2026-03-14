/**
 * Style 레이어 - GUI 스타일을 독립적으로 관리
 * E02: Palette × Style 분리
 * P01: extractStyleVars, elevation/stroke → shadows 하위 호환
 */
import type { StyleDefinition, ResolvedStyle } from './types';

/**
 * StyleDefinition의 material/filter/spatial/createVars 슬롯에서 CSS 변수 맵 생성
 */
export function extractStyleVars(
  def: StyleDefinition,
  bgColor: string
): Record<string, string> {
  const vars: Record<string, string> = {};

  if (def.material) {
    if (def.material.backdropFilter)
      vars['--ds-surface-backdrop'] = def.material.backdropFilter;
    if (def.material.backgroundAlpha !== undefined)
      vars['--ds-surface-bg-alpha'] = String(def.material.backgroundAlpha);
    if (def.material.backgroundImage)
      vars['--ds-surface-texture'] = def.material.backgroundImage;
    if (def.material.backgroundBlendMode)
      vars['--ds-surface-blend'] = def.material.backgroundBlendMode;
  }

  if (def.filter?.element) vars['--ds-filter'] = def.filter.element;

  if (def.spatial) {
    if (def.spatial.perspective)
      vars['--ds-perspective'] = def.spatial.perspective;
    if (def.spatial.transformStyle)
      vars['--ds-transform-style'] = def.spatial.transformStyle;
  }

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
