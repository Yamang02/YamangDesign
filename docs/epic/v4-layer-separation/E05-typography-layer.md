# E05: Typography 레이어

> **구현 완료** (2025-02)

## 목표

Primitive 토큰(fontSize, fontWeight 등)을 조합한 **Text Styles**를 정의하고, 컴포넌트가 참조할 **Semantic 매핑**을 구축한다.

---

## 현재 구조

```typescript
// tokens/primitives/typography.ts
fontFamily: { sans, mono }
fontSize: { xs, sm, md, lg, xl, 2xl, 3xl, 4xl }
fontWeight: { normal, medium, semibold, bold }
lineHeight: { none, tight, snug, normal, relaxed, loose }
letterSpacing: { tighter, tight, normal, wide, wider }
```

**문제:**
- Primitive만 있고, 조합된 스타일이 없음
- 컴포넌트에서 개별 속성을 직접 조합해야 함
- 일관성 유지가 어려움

---

## 목표 구조

```
src/
├── tokens/
│   ├── primitives/
│   │   └── typography.ts      # 기존 유지
│   └── typography/            # [NEW]
│       ├── text-styles.ts     # Text Style 조합
│       ├── semantic.ts        # Semantic 매핑
│       └── index.ts
```

---

## 타입 정의

```typescript
// tokens/typography/types.ts

/** Text Style 정의 */
interface TextStyle {
  fontSize: keyof typeof fontSize;
  lineHeight: keyof typeof lineHeight;
  fontWeight: keyof typeof fontWeight;
  letterSpacing?: keyof typeof letterSpacing;
  fontFamily?: keyof typeof fontFamily;
}

/** Text Style 이름 */
type TextStyleName =
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

/** Semantic 용도 */
type SemanticTextRole =
  | 'page-title'
  | 'section-title'
  | 'card-title'
  | 'button'
  | 'input'
  | 'input-label'
  | 'helper-text'
  | 'tooltip'
  | 'badge';
```

---

## Text Styles 정의

```typescript
// tokens/typography/text-styles.ts

export const textStyles: Record<TextStyleName, TextStyle> = {
  // Display
  'display-lg': {
    fontSize: '4xl',
    lineHeight: 'tight',
    fontWeight: 'bold',
    letterSpacing: 'tight',
  },
  'display-md': {
    fontSize: '3xl',
    lineHeight: 'tight',
    fontWeight: 'bold',
    letterSpacing: 'tight',
  },

  // Headings
  'heading-1': {
    fontSize: '2xl',
    lineHeight: 'snug',
    fontWeight: 'semibold',
  },
  'heading-2': {
    fontSize: 'xl',
    lineHeight: 'snug',
    fontWeight: 'semibold',
  },
  'heading-3': {
    fontSize: 'lg',
    lineHeight: 'snug',
    fontWeight: 'medium',
  },

  // Body
  'body-lg': {
    fontSize: 'lg',
    lineHeight: 'relaxed',
    fontWeight: 'normal',
  },
  'body-md': {
    fontSize: 'md',
    lineHeight: 'normal',
    fontWeight: 'normal',
  },
  'body-sm': {
    fontSize: 'sm',
    lineHeight: 'normal',
    fontWeight: 'normal',
  },

  // UI
  'caption': {
    fontSize: 'xs',
    lineHeight: 'normal',
    fontWeight: 'normal',
  },
  'label': {
    fontSize: 'sm',
    lineHeight: 'none',
    fontWeight: 'medium',
  },
  'code': {
    fontSize: 'sm',
    lineHeight: 'normal',
    fontWeight: 'normal',
    fontFamily: 'mono',
  },
};
```

---

## Semantic 매핑

