/**
 * E05: Typography 레이어
 */
import {
  fontSize,
  lineHeight,
  fontWeight,
  letterSpacing,
  fontFamily,
} from '../primitives/typography';
import { textStyles } from './text-styles';

export { textStyles } from './text-styles';
export { semanticText } from './semantic';
export type { TextStyle, TextStyleName, SemanticTextRole } from './types';

/**
 * Text Style용 CSS 변수 생성
 */
export function generateTextStyleVars(): Record<string, string> {
  const vars: Record<string, string> = {};

  for (const [name, style] of Object.entries(textStyles)) {
    vars[`--ds-text-${name}-size`] = fontSize[style.fontSize];
    vars[`--ds-text-${name}-leading`] = lineHeight[style.lineHeight];
    vars[`--ds-text-${name}-weight`] = fontWeight[style.fontWeight];

    if (style.letterSpacing) {
      vars[`--ds-text-${name}-tracking`] = letterSpacing[style.letterSpacing];
    }
    if (style.fontFamily) {
      vars[`--ds-text-${name}-font`] = fontFamily[style.fontFamily];
    }
  }

  return vars;
}
