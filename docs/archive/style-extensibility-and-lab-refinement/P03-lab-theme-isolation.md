# P03: Lab 테마 독립성

## 목표

Lab UI(레이아웃, 카드, 텍스트, 배경)가 글로벌 테마 변경에 영향받지 않도록 격리한다.
컴포넌트 프리뷰와 컬러 스와치 영역만 현재 테마를 반영한다.

## 구현 상세

### 격리 구조

두 단계 `data-context`:

```
[data-context="lab"]      → Lab UI 전체: 테마 변수를 중립 고정값으로 덮어씀
[data-context="preview"]  → 프리뷰 영역: 고정값 해제, 글로벌 테마 상속
```

`data-context="lab"`은 `LabLayoutWrapper`에 이미 있으므로 CSS만 추가하면 된다.
`data-context="preview"`는 프리뷰 영역에 신규 추가.

### `src/layouts/LabLayout/LabLayout.module.css` 추가

```css
/* Lab UI 고정값: 테마 변경 불가 */
[data-context="lab"] {
  --ds-color-bg-base:        #ffffff;
  --ds-color-bg-surface:     #f8f9fa;
  --ds-color-bg-muted:       #f1f2f3;
  --ds-color-text-primary:   #111827;
  --ds-color-text-secondary: #6b7280;
  --ds-color-text-muted:     #9ca3af;
  --ds-color-border-subtle:  #e5e7eb;
  --ds-color-border-default: #d1d5db;
  --ds-color-border-focus:   #6366f1;
  --ds-shadow-sm:            0 1px 2px rgba(0, 0, 0, 0.05);
  --ds-shadow-md:            0 4px 6px -1px rgba(0, 0, 0, 0.1);
  /* Lab 자체 surface/filter/spatial 효과는 항상 중립 (P01 신규 변수 포함) */
  --ds-surface-backdrop:     none;
  --ds-surface-bg-alpha:     1;
  --ds-surface-texture:      none;
  --ds-surface-blend:        normal;
  --ds-filter:               none;
  --ds-perspective:          none;
  --ds-transform-style:      flat;
}

/* 프리뷰 영역: 글로벌 테마 복원 */
[data-context="lab"] [data-context="preview"] {
  --ds-color-bg-base:        var(--ds-color-bg-base-global, #ffffff);
  --ds-color-bg-surface:     var(--ds-color-bg-surface-global, #f8f9fa);
  --ds-color-bg-muted:       var(--ds-color-bg-muted-global, #f1f2f3);
  --ds-color-text-primary:   var(--ds-color-text-primary-global, #111827);
  --ds-color-text-secondary: var(--ds-color-text-secondary-global, #6b7280);
  --ds-color-border-subtle:  var(--ds-color-border-subtle-global, #e5e7eb);
  --ds-color-border-default: var(--ds-color-border-default-global, #d1d5db);
  --ds-color-border-focus:   var(--ds-color-border-focus-global, #6366f1);
  --ds-shadow-sm:            var(--ds-shadow-sm-global);
  --ds-shadow-md:            var(--ds-shadow-md-global);
  --ds-surface-backdrop:     var(--ds-surface-backdrop-global, none);
  --ds-surface-bg-alpha:     var(--ds-surface-bg-alpha-global, 1);
  --ds-surface-texture:      var(--ds-surface-texture-global, none);
  --ds-surface-blend:        var(--ds-surface-blend-global, normal);
  --ds-filter:               var(--ds-filter-global, none);
  --ds-perspective:          var(--ds-perspective-global, none);
  --ds-transform-style:      var(--ds-transform-style-global, flat);
}
```

### ThemeProvider: 글로벌 변수 별칭 주입

`preview` 영역이 글로벌 테마 값을 참조하려면 ThemeProvider가 `--ds-color-*-global`
형태의 별칭 변수도 함께 주입해야 한다.

`src/themes/ThemeProvider.tsx`의 주입 블록에서:

```ts
// 기존: --ds-color-bg-base: '#ffffff'
// 추가: --ds-color-bg-base-global: '#ffffff'  (preview 영역용 별칭)
const globalAliasVars = Object.fromEntries(
  Object.entries(themeCSSVars).map(([k, v]) => [`${k}-global`, v])
);

injectCSSVariables({
  ...primitiveCSSVars,
  ...paletteScaleVars,
  ...themeCSSVars,
  ...globalAliasVars,   // 신규
  ...style.vars,
  ...stateLayerVars,
  ...typographyVars,
});
```

### `data-context="preview"` 적용 대상

| 파일 | 적용 위치 |
|---|---|
| `src/layouts/LabLayout/ComparisonCard.tsx` | 컴포넌트 프리뷰 래퍼 div |
| `src/pages/layouts/TokenLab/TokenLab.tsx` | `ColorTokenCard` swatch div |

P04에서 추가될 `ComponentCard` 프리뷰 영역도 동일하게 `data-context="preview"` 적용.
P03 체크리스트에 포함하지 않고 P04 체크리스트에서 명시적으로 관리.

기존 `data-context="lab"` 카드 배경 고정 코드(`--lab-bg-surface`, `--lab-bg-muted`)는
새 구조로 통합 후 제거.

## 체크리스트

- [ ] `LabLayout.module.css` — `[data-context="lab"]` 고정값 추가
- [ ] `LabLayout.module.css` — `[data-context="preview"]` global 복원 추가
- [ ] `ThemeProvider.tsx` — `*-global` 별칭 변수 주입 추가
- [ ] `ComparisonCard.tsx` — `data-context="preview"` 추가
- [ ] `TokenLab.tsx` — swatch 영역 `data-context="preview"` 추가
- [ ] `LabLayout.module.css` — 레거시 `--lab-bg-surface`, `--lab-bg-muted` 제거
- [ ] 테마 변경 시 Lab UI 고정, 프리뷰만 변경되는지 시각 확인
