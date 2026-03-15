/**
 * E05: Semantic Text 매핑
 * 역할/컴포넌트 → Text Style
 */
import type { SemanticTextRole, TextStyleName } from './types';

export const semanticText: Record<SemanticTextRole, TextStyleName> = {
  'page-title': 'display-md',
  'section-title': 'heading-1',
  'card-title': 'heading-2',
  button: 'label',
  input: 'body-md',
  'input-label': 'label',
  'helper-text': 'caption',
  tooltip: 'body-sm',
  badge: 'caption',
};
