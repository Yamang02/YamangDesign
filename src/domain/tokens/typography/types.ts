import type {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
} from '../global/typography';
export type TextStyleName =
  | 'display-lg'
  | 'display-md'
  | 'heading-1'
  | 'heading-2'
  | 'heading-3'
  | 'body-lg'
  | 'body-md'
  | 'body-sm'
  | 'caption'
  | 'label'
  | 'code';

export type SemanticTextRole =
  | 'page-title'
  | 'section-title'
  | 'card-title'
  | 'button'
  | 'input'
  | 'input-label'
  | 'helper-text'
  | 'tooltip'
  | 'badge';

export interface TextStyle {
  fontSize: keyof typeof fontSize;
  lineHeight: keyof typeof lineHeight;
  fontWeight: keyof typeof fontWeight;
  letterSpacing?: keyof typeof letterSpacing;
  fontFamily?: keyof typeof fontFamily;
}
