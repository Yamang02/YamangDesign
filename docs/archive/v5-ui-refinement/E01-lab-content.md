# E01: Lab 콘텐츠 중앙화

## 목표

모든 Lab 페이지에서 사용하는 콘텐츠를 단일 소스로 관리하여 일관성 확보 및 유지보수 용이성 향상

## 현재 문제

```tsx
// FontLab.tsx - 하드코딩된 문자열들
<p>The quick brown fox jumps over the lazy dog</p>
<p>{name} · {textStyles[name].fontSize} · {textStyles[name].fontWeight}</p>

// StyleLab.tsx
<Button variant="primary">Primary</Button>
<p>Card with {styleName} style</p>

// Playground.tsx
<Input placeholder="Input placeholder" />
```

## 설계

### 파일 구조

```
src/
└── constants/
    ├── lab-content.ts       # 텍스트, 라벨, 포맷터
    └── lab-presets.ts       # 비교용 CSS 변수 프리셋
```

---

## Part 1: 텍스트 콘텐츠

### lab-content.ts

```typescript
// src/constants/lab-content.ts

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
  textStyleMeta: (name: string, fontSize: string, fontWeight: string, lineHeight?: string) =>
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
  'button': '[ Button ]',
  'input': 'Input text',
  'input-label': 'Label',
  'helper-text': 'Helper text',
  'tooltip': 'Tooltip content',
  'badge': 'badge',
};
```

---

## Part 2: 비교용 CSS 변수 프리셋

### 개념

각 Lab에서 프리셋들을 **나란히 비교**하기 위해, 프리셋별 CSS 변수 객체를 생성하여 inline style로 적용

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Minimal    │  │ Neumorphism │  │ Glassmorphism│
│  [Button]   │  │  [Button]   │  │   [Button]  │
│  [Card]     │  │   [Card]    │  │    [Card]   │
└─────────────┘  └─────────────┘  └─────────────┘
```

### lab-presets.ts

```typescript
// src/constants/lab-presets.ts

import { minimalStyle, neumorphismStyle } from '../styles';
import { palettePresets } from '../themes/presets';
import { createPalette } from '../palettes';
import type { StyleName, PaletteName } from '../@types/theme';

/** CSS 변수 객체 타입 */
type CSSVariables = Record<string, string>;

/**
 * Style 프리셋 → CSS 변수 객체
 * 배경색을 받아 해당 스타일의 shadow 변수들 생성
 */
export function getStyleVariables(
  styleName: StyleName,
  bgColor: string = '#f5f5f5'
): CSSVariables {
  const styles = { minimal: minimalStyle, neumorphism: neumorphismStyle };
  const style = styles[styleName as keyof typeof styles];

  if (!style) return {};

  const shadows = style.createShadows(bgColor);

  return {
    '--ds-shadow-none': shadows.none,
    '--ds-shadow-sm': shadows.sm,
    '--ds-shadow-md': shadows.md,
    '--ds-shadow-lg': shadows.lg,
    '--ds-shadow-xl': shadows.xl,
    '--ds-shadow-inset': shadows.inset,
    '--ds-border-width': style.border.width,
  };
}

/**
 * Palette 프리셋 → CSS 변수 객체
 */
export function getPaletteVariables(paletteName: PaletteName): CSSVariables {
  if (paletteName === 'custom') return {};

  const preset = palettePresets[paletteName];
  if (!preset) return {};

  const expanded = createPalette(preset);
  const vars: CSSVariables = {};

  // Primary, Secondary, Accent, Sub 스케일
  (['primary', 'secondary', 'accent', 'sub'] as const).forEach((key) => {
    const scale = expanded.scales[key];
    if (scale) {
      Object.entries(scale).forEach(([step, color]) => {
        vars[`--ds-color-${key}-${step}`] = color;
      });
    }
  });

  return vars;
}

/** 비교 대상 프리셋 목록 */
export const comparisonPresets = {
  styles: ['minimal', 'neumorphism'] as StyleName[],
  palettes: ['default', 'vivid', 'pastel', 'monochrome', 'earth'] as PaletteName[],
};
```

---

## Part 3: 사용 예시

### StyleLab - 스타일 비교

```tsx
import { getStyleVariables, comparisonPresets } from '../../../constants/lab-presets';
import { sampleText, buttonLabels } from '../../../constants/lab-content';

