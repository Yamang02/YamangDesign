# E03: 컴포넌트 CSS 토큰 정합성

## 목표

모든 컴포넌트 CSS가 alias token만 참조하는지 감사하고,
누락·불일치 토큰을 수정한다. 컴포넌트별 사용 토큰 목록을 문서화한다.

---

## 감사 체크리스트

각 컴포넌트 CSS에서 다음을 확인:
1. 하드코딩된 색상값 없는지 (hex, rgb 직접 사용)
2. global token 직접 참조 없는지 (`--ds-color-primary-500` 등)
3. 존재하지 않는 토큰명 참조 없는지
4. E02에서 추가된 `action.*` / `feedback.*` 토큰 활용 가능한지

---

## 컴포넌트별 사용 토큰 목록 (목표 상태)

### Button

| CSS 역할 | 토큰 |
|----------|------|
| primary bg | `--ds-color-action-primary-default` |
| primary bg hover | `--ds-color-action-primary-hover` |
| primary bg active | `--ds-color-action-primary-active` |
| secondary bg | `--ds-color-action-secondary-default` |
| accent bg | `--ds-color-action-accent-default` |
| text on action | `--ds-color-text-on-action` |
| ghost/subtle text | `--ds-color-text-primary` |
| subtle bg | `--ds-color-bg-muted` |
| focus ring | `--ds-color-border-focus` |
| shadow | `--ds-shadow-sm`, `--ds-shadow-md`, `--ds-shadow-inset` |
| border radius | `--ds-radius-md` |
| font | `--ds-text-label-*` |

### Input

| CSS 역할 | 토큰 |
|----------|------|
| bg | `--ds-color-bg-surface` |
| border | `--ds-color-border-default` |
| border hover | `--ds-color-border-accent` |
| border focus | `--ds-color-border-focus` |
| text | `--ds-color-text-primary` |
| placeholder | `--ds-color-text-muted` |
| error border | `--ds-color-feedback-error-border` |
| error text | `--ds-color-feedback-error-text` |

### Card

| CSS 역할 | 토큰 |
|----------|------|
| bg | `--ds-color-bg-surface` |
| border | `--ds-color-border-subtle` |
| shadow | `--ds-shadow-sm` |
| radius | `--ds-radius-lg` |

### Badge

| CSS 역할 | 토큰 |
|----------|------|
| default bg | `--ds-color-bg-muted` |
| default text | `--ds-color-text-secondary` |
| primary bg | `--ds-color-action-primary-default` |
| primary text | `--ds-color-text-on-action` |
| error bg | `--ds-color-feedback-error-bg` |
| error text | `--ds-color-feedback-error-text` |
| error border | `--ds-color-feedback-error-border` |

---

## 수정 규칙

```css
/* ❌ 하드코딩 */
color: #374151;

/* ❌ global token 직접 참조 */
color: var(--ds-color-neutral-700);

/* ✅ alias token 참조 */
color: var(--ds-color-text-secondary);
```

---

## 영향 범위

| 파일 | 변경 내용 |
|------|-----------|
| `src/components/Button/Button.module.css` | 감사 + 수정 |
| `src/components/Input/Input.module.css` | 감사 + 수정 |
| `src/components/Card/Card.module.css` | 감사 + 수정 |
| `src/components/Badge/Badge.module.css` | 감사 + 수정 |
| 기타 컴포넌트 CSS | 감사 + 수정 |
