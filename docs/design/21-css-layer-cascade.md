# 21. CSS @layer Cascade 체계

## 목적

CSS custom property 간 우선순위를 브라우저 레벨에서 강제하여, 선택자 특이성에 의존하지 않고 의도된 cascade 순서를 보장한다.

## 레이어 순서

```css
@layer reset, tokens, shell, ds, preview, override;
```

| 순서 | Layer | 역할 | 대상 |
|------|-------|------|------|
| 1 | `reset` | CSS 리셋 | `reset.css` |
| 2 | `tokens` | 변수 선언 (`:root`) | `variables.css`, `shell-variables.css :root`, `sys-variables.css`, `transitions.css`, `fonts.css` |
| 3 | `shell` | 앱 크롬 UI + surface 차단 | `[data-shell]` 규칙, `/* @layer shell */` 모듈 CSS |
| 4 | `ds` | 테마 반응형 컴포넌트 | `/* @layer ds */` 모듈 CSS |
| 5 | `preview` | preview 영역 surface 복원 | `[data-shell] [data-context="preview"]` 규칙 |
| 6 | `override` | 로컬 스코프 오버라이드 | `/* @layer mixed */` 모듈 CSS, 컴포넌트별 로컬 테마 |

**낮은 번호 → 높은 번호 순으로 우선순위가 높아진다.** 같은 custom property를 같은 요소에 선언하면, 더 높은 레이어의 값이 적용된다.

## 레이어별 규칙

### `reset`
- 원소 기본 스타일 초기화
- `--ds-*` 토큰 참조 가능 (body 색상 등)

### `tokens`
- `:root`에 CSS 변수 선언 (IDE 자동완성 + 문서화)
- 실제 값은 ThemeProvider JS에서 `setProperty()`로 주입
- `--shell-*`, `--sys-*` 값은 이 레이어에서 확정

### `shell`
- `[data-shell]` 컨텍스트에서 surface 효과 차단
- `--shell-*` 토큰을 직접 참조하는 크롬 컴포넌트 (Header, Nav, Footer, Lab 정보 영역)
- `--ds-color-*` 재정의 없음 — DS 컴포넌트는 shell 내에서도 테마에 반응

### `ds`
- `--ds-*` 토큰을 사용하는 테마 반응형 컴포넌트 (Button, Card, Input, Select 등)
- 전역 테마 변경 시 외형이 바뀜

### `preview`
- `[data-shell] [data-context="preview"]` 선택자로 surface 효과 복원
- `[data-shell]`이 차단한 `--ds-surface-*` 값을 `--ds-*-global` 앨리어스로 복원
- **`[data-scope="local"]`이 있으면 복원하지 않음** (`:not([data-scope="local"])`)

### `override`
- 크롬 + 프리뷰가 혼합된 컴포넌트 (모달, 비교 카드 등)
- ComparisonCard의 로컬 테마 적용 등

## data 속성 계층

```
[data-shell]                                          → shell 격리
  [data-context="preview"]                            → 전역 테마 surface 복원
  [data-context="preview"][data-scope="local"]        → 로컬 테마 (inline styleVars 유효)
```

`data-scope="local"`은 ComparisonCard처럼 카드별 독립 테마를 적용할 때 사용한다. 이 속성이 있으면 `preview` 레이어의 전역 복원 규칙이 `:not()` 조건에 의해 적용되지 않으므로, inline `style`로 전달된 `styleVars`가 그대로 유효하다.

## CSS Modules 적용 방법

각 `.module.css` 파일의 전체 내용을 해당 `@layer` 블록으로 래핑한다:

```css
/* 변경 전 */
/* @layer shell — 크롬(--shell-*). */
.root { color: var(--shell-text-primary); }

/* 변경 후 */
@layer shell {
  .root { color: var(--shell-text-primary); }
}
```

기존 `/* @layer X */` 주석은 제거하고 실제 `@layer` 블록으로 대체한다.

## Unlayered 스타일

`@layer`에 속하지 않는 스타일(unlayered)은 모든 레이어보다 우선순위가 높다. 현재 프로젝트에서 의도적으로 unlayered로 남기는 것:

- `index.css`의 `@layer` 순서 선언 자체
- ThemeProvider가 JS로 주입하는 inline `style` (`:root`의 `setProperty()`)

## 참고

- CSS `@layer` 명세: [MDN - @layer](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)
- Vite는 CSS Modules 내부의 `@layer`를 네이티브로 처리 (별도 플러그인 불필요)
