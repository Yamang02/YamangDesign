# P01: ThemeTokenSet 도입 & 컬러 누수 수정

## 목표

`ThemeTokenSet` 타입과 `buildTokenSet()` 함수를 신설하고,
`ThemeProvider`와 `getThemeVariables` 모두 이 단일 경로를 통해 CSS 변수를 생성하게 한다.
Build > Atoms에서 Palette 선택 시 다른 팔레트의 컬러 토큰이 섞이는 버그를 수정한다.

## 구현 상세

### ThemeTokenSet 타입 정의

`ThemeTokenSet`은 특정 Palette+Style 조합이 내보내는 **테마 반응형 CSS 변수 전체**를 나타내는 Value Object다. 팔레트 독립적인 primitive 변수(spacing, typography 등)는 포함하지 않는다.

```ts
// src/themes/token-set.ts (신규)

export interface ThemeTokenSet {
  /** --ds-color-{scale}-{step} (primary/secondary/accent/neutral/sub × 50~900) */
  scaleVars: Record<string, string>;
  /** --ds-color-{bg|text|border|action|feedback}-* */
  semanticVars: Record<string, string>;
  /** --ds-shadow-*, --ds-border-* */
  styleVars: Record<string, string>;
  /** --ds-surface-*, --ds-filter, --ds-perspective 등 style.createVars 산출물 */
  surfaceVars: Record<string, string>;
}

/** 모든 슬롯을 합친 flat CSS 변수 맵 (inline style / injectCSSVariables 직접 사용) */
export function flattenTokenSet(set: ThemeTokenSet): Record<string, string> {
  return {
    ...set.scaleVars,
    ...set.semanticVars,
    ...set.styleVars,
    ...set.surfaceVars,
  };
}
```

### buildTokenSet() 팩토리

```ts
// src/themes/token-set.ts

export function buildTokenSet(
  palette: PaletteDefinition,
  style: StyleDefinition
): ThemeTokenSet {
  const expanded = createPalette(palette);
  const resolved = createStyle(style, expanded.semantic.bg.base);

  // 1. Scale vars
  const scaleVars: Record<string, string> = {};
  PALETTE_SCALES.forEach((key) => {
    const scale = expanded.scales[key];
    if (scale) {
      Object.entries(scale).forEach(([step, color]) => {
        scaleVars[`--ds-color-${key}-${step}`] = color;
      });
    }
  });

  // 2. Semantic vars
  const semanticVars = flattenToCSSVars({
    color: {
      bg: expanded.semantic.bg,
      text: { ...expanded.semantic.text, inverse: palette.bgStrategy === 'dark'
        ? expanded.semantic.text.primary : '#FFFFFF' },
      border: expanded.semantic.border,
      action: expanded.semantic.action,
      feedback: expanded.semantic.feedback,
    },
  });

  // 3. Style vars (shadow, border)
  const styleVars = flattenToCSSVars({
    shadow: resolved.shadows,
    border: resolved.border,
  });

  // 4. Surface vars (material, filter, spatial, createVars)
  const surfaceVars = resolved.vars;

  return { scaleVars, semanticVars, styleVars, surfaceVars };
}
```

### ThemeProvider 교체

`ThemeProvider.tsx`의 `useEffect` 내 CSS 변수 생성 로직:
- 기존: `createPalette` + `combineTheme` + 수동 조립
- 변경: `buildTokenSet(definitionForTheme, styleDef)` → `flattenTokenSet` → `injectCSSVariables`
- `paletteScaleVars` 별도 생성 코드 제거 (buildTokenSet이 커버)

### getThemeVariables 교체

`src/constants/lab-presets.ts`의 `getThemeVariables`:
- 기존: `combineTheme` → `flattenToCSSVars({ color, shadow, border })`
- 변경: `buildTokenSet(paletteDef, styleDef)` → `flattenTokenSet`

### combineTheme 역할 재검토

`combineTheme()`은 현재 `ThemeProvider`의 `theme` 상태값(`Theme` 타입) 생성에도 사용된다.
- `theme.colors`, `theme.shadows`, `theme.border`, `theme.vars`는 `ThemeContext`를 통해 소비됨
- `buildTokenSet`이 CSS 주입을 담당하므로, `combineTheme`은 React 상태용(`theme` object) 으로만 유지
- 중복 계산이 발생하지 않도록 `buildTokenSet` 내부에서 `createPalette`/`createStyle`을 호출하고, `ThemeProvider`는 이 결과를 재사용하도록 구조화

## 체크리스트

- [ ] `src/themes/token-set.ts` 신설 — `ThemeTokenSet` 타입, `buildTokenSet()`, `flattenTokenSet()` 구현
- [ ] `ThemeProvider.tsx` — `useEffect` 내 CSS 변수 생성을 `buildTokenSet` + `flattenTokenSet`으로 교체
- [ ] `ThemeProvider.tsx` — `paletteScaleVars` 수동 생성 코드 제거
- [ ] `src/constants/lab-presets.ts` — `getThemeVariables`를 `buildTokenSet` + `flattenTokenSet`으로 교체
- [ ] Build > Atoms에서 Default / 봄빛 크림소다 전환 시 컬러 누수 없는지 확인
- [ ] Build > Atoms 외 다른 페이지(Components, Playground 등)에서 팔레트 전환 정상 동작 확인
- [ ] TypeScript 컴파일 오류 없음 확인
