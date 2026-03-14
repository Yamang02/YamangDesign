# E02: Alias Layer 완성

## 목표

현재 `SemanticMapping`에서 누락된 `action`과 `feedback`을 통합하여
모든 alias token이 단일 매핑 시스템 안에서 관리되도록 완성한다.

---

## 현재 문제

```
SemanticMapping (현재)         생성 위치
├── bg.*                       palettes/strategies/default-mappings.ts
├── text.*                     palettes/strategies/default-mappings.ts
└── border.*                   palettes/strategies/default-mappings.ts

action.*  ← combine.ts의 generateActionColors()에서 별도 생성
feedback.* ← utils/system-colors.ts에서 별도 주입
elevation.* ← 각 스타일 프리셋에서 별도 주입
```

→ SemanticMapping을 커스터마이징해도 action/feedback/elevation에는 적용 안 됨

---

## 변경 내용

### 1. SemanticMapping 타입 확장

```ts
// src/palettes/types.ts

export interface SemanticMapping {
  bg: {
    base: string | ScaleReference;
    surface: string | ScaleReference;
    surfaceBrand: string | ScaleReference;
    elevated: string | ScaleReference;
    muted: string | ScaleReference;
  };
  text: {
    primary: string | ScaleReference;
    secondary: string | ScaleReference;
    muted: string | ScaleReference;
    onAction: string | ScaleReference;
  };
  border: {
    default: string | ScaleReference;
    subtle: string | ScaleReference;
    accent: string | ScaleReference;
    focus: string | ScaleReference;
  };

  // 신설
  action: {
    primary:   { default: string | ScaleReference; hover: string | ScaleReference; active: string | ScaleReference; };
    secondary: { default: string | ScaleReference; hover: string | ScaleReference; active: string | ScaleReference; };
    accent:    { default: string | ScaleReference; hover: string | ScaleReference; active: string | ScaleReference; };
  };

  // 신설 (system-colors 대체)
  feedback: {
    error:   { bg: string | ScaleReference; text: string | ScaleReference; border: string | ScaleReference; };
    warning: { bg: string | ScaleReference; text: string | ScaleReference; border: string | ScaleReference; };
    success: { bg: string | ScaleReference; text: string | ScaleReference; border: string | ScaleReference; };
    info:    { bg: string | ScaleReference; text: string | ScaleReference; border: string | ScaleReference; };
  };
}
```

### 2. default-mappings.ts 업데이트

light/colored/dark 각 전략에 action, feedback 기본값 추가.

```ts
// src/palettes/strategies/default-mappings.ts (light 예시)

const lightMapping: SemanticMapping = {
  // 기존 bg/text/border 유지...

  action: {
    primary:   { default: { scale: 'primary', step: 500 }, hover: { scale: 'primary', step: 600 }, active: { scale: 'primary', step: 700 } },
    secondary: { default: { scale: 'secondary', step: 500 }, hover: { scale: 'secondary', step: 600 }, active: { scale: 'secondary', step: 700 } },
    accent:    { default: { scale: 'accent', step: 500 }, hover: { scale: 'accent', step: 600 }, active: { scale: 'accent', step: 700 } },
  },

  feedback: {
    error:   { bg: '#FEF2F2', text: '#B91C1C', border: '#EF4444' },
    warning: { bg: '#FFFBEB', text: '#B45309', border: '#F59E0B' },
    success: { bg: '#F0FDF4', text: '#15803D', border: '#22C55E' },
    info:    { bg: '#EFF6FF', text: '#1D4ED8', border: '#3B82F6' },
  },
};
```

### 3. combine.ts 단순화

`generateActionColors()` 제거. action은 SemanticMapping에서 resolve.

```ts
// src/themes/combine.ts (변경 후)

export function combineTheme(
  paletteDefinition: PaletteDefinition,
  styleDefinition: StyleDefinition
): Theme {
  const palette = createPalette(paletteDefinition);
  const style = createStyle(styleDefinition, palette.semantic.bg.base);

  return {
    palette: palette.name,
    style: style.name,
    colors: {
      bg: palette.semantic.bg,
      text: palette.semantic.text,
      border: palette.semantic.border,
      action: palette.semantic.action,     // SemanticMapping에서
      feedback: palette.semantic.feedback, // SemanticMapping에서
    },
    shadows: style.shadows,
    border: style.border,
  };
}
```

### 4. ThemeProvider 주입 통합

기존에 별도로 호출하던 `generateSystemColorVars()`를 제거하고
`flattenToCSSVars({ color: theme.colors })`에서 feedback까지 한 번에 처리.

---

## CSS 변수 결과 (예시)

```css
/* action (현재와 동일한 이름, 생성 경로만 변경) */
--ds-color-action-primary-default: #6366F1;
--ds-color-action-primary-hover: #4F46E5;
--ds-color-action-primary-active: #4338CA;

/* feedback (system-colors에서 이전) */
--ds-color-feedback-error-bg: #FEF2F2;
--ds-color-feedback-error-text: #B91C1C;
--ds-color-feedback-error-border: #EF4444;
```

---

## 영향 범위

| 파일 | 변경 내용 |
|------|-----------|
| `src/palettes/types.ts` | `SemanticMapping`, `SemanticColors` 타입 확장 |
| `src/palettes/strategies/default-mappings.ts` | action/feedback 기본값 추가 |
| `src/palettes/mapping/resolve.ts` | action/feedback resolve 로직 추가 |
| `src/themes/combine.ts` | `generateActionColors()` 제거 |
| `src/themes/ThemeProvider.tsx` | `generateSystemColorVars()` 호출 제거 |
| `src/utils/system-colors.ts` | deprecated 처리 또는 삭제 |
| `src/@types/theme.ts` | Theme 타입에 feedback 추가 |
