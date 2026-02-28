/**
 * E01: Lab 콘텐츠 중앙화
 * 텍스트, 라벨, 포맷터를 단일 소스로 관리
 */

/** 샘플 텍스트 */
export const sampleText = {
  pangram: {
    en: 'The quick brown fox jumps over the lazy dog',
    ko: '다람쥐 헌 쳇바퀴에 타고파',
  },
  numbers: '0123456789',
  alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
} as const;

/** 버튼 라벨 */
export const buttonLabels = {
  primary: 'Primary',
  secondary: 'Secondary',
  ghost: 'Ghost',
  reset: 'Reset',
  submit: 'Submit',
  /** PaletteLab: custom 색상 초기화 */
  resetToPreset: 'Preset으로 초기화',
} as const;

/** 인풋 플레이스홀더 */
export const inputPlaceholders = {
  default: 'Enter text...',
  search: 'Search...',
  email: 'email@example.com',
  /** Playground 등 일반 인풋용 */
  input: 'Input placeholder',
} as const;

/** 섹션 타이틀 */
export const sectionTitles = {
  // FontLab
  textStyles: 'Text Styles',
  semanticMapping: 'Semantic Mapping',
  typeScale: 'Type Scale',
  fontFamilies: 'Font Families',

  // PaletteLab
  colorScales: 'Color Scales',
  paletteComparison: 'Palette Comparison',

  // StyleLab
  shadowComparison: 'Shadow Comparison',
  componentComparison: 'Component Comparison',

  // Playground
  combinationMatrix: 'Combination Matrix',
} as const;

/** 라벨 포맷터 */
export const formatters = {
  /** FontLab: "body-md · md · normal" */
  textStyleMeta: (
    name: string,
    fontSize: string,
    fontWeight: string,
    lineHeight?: string
  ) =>
    `${name} · ${fontSize} · ${fontWeight}${lineHeight && lineHeight !== 'normal' ? ` · ${lineHeight}` : ''}`,
} as const;

/** Font Family 라벨 (FontLab) */
export const fontFamilyLabels = {
  sans: 'Sans',
  mono: 'Mono',
} as const;

/** 시맨틱 역할별 프리뷰 텍스트 */
export const semanticPreviews: Record<string, string> = {
  'page-title': 'Page Title',
  'section-title': 'Section Title',
  'card-title': 'Card Header',
  button: '[ Button ]',
  input: 'Input text',
  'input-label': 'Label',
  'helper-text': 'Helper text',
  tooltip: 'Tooltip content',
  badge: 'badge',
};
