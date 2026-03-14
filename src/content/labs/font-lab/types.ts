/**
 * Font Lab overview data types (overview.json 스키마)
 */

export interface TypographyProperty {
  key: string;
  label: string;
  description: string;
  scale: string[];
  cssVar: string;
}

export interface SemanticRole {
  role: string;
  styleName: string;
  description: string;
  example: string;
}

export interface SizeScaleItem {
  name: string;
  px: string;
  use: string;
}

export interface FontLabOverview {
  typographyProperties: TypographyProperty[];
  semanticRoles: SemanticRole[];
  sizeScale: SizeScaleItem[];
}
