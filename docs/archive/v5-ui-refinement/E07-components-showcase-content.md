# E07: Components 쇼케이스 콘텐츠 중앙화

**상태: 완료** (2025-03)

## 목표

Components 페이지의 하드코딩된 텍스트, 라벨, 샘플 데이터를 중앙 관리하여 일관성 확보

## (마이그레이션 전) 문제였던 부분

```tsx
// Components.tsx - 하드코딩된 내용들

// 버튼 라벨
<Button variant="primary">Primary</Button>
<Button size="sm">Small</Button>
<Button disabled>Disabled</Button>

// 카드 내용
<Card.Header>Elevated Card</Card.Header>
<Card.Body>This card has elevation with shadow. Hover to see the effect.</Card.Body>

// 인풋 placeholder/label
<Input variant="outline" placeholder="Outline variant" label="Outline" />
<Input isError errorMessage="This field has an error" />

// 섹션 라벨
<p style={labelStyle}>Variants</p>
<p style={labelStyle}>Sizes</p>
<p style={labelStyle}>States</p>

// Select 옵션
const fruitOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  ...
];

// 푸터
Yamang Design System POC - Theme: Minimal / Neumorphism
```

---

## 설계

### 파일 구조

```
src/
└── constants/
    ├── lab-content.ts           # Lab 페이지용 (E01)
    ├── lab-presets.ts           # Lab 비교용 프리셋 (E01)
    └── showcase-content.ts      # Components 쇼케이스용 (E07)
```

### showcase-content.ts

```typescript
// src/constants/showcase-content.ts

/**
 * Components 쇼케이스 페이지용 콘텐츠
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
} as const;

/** 버튼 데모용 라벨 */
export const buttonShowcase = {
  // variant 라벨 (variant 이름과 동일)
  variants: {
    primary: 'Primary',
    secondary: 'Secondary',
    accent: 'Accent',
    outline: 'Outline',
    ghost: 'Ghost',
    subtle: 'Subtle',
  },
  // size 라벨
  sizes: {
    sm: 'Small',
    md: 'Medium',
    lg: 'Large',
  },
  // state 라벨
  states: {
    disabled: 'Disabled',
    fullWidth: 'Full Width',
  },
} as const;

/** 카드 데모용 콘텐츠 */
export const cardShowcase = {
  elevated: {
    title: 'Elevated Card',
    body: 'This card has elevation with shadow. Hover to see the effect.',
    actions: {
      cancel: 'Cancel',
      confirm: 'Confirm',
    },
  },
  outlined: {
    title: 'Outlined Card',
    body: 'This card has a border outline. Good for minimal style.',
    actions: {
      learnMore: 'Learn More',
    },
  },
  flat: {
    body: 'Flat card with no shadow or border. Simple and clean.',
  },
} as const;

/** 인풋 데모용 콘텐츠 */
export const inputShowcase = {
  variants: {
    outline: { placeholder: 'Outline variant', label: 'Outline' },
    filled: { placeholder: 'Filled variant', label: 'Filled' },
    flushed: { placeholder: 'Flushed variant', label: 'Flushed' },
  },
  sizes: {
    sm: { placeholder: 'Small input' },
    md: { placeholder: 'Medium input' },
    lg: { placeholder: 'Large input' },
  },
  states: {
    required: { placeholder: 'Required field', label: 'Required' },
    error: { placeholder: 'Error state', errorMessage: 'This field has an error' },
    disabled: { placeholder: 'Disabled input' },
  },
} as const;

/** Select 데모용 옵션 */
export const selectShowcase = {
  /** 기본 과일 옵션 (데모용) */
  fruitOptions: [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'durian', label: 'Durian', disabled: true },
  ],
  variants: {
    outline: { label: 'Outline' },
    filled: { placeholder: 'Filled variant' },
    ghost: {},
  },
  states: {
    disabled: {},
    placeholder: { placeholder: 'With placeholder' },
  },
} as const;

/** 아이콘 데모용 목록 */
export const iconShowcase = {
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
```

---

## 적용 예시

### Before

```tsx
<Button variant="primary">Primary</Button>
<Button size="sm">Small</Button>
```

### After

```tsx
import { buttonShowcase } from '../../../constants/showcase-content';

<Button variant="primary">{buttonShowcase.variants.primary}</Button>
<Button size="sm">{buttonShowcase.sizes.sm}</Button>
```

### Card 예시

```tsx
import { cardShowcase } from '../../../constants/showcase-content';

<Card variant="elevated" hoverable>
  <Card.Header>{cardShowcase.elevated.title}</Card.Header>
  <Card.Body>{cardShowcase.elevated.body}</Card.Body>
  <Card.Footer>
    <Button variant="ghost" size="sm">{cardShowcase.elevated.actions.cancel}</Button>
    <Button variant="primary" size="sm">{cardShowcase.elevated.actions.confirm}</Button>
  </Card.Footer>
</Card>
```

---

## lab-content.ts와의 관계

| 파일 | 용도 | 예시 |
|------|------|------|
| `lab-content.ts` | Lab 페이지 공통 | `sampleText.pangram`, `buttonLabels.primary` |
| `showcase-content.ts` | Components 쇼케이스 전용 | `cardShowcase.elevated.body`, `inputShowcase.variants` |

**공유 가능 항목**:
- `buttonLabels`는 `lab-content.ts`에 이미 있음 → 재사용 가능
- 단, 쇼케이스 전용 콘텐츠(카드 설명 등)는 `showcase-content.ts`에만

```tsx
// Components.tsx
import { buttonLabels } from '../../../constants/lab-content';
import { cardShowcase, inputShowcase } from '../../../constants/showcase-content';
```

---

## 체크리스트

- [x] `src/constants/showcase-content.ts` 생성
- [x] Button 섹션 마이그레이션
- [x] Card 섹션 마이그레이션
- [x] Input 섹션 마이그레이션
- [x] Select 섹션 마이그레이션
- [x] Icon 섹션 마이그레이션
- [x] Footer 마이그레이션
- [x] lab-content.ts 공유 항목 정리 (showcase-content.ts에서 자체 정의하여 사용)

## 구현 노트

- `showcaseContent`가 추가되어 섹션별 통일 콘텐츠(Button/Input/Card 제목·본문 등)를 별도 관리
- `cardShowcase`는 variantLabels, actionLabels 구조로 단순화
- `inputShowcase`는 라벨 중심, placeholder는 `showcaseContent.input` 공통 사용
- `iconShowcase`에 sizeLabels, colorLabels 추가
