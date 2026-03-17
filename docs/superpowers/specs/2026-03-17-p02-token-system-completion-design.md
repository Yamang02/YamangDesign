# P02: 토큰 시스템 완성 — Design Spec

**Date:** 2026-03-17
**Epic:** E13 Design System Standardization
**Phase:** P02 Token System Completion

---

## 목표

CSS 하드코딩 값을 제거하고 모든 값이 토큰을 통해 일관되게 반응하는 상태를 만든다.

---

## 결정 사항

### 허용 예외 (토큰화 불필요)
- `transform: translateY(1px / -2px)` — 물리적 인터랙션 상수. 테마 무관.
- `border: 1px solid transparent` — 레이아웃 트릭 (hover 시 색만 바뀜).
- `border: 1px solid var(--shell-*)` — shell 크롬은 테마 무관 고정 1px.

### border 처리 기준
- `border: 1px solid var(--ds-color-border-*)` → `var(--ds-border-width, 1px) var(--ds-border-style, solid) var(--ds-color-border-*)` 로 교체
- shell 컨텍스트의 border는 그대로 유지

### Icon size prop
- 숫자 `size` prop 제거. `'sm' | 'md' | 'lg'` 문자열만 허용.
- SVG는 `width="100%" height="100%"` 고정. `<span>` 크기를 CSS로 제어.

---

## 구현 전략: Step 방식 (Option B)

1. **Step 1** — JS 토큰 파일 + CSS 문서화
2. **Step 2** — CSS 하드코딩 교체
3. **Step 3** — Icon 컴포넌트 리팩터링

---

## Step 1: 토큰 파이프라인 수정

### 1-1. `src/shared/utils/css.ts`
`flattenToCSSVars`의 `kebabKey` 생성 직후에 `.` → `-` 치환 추가.

```ts
// 변경 전
const kebabKey = toKebabCase(key);

// 변경 후
const kebabKey = toKebabCase(key).replace(/\./g, '-');
```

효과: `spacing['0.5']` → `--ds-spacing-0-5`, `1.5` → `--ds-spacing-1-5` 등 자동 처리.
점 치환은 `kebabKey` 단계에서 적용해야 함 (varName 조합 후 적용 시 prefix 구분자와 혼용 위험).

### 1-2. `src/domain/tokens/global/sizes.ts`
신규 토큰 추가:

```ts
export const iconSize = {
  sm: '16px',
  md: '20px',
  lg: '24px',
} as const;

export const componentSize = {
  colorPreview: '28px',
} as const;
```

### 1-3. `src/domain/themes/ThemeProvider.tsx`
1. import 구문에 `iconSize`, `componentSize` 추가:
```ts
import {
  spacing,
  fontFamily,
  // ... 기존 항목들
  componentHeight,
  iconSize,       // 추가
  componentSize,  // 추가
} from '../tokens/global';
```

2. `flattenToCSSVars`에 신규 토큰 객체 추가:
```ts
const primitiveCSSVars = flattenToCSSVars({
  // 기존
  spacing,
  font: fontFamily,
  // ...
  size: componentHeight,
  // 추가
  'icon-size': iconSize,
  'component-size': componentSize,
});
```

생성되는 CSS 변수:
- `--ds-icon-size-sm: 16px`
- `--ds-icon-size-md: 20px`
- `--ds-icon-size-lg: 24px`
- `--ds-component-size-color-preview: 28px`

### 1-4. `src/shared/styles/variables.css`
신규 토큰 문서화 추가:

```css
/* Icon sizes */
--ds-icon-size-sm: initial;
--ds-icon-size-md: initial;
--ds-icon-size-lg: initial;

/* Component sizes */
--ds-component-size-color-preview: initial;

/* Spacing (추가) */
--ds-spacing-0-5: initial;
--ds-spacing-1-5: initial;
--ds-spacing-2-5: initial;
--ds-spacing-3-5: initial;
```

### 1-5. `src/shared/styles/shell-variables.css`
Tooltip 고정 토큰 추가:

```css
--shell-tooltip-padding: 6px 10px;
--shell-tooltip-font-size: 13px;
--shell-tooltip-radius: 6px;
```

---

## Step 2: CSS 하드코딩 교체

### Avatar.module.css
`--ds-size-sm/md/lg`는 신규 토큰이 아니라 ThemeProvider가 `componentHeight`에서 이미 생성하는 기존 토큰 (`32px / 40px / 48px`).
Avatar 사이즈가 `componentHeight`와 우연히 일치하는 것이 아니라, Avatar도 컴포넌트 높이 스케일을 의도적으로 공유하는 것으로 간주.
향후 Avatar 사이즈를 독립적으로 변경해야 한다면 전용 토큰 도입 필요.

```css
/* Before */
.avatar[data-size='sm'] { width: 32px; height: 32px; }
.avatar[data-size='md'] { width: 40px; height: 40px; }
.avatar[data-size='lg'] { width: 48px; height: 48px; }

/* After — 기존 --ds-size-sm/md/lg 토큰 참조 */
.avatar[data-size='sm'] { width: var(--ds-size-sm); height: var(--ds-size-sm); }
.avatar[data-size='md'] { width: var(--ds-size-md); height: var(--ds-size-md); }
.avatar[data-size='lg'] { width: var(--ds-size-lg); height: var(--ds-size-lg); }
```

