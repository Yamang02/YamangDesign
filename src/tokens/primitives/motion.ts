/**
 * Motion primitive tokens
 * - duration, easing: Transition 타이밍
 * - stateLayer: State overlay opacity (hover, pressed, focus 등)
 */
export const duration = {
  instant: '0ms',
  fast: '100ms',
  normal: '200ms',
  slow: '300ms',
  slower: '500ms',
} as const;

export const easing = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  productive: 'cubic-bezier(0.2, 0, 0.38, 0.9)',
  expressive: 'cubic-bezier(0.4, 0.14, 0.3, 1)',
} as const;

/** State layer overlay opacity (Material/Dynatrace 스타일) */
export const stateLayer = {
  hover: 0.08,
  pressed: 0.12,
  focus: 0.12,
  selected: 0.08,
  disabled: 0.38,
} as const;
