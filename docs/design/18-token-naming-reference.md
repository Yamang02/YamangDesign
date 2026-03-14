# 18. Token Naming Reference

디자인 토큰 CSS 변수 네이밍 컨벤션. 신규 토큰 추가 및 스타일 작성 시 준수.

---

## 접두사

| 접두사 | 용도 |
|--------|------|
| `--ds-` | 디자인 시스템 토큰. 테마/팔레트 변경 시 함께 변경됨. |
| `--ui-` | 사이트 shell 전용(헤더, 네비, 설정 패널 등). 테마와 무관하게 고정. |

---

## 구조

- 형식: `--{prefix}-{category}-{sub?-}{name}` (전부 kebab-case)
- 객체 키는 camelCase → CSS 변수 시 kebab-case 자동 변환 (`src/utils/css.ts`)

---

## Category별 패턴

### color

- **원시(팔레트 스케일)**: `--ds-color-{scale}-{step}`
  - 예: `--ds-color-primary-500`, `--ds-color-neutral-100`
- **Alias(의미 역할)**: `--ds-color-{role}-{name}`
  - role: `bg`, `text`, `border`, `action`, `feedback` 등
  - 예: `--ds-color-bg-base`, `--ds-color-text-primary`, `--ds-color-action-primary-default`, `--ds-color-border-focus`
- **시스템(에러/경고 등)**: `--ds-color-system-{name}-{step}` 예: `--ds-color-system-error-500`

### spacing

- `--ds-spacing-{key}` (숫자 또는 semantic key)
- 예: `--ds-spacing-1`, `--ds-spacing-4`, `--ds-spacing-6`

### typography

- **Text Style(권장)**: `--ds-text-{style}-{property}`
  - property: `size`, `leading`, `weight`, `font`
  - 예: `--ds-text-heading-1-size`, `--ds-text-body-md-leading`, `--ds-text-label-weight`
- **Font 원시**: `--ds-font-{name}` (sans, mono, display)
- **원시(global)** : `--ds-text-{size}`, `--ds-leading-{key}` 등 — 텍스트 스타일과 구분해 사용

### motion

- **duration**: `--ds-duration-{key}` (instant, fast, normal, slow, slower)
- **easing**: `--ds-ease-{key}` (linear, easeIn, easeOut, easeInOut, productive, expressive)
- **state layer**: `--ds-state-{state}-opacity` (hover, pressed, focus, selected, disabled)
- **transition 레시피**: `--ds-transition-{name}` (color, shadow, transform, interactive, interactive-full, theme)

### radius / border

- `--ds-radius-{key}` (none, sm, md, lg, xl, 2xl, full)
- `--ds-border-{key}` (width: none, thin, medium, thick — 스타일별 border 객체와 구분)

### elevation / shadow

- **원시**: `--ds-elevation-{key}` (none, sm, md, lg, xl, inset)
- **Alias**: `--ds-shadow-{key}` (테마별 shadow 매핑)

### size / z-index

- **컴포넌트 높이**: `--ds-size-{key}` (xs, sm, md, lg, xl)
- **z-index**: `--ds-z-{layer}` (base, dropdown, sticky, overlay, modal, popover, tooltip)

---

## 금지 / 주의

- **컴포넌트·페이지 CSS/TSX**: hex, rgb, named color 직접 사용 금지. 반드시 `var(--ds-*)` 또는 `var(--ui-*)` 사용.
- **예외**: 토큰·프리셋 **정의** 파일(`*presets*.ts`, `*mappings*.ts`, palette preset 소스, `uiTokens` 등) 내부의 원시값.
- Text style과 원시 타이포 혼용 시: 스타일 기반은 `--ds-text-{style}-size` 등, 원시만 쓸 때는 의미를 문서에 명시.

---

## 참고

- [17. Token 3-Tier Architecture Reference](./17-token-3tier-reference.md)
- `src/tokens/global/`, `src/tokens/typography/`, `src/themes/ThemeProvider.tsx`
