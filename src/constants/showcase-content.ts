/**
 * E07: Components 쇼케이스 페이지용 콘텐츠
 * 컴포넌트 데모에 사용되는 텍스트, 라벨, 샘플 데이터
 */

/** 섹션 제목 */
export const showcaseSections = {
  badge: 'Badge',
  avatar: 'Avatar',
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
  badge: 'New',
  avatar: 'AB',
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

/** 컴포넌트 섹션 ID */
export type ShowcaseSectionId =
  | 'badge'
  | 'icon'
  | 'avatar'
  | 'button'
  | 'card'
  | 'select'
  | 'input'
  | 'form-example';

/** 컴포넌트 섹션별 사용 토큰 목록 - DetailPanel에서 실제 값 표시용 */
export const showcaseSectionTokens: Record<
  ShowcaseSectionId,
  Array<{ token: string; label?: string }>
> = {
  badge: [
    { token: '--ds-font-sans', label: '폰트' },
    { token: '--ds-font-weight-semibold', label: '폰트 굵기' },
    { token: '--ds-radius-full', label: '둥근 모서리' },
    { token: '--ds-spacing-1', label: '패딩 sm' },
    { token: '--ds-spacing-3', label: '패딩 sm' },
    { token: '--ds-spacing-2', label: '패딩 md' },
    { token: '--ds-spacing-4', label: '패딩 md' },
    { token: '--ds-text-xs', label: '폰트 크기 sm' },
    { token: '--ds-text-sm', label: '폰트 크기 md' },
    { token: '--ds-color-action-primary-default', label: 'primary 배경' },
    { token: '--ds-color-text-onAction', label: 'primary 텍스트' },
    { token: '--ds-color-action-secondary-default', label: 'secondary 배경' },
    { token: '--ds-color-action-accent-default', label: 'accent 배경' },
    { token: '--ds-color-bg-muted', label: 'subtle 배경' },
    { token: '--ds-color-text-primary', label: 'subtle/outline 텍스트' },
    { token: '--ds-border-width', label: '테두리' },
    { token: '--ds-border-style', label: '테두리 스타일' },
  ],
  icon: [
    { token: '--ds-color-action-primary-default', label: 'primary' },
    { token: '--ds-color-action-secondary-default', label: 'secondary' },
    { token: '--ds-color-action-accent-default', label: 'accent' },
    { token: '--ds-color-text-muted', label: 'muted' },
    { token: '--ds-color-text-primary', label: 'currentColor 기본' },
  ],
  avatar: [
    { token: '--ds-font-sans', label: '폰트' },
    { token: '--ds-font-weight-semibold', label: '폰트 굵기' },
    { token: '--ds-text-xs', label: '폰트 크기 sm' },
    { token: '--ds-text-sm', label: '폰트 크기 md' },
    { token: '--ds-text-md', label: '폰트 크기 lg' },
    { token: '--ds-color-text-onAction', label: '이니셜 텍스트' },
    { token: '--ds-color-action-primary-default', label: 'primary 배경' },
    { token: '--ds-color-action-secondary-default', label: 'secondary 배경' },
    { token: '--ds-color-action-accent-default', label: 'accent 배경' },
  ],
  button: [
    { token: '--ds-font-sans', label: '폰트' },
    { token: '--ds-text-label-size', label: '폰트 크기' },
    { token: '--ds-radius-md', label: '둥근 모서리' },
    { token: '--ds-transition-interactive-full', label: '트랜지션' },
    { token: '--ds-size-sm', label: '높이 sm' },
    { token: '--ds-size-md', label: '높이 md' },
    { token: '--ds-size-lg', label: '높이 lg' },
    { token: '--ds-spacing-3', label: '패딩 sm' },
    { token: '--ds-spacing-4', label: '패딩 md' },
    { token: '--ds-spacing-5', label: '패딩 lg' },
    { token: '--ds-color-action-primary-default', label: 'primary 기본' },
    { token: '--ds-color-action-primary-hover', label: 'primary hover' },
    { token: '--ds-color-action-primary-active', label: 'primary active' },
    { token: '--ds-color-text-onAction', label: '버튼 텍스트' },
    { token: '--ds-shadow-sm', label: '그림자 기본' },
    { token: '--ds-shadow-md', label: '그림자 hover' },
    { token: '--ds-shadow-inset', label: '그림자 active' },
    { token: '--ds-color-bg-muted', label: 'ghost hover' },
    { token: '--ds-color-border-focus', label: '포커스 링' },
    { token: '--ds-border-width', label: 'outline 테두리' },
  ],
  card: [
    { token: '--ds-radius-lg', label: '둥근 모서리' },
    { token: '--ds-transition-shadow', label: '트랜지션' },
    { token: '--ds-spacing-3', label: '패딩 sm' },
    { token: '--ds-spacing-4', label: '패딩 md' },
    { token: '--ds-spacing-6', label: '패딩 lg' },
    { token: '--ds-color-bg-surfaceBrand', label: 'elevated 배경' },
    { token: '--ds-color-bg-base', label: 'outlined 배경' },
    { token: '--ds-color-bg-surface', label: 'flat 배경' },
    { token: '--ds-color-bg-muted', label: 'flat hover' },
    { token: '--ds-color-border-subtle', label: 'elevated 테두리' },
    { token: '--ds-color-border-default', label: 'outlined 테두리' },
    { token: '--ds-shadow-md', label: 'elevated 그림자' },
    { token: '--ds-shadow-lg', label: 'elevated hover' },
    { token: '--ds-text-heading-2-size', label: 'Header 폰트' },
    { token: '--ds-text-body-md-size', label: 'Body 폰트' },
    { token: '--ds-color-text-primary', label: 'Header 텍스트' },
    { token: '--ds-color-text-secondary', label: 'Body 텍스트' },
    { token: '--ds-color-border-focus', label: '포커스' },
  ],
  select: [
    { token: '--ds-font-sans', label: '폰트' },
    { token: '--ds-radius-md', label: '둥근 모서리' },
    { token: '--ds-size-sm', label: '높이 sm' },
    { token: '--ds-size-md', label: '높이 md' },
    { token: '--ds-size-lg', label: '높이 lg' },
    { token: '--ds-spacing-1', label: '드롭다운 여백' },
    { token: '--ds-spacing-2', label: '패딩/옵션 간격' },
    { token: '--ds-spacing-3', label: '옵션 패딩' },
    { token: '--ds-spacing-4', label: '패딩 lg' },
    { token: '--ds-color-bg-surface', label: 'outline 배경' },
    { token: '--ds-color-bg-muted', label: 'filled 배경' },
    { token: '--ds-color-bg-elevated', label: '드롭다운 배경' },
    { token: '--ds-color-text-primary', label: '텍스트' },
    { token: '--ds-color-text-muted', label: 'placeholder' },
    { token: '--ds-color-border-default', label: '테두리' },
    { token: '--ds-color-action-primary-default', label: '선택 옵션' },
    { token: '--ds-color-border-focus', label: '포커스' },
    { token: '--ds-shadow-sm', label: '그림자' },
    { token: '--ds-shadow-lg', label: '드롭다운 그림자' },
    { token: '--ds-z-dropdown', label: 'z-index' },
  ],
  input: [
    { token: '--ds-font-sans', label: '폰트' },
    { token: '--ds-radius-md', label: '둥근 모서리' },
    { token: '--ds-size-sm', label: '높이 sm' },
    { token: '--ds-size-md', label: '높이 md' },
    { token: '--ds-size-lg', label: '높이 lg' },
    { token: '--ds-spacing-1', label: '패딩 sm' },
    { token: '--ds-spacing-2', label: '패딩 md' },
    { token: '--ds-spacing-3', label: '패딩 sm' },
    { token: '--ds-spacing-4', label: '패딩 md' },
    { token: '--ds-spacing-5', label: '패딩 lg' },
    { token: '--ds-color-bg-base', label: 'outline/flushed 배경' },
    { token: '--ds-color-bg-muted', label: 'filled 배경' },
    { token: '--ds-color-text-primary', label: '텍스트' },
    { token: '--ds-color-border-default', label: '테두리' },
    { token: '--ds-color-border-focus', label: '포커스' },
    { token: '--ds-color-system-error', label: '에러 상태' },
    { token: '--ds-text-label-size', label: '라벨 폰트' },
    { token: '--ds-text-body-sm-size', label: '폰트 크기 sm' },
    { token: '--ds-text-body-md-size', label: '폰트 크기 md' },
    { token: '--ds-text-body-lg-size', label: '폰트 크기 lg' },
    { token: '--ds-text-caption-size', label: '에러 메시지' },
  ],
  'form-example': [
    { token: '--ds-radius-lg', label: 'Card 둥근 모서리' },
    { token: '--ds-spacing-4', label: '인풋 간격' },
    { token: '--ds-spacing-6', label: 'Card 패딩' },
    { token: '--ds-color-bg-surfaceBrand', label: 'Card 배경' },
    { token: '--ds-color-text-primary', label: '라벨' },
    { token: '--ds-color-action-primary-default', label: '버튼' },
  ],
};

/** 폼 예시 (연락처 패턴) */
export const formExample = {
  title: 'Form Example',
  subtitle: 'Input + Button in Card (Contact pattern)',
  fields: {
    name: 'Name',
    namePlaceholder: 'Your name',
    email: 'Email',
    emailPlaceholder: 'you@example.com',
    message: 'Message',
    messagePlaceholder: 'How can we help?',
  },
  submitLabel: 'Send Message',
} as const;
