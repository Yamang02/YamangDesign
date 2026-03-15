/**
 * Style Lab overview data types (overview.json 스키마)
 */

export interface StyleProperty {
  key: string;
  label: string;
  description: string;
  values: string[];
  cssVar: string;
}

export interface StyleVariant {
  name: string;
  description: string;
  characteristics: string[];
  preview: {
    shadow: string;
    border: string;
    background: string;
  };
}

export interface StyleLabOverview {
  styleProperties: StyleProperty[];
  styleVariants: StyleVariant[];
}
