# P02: 토큰 시스템 완성

## 목표
CSS에서 토큰 없이 하드코딩된 값을 제거하고, 누락된 토큰을 정의한다.
테마가 바뀌어도 모든 값이 토큰을 통해 일관되게 반응하는 상태.

## 구현 상세

### 허용 예외 (토큰화 불필요)
- `transform: translateY(1px / -2px)` — 물리적 인터랙션 상수. 테마 무관.
- `border: 1px solid transparent` — 레이아웃 트릭 (hover 시 색만 바뀜).
- `border: 1px solid var(--shell-*)` — shell 크롬은 테마 무관 고정 1px.

### border 처리 기준
- `border: 1px solid var(--ds-color-border-*)` → `var(--ds-border-width, 1px) var(--ds-border-style, solid) var(--ds-color-border-*)` 교체
- shell 컨텍스트 border는 그대로 유지

### Icon size prop 처리
- 숫자 `size` prop 제거. `'sm' | 'md' | 'lg'` 문자열만 허용.
- SVG는 `width="100%" height="100%"` 고정. `<span>` 크기를 CSS로 제어.
- (프로젝트 전체에서 숫자 size prop 사용 케이스 없음 확인됨)

### 구현 전략: Step 방식
Step 1 (토큰 파이프라인) → Step 2 (CSS 교체) → Step 3 (Icon 리팩터링) 순서로 각 단계를 독립 커밋.

---

### Step 1: 토큰 파이프라인 수정

**`src/shared/utils/css.ts`**
`kebabKey` 생성 직후에 `.` → `-` 치환 추가.
```ts
const kebabKey = toKebabCase(key).replace(/\./g, '-');
```
효과: `spacing['0.5']` → `--ds-spacing-0-5`, `1.5` → `--ds-spacing-1-5` 등 자동 처리.

**`src/domain/tokens/global/sizes.ts`**
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

**`src/domain/themes/ThemeProvider.tsx`**
import에 `iconSize`, `componentSize` 추가 후 `flattenToCSSVars`에 주입:
```ts
'icon-size': iconSize,         // → --ds-icon-size-sm/md/lg
'component-size': componentSize, // → --ds-component-size-color-preview
```

**`src/shared/styles/variables.css`**
신규 토큰 문서화 추가:
```css
--ds-icon-size-sm: initial;
--ds-icon-size-md: initial;
--ds-icon-size-lg: initial;
--ds-component-size-color-preview: initial;
--ds-spacing-0-5: initial;
--ds-spacing-1-5: initial;
--ds-spacing-2-5: initial;
--ds-spacing-3-5: initial;
```

**`src/shared/styles/shell-variables.css`**
Tooltip 고정 토큰 추가:
```css
--shell-tooltip-padding: 6px 10px;
--shell-tooltip-font-size: 13px;
--shell-tooltip-radius: 6px;
```

---

### Step 2: CSS 하드코딩 교체

**Avatar.module.css** — `--ds-size-sm/md/lg`는 ThemeProvider가 `componentHeight`에서 이미 생성하는 기존 토큰 (32/40/48px). 신규 토큰 불필요, 참조만 추가.
```css
.avatar[data-size='sm'] { width: var(--ds-size-sm); height: var(--ds-size-sm); }
.avatar[data-size='md'] { width: var(--ds-size-md); height: var(--ds-size-md); }
.avatar[data-size='lg'] { width: var(--ds-size-lg); height: var(--ds-size-lg); }
```

**Tooltip.module.css** — `--shell-tooltip-bg`, `--shell-tooltip-text`는 이미 정의됨. 3개만 신규. fallback은 방어적 목적.
```css
padding: var(--shell-tooltip-padding);
font-size: var(--shell-tooltip-font-size);
border-radius: var(--shell-tooltip-radius);
color: var(--shell-tooltip-text, #FFFFFF);
background-color: var(--shell-tooltip-bg, rgba(0,0,0,0.85));
```

**HexInput.module.css**
```css
.colorPreview { width: var(--ds-component-size-color-preview); height: var(--ds-component-size-color-preview); }
.hexInput { height: var(--ds-component-size-color-preview); }
```

**ColorPicker.module.css**
```css
.presetColors { gap: var(--ds-spacing-0-5); }
.themePresetDot { border: var(--ds-border-width, 1px) var(--ds-border-style, solid) var(--ds-color-border-subtle); }
.presetColorDot { border: var(--ds-border-width, 1px) var(--ds-border-style, solid) var(--ds-color-border-subtle); }
```

**ComponentCard.module.css**
```css
.usedInBadge { padding: var(--ds-spacing-0-5) var(--ds-spacing-2); }
.composedOfBadge { padding: var(--ds-spacing-0-5) var(--ds-spacing-2); }
```

**전체 `border: 1px solid var(--ds-color-border-*)` 교체 대상 파일:**
- `ColorPicker.module.css` (2곳)
- `CompositionMap.module.css`
- `TokenLab.module.css` (4곳)
- `Playground.module.css` (2곳)
- `DesignSettingsLab.module.css` (5곳)
- `ServiceContext.module.css` (1곳)

---

### Step 3: Icon 컴포넌트 리팩터링

**Icon.types.ts** — `number` 제거
```ts
size?: 'sm' | 'md' | 'lg'; // number 제거
```

**Icon.tsx** — sizeMap 제거, CSS Modules camelCase 클래스 사용
```tsx
// sizeMap 제거
<span className={clsx(styles.icon, styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`], className)} style={style}>
  <svg width="100%" height="100%" ...>
```

**Icon.module.css** — 기존 `.icon` 유지 (flex-shrink: 0 보존) + size 클래스 추가
```css
.sizeSm { width: var(--ds-icon-size-sm); height: var(--ds-icon-size-sm); }
.sizeMd { width: var(--ds-icon-size-md); height: var(--ds-icon-size-md); }
.sizeLg { width: var(--ds-icon-size-lg); height: var(--ds-icon-size-lg); }
```

## 체크리스트

### Step 1: 토큰 파이프라인
- [ ] `css.ts`: kebabKey에 `.` → `-` 치환 추가
- [ ] `sizes.ts`: `iconSize`, `componentSize` 추가
- [ ] `ThemeProvider.tsx`: import + flattenToCSSVars에 신규 토큰 추가
- [ ] `variables.css`: 신규 토큰 문서화
- [ ] `shell-variables.css`: tooltip 토큰 3개 추가

### Step 2: CSS 교체
- [ ] `Avatar.module.css`: 32/40/48px → --ds-size-sm/md/lg
- [ ] `Tooltip.module.css`: padding/font-size/radius 토큰화 + fallback 추가
- [ ] `HexInput.module.css`: 28px → --ds-component-size-color-preview
- [ ] `ColorPicker.module.css`: gap 2px + border 1px 교체
- [ ] `ComponentCard.module.css`: padding 2px 교체
- [ ] 전체 `border: 1px solid var(--ds-color-border-*)` → ds-border 토큰 패턴 (15곳)

### Step 3: Icon 리팩터링
- [ ] `Icon.types.ts`: size에서 number 제거
- [ ] `Icon.tsx`: sizeMap 제거, SVG 100%, span CSS 크기 제어
- [ ] `Icon.module.css`: sizeSm/sizeMd/sizeLg 클래스 추가