export function StyleLab() {
  return (
    <LabLayout title="Style Lab" subtitle="GUI 스타일 비교">
      <LabSection title="Shadow Comparison" id="shadow-comparison">
        <div style={{ display: 'flex', gap: 'var(--ds-spacing-6)' }}>
          {comparisonPresets.styles.map((styleName) => (
            <div
              key={styleName}
              style={{
                ...getStyleVariables(styleName),
                flex: 1,
                padding: 'var(--ds-spacing-6)',
              }}
            >
              <h3>{styleName}</h3>
              {['sm', 'md', 'lg'].map((size) => (
                <div
                  key={size}
                  style={{
                    padding: 'var(--ds-spacing-4)',
                    backgroundColor: 'var(--ds-color-bg-surface)',
                    boxShadow: `var(--ds-shadow-${size})`,
                    borderRadius: 'var(--ds-radius-md)',
                    marginBottom: 'var(--ds-spacing-3)',
                  }}
                >
                  shadow-{size}
                </div>
              ))}
            </div>
          ))}
        </div>
      </LabSection>

      <LabSection title="Component Comparison" id="component-comparison">
        <div style={{ display: 'flex', gap: 'var(--ds-spacing-6)' }}>
          {comparisonPresets.styles.map((styleName) => (
            <div
              key={styleName}
              style={{ ...getStyleVariables(styleName), flex: 1 }}
            >
              <h3>{styleName}</h3>
              <Button variant="primary">{buttonLabels.primary}</Button>
              <Card padding="md">
                <p>{sampleText.pangram.en}</p>
              </Card>
            </div>
          ))}
        </div>
      </LabSection>
    </LabLayout>
  );
}
```

### PaletteLab - 팔레트 비교

```tsx
import { getPaletteVariables, comparisonPresets } from '../../../constants/lab-presets';

export function PaletteLab() {
  return (
    <LabLayout title="Palette Lab" subtitle="배색 비교">
      <LabSection title="Color Scales" id="color-scales">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--ds-spacing-4)' }}>
          {comparisonPresets.palettes.map((paletteName) => (
            <div
              key={paletteName}
              style={{ ...getPaletteVariables(paletteName) }}
            >
              <h3>{paletteName}</h3>
              {['primary', 'secondary', 'accent', 'sub'].map((colorKey) => (
                <div key={colorKey} style={{ display: 'flex', gap: 2 }}>
                  {[100, 300, 500, 700, 900].map((step) => (
                    <div
                      key={step}
                      style={{
                        width: 24,
                        height: 24,
                        backgroundColor: `var(--ds-color-${colorKey}-${step})`,
                        borderRadius: 4,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </LabSection>
    </LabLayout>
  );
}
```

---

## 구현 시 참고

- **lab-presets import**: `minimalStyle`, `neumorphismStyle`은 `../styles`에서 import (styles/index가 presets re-export)
- **Palette 비교**: `getPaletteVariables`는 스케일 변수(`--ds-color-primary-50` 등)만 반환 → Color Scales 스와치용
- **Playground 매트릭스**: Button/Card는 시맨틱 변수(`--ds-color-action-primary-default` 등) 사용 → E05에서 `combineTheme` 기반 `getThemeVariables(paletteName, styleName)` 추가 검토

---

## 하드코딩 유지 대상

다음은 중앙화하지 않고 각 컴포넌트에서 유지:

1. **토큰 키 배열** - tokens에서 직접 파생
   ```tsx
   const textStyleNames = Object.keys(textStyles) as TextStyleName[];
   ```

2. **특수 UI 옵션** - 해당 Lab 전용 인터랙션
   ```tsx
   // 사용자가 직접 조합을 선택하는 Playground 등
   ```

---

## 체크리스트

- [x] `src/constants/lab-content.ts` 생성
- [x] `src/constants/lab-presets.ts` 생성
- [x] FontLab 콘텐츠 마이그레이션
- [x] StyleLab 비교 뷰 적용
- [x] PaletteLab 비교 뷰 적용
- [x] Playground 조합 매트릭스 적용
- [x] 타입 안전성 검증