### Tooltip.module.css
`--shell-tooltip-bg`, `--shell-tooltip-text`는 `shell-variables.css`에 이미 정의되어 있음.
`--shell-tooltip-padding`, `--shell-tooltip-font-size`, `--shell-tooltip-radius` 3개만 신규 추가.
fallback은 방어적 목적으로 추가 (shell-variables.css 로드 실패 시 대비).

```css
/* Before */
padding: 6px 10px;
font-size: 13px;
border-radius: 6px;
color: var(--shell-tooltip-text);          /* 이미 shell-variables.css에 정의됨 */
background-color: var(--shell-tooltip-bg); /* 이미 shell-variables.css에 정의됨 */

/* After */
padding: var(--shell-tooltip-padding);
font-size: var(--shell-tooltip-font-size);
border-radius: var(--shell-tooltip-radius);
color: var(--shell-tooltip-text, #FFFFFF);                 /* fallback 방어적 추가 */
background-color: var(--shell-tooltip-bg, rgba(0,0,0,0.85)); /* fallback 방어적 추가 */
```

### HexInput.module.css
```css
/* Before */
.colorPreview { width: 28px; height: 28px; }
.hexInput { height: 28px; }

/* After */
.colorPreview { width: var(--ds-component-size-color-preview); height: var(--ds-component-size-color-preview); }
.hexInput { height: var(--ds-component-size-color-preview); }
```

### ColorPicker.module.css
```css
/* Before */
.presetColors { gap: 2px; }
.themePresetDot { border: 1px solid var(--ds-color-border-subtle); }
.presetColorDot { border: 1px solid var(--ds-color-border-subtle); }

/* After */
.presetColors { gap: var(--ds-spacing-0-5); }
.themePresetDot { border: var(--ds-border-width, 1px) var(--ds-border-style, solid) var(--ds-color-border-subtle); }
.presetColorDot { border: var(--ds-border-width, 1px) var(--ds-border-style, solid) var(--ds-color-border-subtle); }
```

### ComponentCard.module.css
```css
/* Before */
.usedInBadge { padding: 2px var(--ds-spacing-2); }
.composedOfBadge { padding: 2px var(--ds-spacing-2); }

/* After */
.usedInBadge { padding: var(--ds-spacing-0-5) var(--ds-spacing-2); }
.composedOfBadge { padding: var(--ds-spacing-0-5) var(--ds-spacing-2); }
```

### 전체 CSS — border: 1px solid var(--ds-color-border-*) 교체
대상 파일 (grep: `border: 1px solid var(--ds-`):
- `ColorPicker.module.css` (2곳)
- `CompositionMap.module.css`
- `TokenLab.module.css` (4곳)
- `Playground.module.css` (2곳)
- `DesignSettingsLab.module.css` (5곳)
- `ServiceContext.module.css` (1곳)

패턴: `border: 1px solid var(--ds-color-border-X)` → `border: var(--ds-border-width, 1px) var(--ds-border-style, solid) var(--ds-color-border-X)`

---

## Step 3: Icon 컴포넌트 리팩터링

### Icon.tsx
```tsx
// Before
const sizeMap = { sm: 16, md: 20, lg: 24 } as const;
const sizeValue = typeof size === 'number' ? size : sizeMap[size];
<svg width={sizeValue} height={sizeValue} ...>

// After
// sizeMap 제거. size prop은 'sm' | 'md' | 'lg'만 허용.
// CSS Modules는 camelCase 컨벤션 → sizeSm / sizeMd / sizeLg 클래스명 사용
<span className={clsx(styles.icon, styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`], className)} style={style}>
  <svg width="100%" height="100%" ...>
```

### Icon.module.css
기존 `.icon` 규칙 유지 + size 클래스 추가.
(기존 `flex-shrink: 0` 반드시 보존)

```css
/* @layer ds — 테마 반응형. 모든 토큰 --ds-* 사용. */
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* camelCase 컨벤션 준수 */
.sizeSm { width: var(--ds-icon-size-sm); height: var(--ds-icon-size-sm); }
.sizeMd { width: var(--ds-icon-size-md); height: var(--ds-icon-size-md); }
.sizeLg { width: var(--ds-icon-size-lg); height: var(--ds-icon-size-lg); }
```

### Icon.types.ts
```ts
// Before
size?: 'sm' | 'md' | 'lg' | number;

// After
size?: 'sm' | 'md' | 'lg';
```

---

## 체크리스트

### Step 1
- [ ] `css.ts`: `.` → `-` 치환 추가
- [ ] `sizes.ts`: `iconSize`, `componentSize` 추가
- [ ] `ThemeProvider.tsx`: 신규 토큰 객체 주입 추가
- [ ] `variables.css`: 신규 토큰 문서화
- [ ] `shell-variables.css`: tooltip 토큰 3개 추가

### Step 2
- [ ] `Avatar.module.css`: size 토큰화
- [ ] `Tooltip.module.css`: padding/font-size/radius 토큰화 + fallback 추가
- [ ] `HexInput.module.css`: 28px → color-preview 토큰
- [ ] `ColorPicker.module.css`: gap + border 교체
- [ ] `ComponentCard.module.css`: 2px padding 교체
- [ ] 전체 `border: 1px solid var(--ds-color-border-*)` → ds-border 토큰 패턴

### Step 3
- [ ] `Icon.types.ts`: `number` 제거
- [ ] `Icon.tsx`: sizeMap 제거, SVG width/height 100%
- [ ] `Icon.module.css`: size 클래스 추가
