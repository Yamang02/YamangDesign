/**
 * E07: Components 쇼케이스 페이지용 콘텐츠
 * 컴포넌트 데모에 사용되는 텍스트, 라벨, 샘플 데이터
 */

/** 섹션 제목 */
export const showcaseSections = {
  button: 'Button',
  card: 'Card',
  select: 'Select',
  icon: 'Icon',
  input: 'Input',
} as const;

/** 공통 서브섹션 라벨 */
export const showcaseLabels = {
  variants: 'Variants',
  sizes: 'Sizes',
  states: 'States',
  colors: 'Colors',
  materialIcons: 'Material Icons',
  nucleoIcons: 'Nucleo Icons',
} as const;

/** 섹션별 통일 콘텐츠 - 동일 섹션 내 모든 컴포넌트가 표시하는 내용 */
export const showcaseContent = {
  button: 'Button',
  input: 'Input',
  card: {
    title: 'Card',
    body: 'Card content.',
  },
  select: 'Select',
  icon: 'Icon',
} as const;

/** 버튼 데모용 라벨 (차이점 표시용) */
export const buttonShowcase = {
  variants: {
    primary: 'Primary',
    secondary: 'Secondary',
    accent: 'Accent',
    outline: 'Outline',
    ghost: 'Ghost',
    subtle: 'Subtle',
  },
  sizes: {
    sm: 'Small',
    md: 'Medium',
    lg: 'Large',
  },
  states: {
    disabled: 'Disabled',
    fullWidth: 'Full Width',
  },
} as const;

/** 카드 데모용 라벨 및 콘텐츠 */
export const cardShowcase = {
  variantLabels: {
    elevated: 'Elevated',
    outlined: 'Outlined',
    flat: 'Flat',
  },
  actionLabels: {
    cancel: 'Cancel',
    confirm: 'Confirm',
    learnMore: 'Learn More',
  },
} as const;

/** 인풋 데모용 라벨 (차이점 표시용) */
export const inputShowcase = {
  variants: {
    outline: 'Outline',
    filled: 'Filled',
    flushed: 'Flushed',
  },
  sizes: {
    sm: 'Small',
    md: 'Medium',
    lg: 'Large',
  },
  states: {
    required: 'Required',
    error: 'Error',
    disabled: 'Disabled',
  },
  errorMessage: 'This field has an error',
} as const;

/** Select 데모용 라벨 및 옵션 */
export const selectShowcase = {
  sizes: {
    sm: 'Small',
    md: 'Medium',
    lg: 'Large',
  },
  fruitOptions: [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'durian', label: 'Durian', disabled: true },
  ],
  variants: {
    outline: 'Outline',
    filled: 'Filled',
    ghost: 'Ghost',
  },
  states: {
    disabled: 'Disabled',
    placeholder: 'Placeholder',
  },
} as const;

/** 아이콘 데모용 라벨 및 목록 */
export const iconShowcase = {
  sizeLabels: {
    sm: 'Small',
    md: 'Medium',
    lg: 'Large',
    custom32: '32px',
    custom48: '48px',
  },
  colorLabels: {
    primary: 'Primary',
    secondary: 'Secondary',
    accent: 'Accent',
    muted: 'Muted',
  },
  material: [
    'palette', 'settings', 'search', 'check', 'close',
    'add', 'edit', 'delete', 'save', 'info',
    'warning', 'error', 'success', 'star', 'favorite',
  ],
  nucleo: [
    'sun', 'moon', 'home', 'user', 'users',
    'cog', 'document', 'folder', 'download', 'upload',
    'refresh', 'bell', 'chat',
  ],
} as const;

/** 푸터 텍스트 */
export const showcaseFooter = {
  text: 'Yamang Design System POC',
  themeInfo: 'Theme: Minimal / Neumorphism',
} as const;