```typescript
// tokens/typography/semantic.ts

/** 컴포넌트/용도별 Text Style 매핑 */
export const semanticText: Record<SemanticTextRole, TextStyleName> = {
  'page-title': 'display-md',
  'section-title': 'heading-1',
  'card-title': 'heading-2',
  'button': 'label',
  'input': 'body-md',
  'input-label': 'label',
  'helper-text': 'caption',
  'tooltip': 'body-sm',
  'badge': 'caption',
};
```

---

## CSS 변수 생성

```typescript
// tokens/typography/index.ts

export function generateTextStyleVars(): Record<string, string> {
  const vars: Record<string, string> = {};

  for (const [name, style] of Object.entries(textStyles)) {
    vars[`--ds-text-${name}-size`] = fontSize[style.fontSize];
    vars[`--ds-text-${name}-leading`] = lineHeight[style.lineHeight];
    vars[`--ds-text-${name}-weight`] = fontWeight[style.fontWeight];

    if (style.letterSpacing) {
      vars[`--ds-text-${name}-tracking`] = letterSpacing[style.letterSpacing];
    }
    if (style.fontFamily) {
      vars[`--ds-text-${name}-font`] = fontFamily[style.fontFamily];
    }
  }

  return vars;
}
```

---

## 사용 예시

### CSS에서 사용

```css
.page-title {
  font-size: var(--ds-text-display-md-size);
  line-height: var(--ds-text-display-md-leading);
  font-weight: var(--ds-text-display-md-weight);
}

/* 또는 개별 primitive 조합 */
.custom-text {
  font-size: var(--ds-text-lg);
  line-height: var(--ds-leading-relaxed);
  font-weight: var(--ds-font-weight-medium);
}
```

### 컴포넌트에서 사용

```tsx
// 유틸리티 함수
function getTextStyleCSS(styleName: TextStyleName): CSSProperties {
  const style = textStyles[styleName];
  return {
    fontSize: `var(--ds-text-${style.fontSize})`,
    lineHeight: `var(--ds-leading-${style.lineHeight})`,
    fontWeight: `var(--ds-font-weight-${style.fontWeight})`,
  };
}

// 사용
<h1 style={getTextStyleCSS('heading-1')}>제목</h1>
```

---

## 작업 항목

### 1. 타입 정의
- [x] `TextStyle`, `TextStyleName` 타입
- [x] `SemanticTextRole` 타입

### 2. Text Styles 정의
- [x] `textStyles` 객체 (display, heading, body, ui)
- [x] 현재 컴포넌트에서 사용 중인 조합 분석하여 반영

### 3. Semantic 매핑
- [x] `semanticText` 객체
- [x] 컴포넌트별 기본 스타일 매핑

### 4. CSS 변수 생성
- [x] `generateTextStyleVars()` 함수
- [x] ThemeProvider에서 주입

### 5. 기존 컴포넌트 적용
- [x] Button → label
- [x] Input (label, body-sm/md/lg, helper-text) → label, body-*, caption
- [x] Card (header, body) → heading-2, body-md
- [x] Tooltip → body-sm
- [x] Select (label, trigger, option) → label, body-*
- [x] ColorPicker, HexInput, Navigation → label, caption, code, heading-2

---

## 테마 독립성

Typography는 **Palette/Style과 독립적**이다:

| 레이어 | 테마 영향 | 설명 |
|--------|-----------|------|
| Palette | ✅ 영향 | 색상이 바뀜 |
| Style | ✅ 영향 | 그림자/표면이 바뀜 |
| Typography | ❌ 독립 | 항상 동일 |

따라서 Typography는 `combineTheme()`과 별개로 시스템 전역에서 한 번만 주입.

---

## 완료 기준

- [x] Text Styles 최소 10개 정의 (11개: display-lg/md, heading-1~3, body-lg/md/sm, caption, label, code)
- [x] Semantic 매핑 최소 5개 정의 (9개)
- [x] CSS 변수 생성 및 주입 (ThemeProvider)
- [x] 기존 컴포넌트에서 semantic 참조로 전환 완료

---

## 다음 단계

E06에서 Site Style 정의.
