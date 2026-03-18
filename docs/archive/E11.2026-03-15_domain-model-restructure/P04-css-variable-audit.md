# P04: CSS 변수 감사

## 목표

모든 컴포넌트 CSS 모듈이 사용하는 `--ds-*` 변수와 `ThemeTokenSet`이 생성하는 변수 집합을 대조한다.
커버되지 않는 변수를 모두 해소하여 "ThemeTokenSet = 컴포넌트가 필요로 하는 모든 테마 변수"를 보장한다.

## 구현 상세

### 감사 방법

1. 전체 CSS 모듈(`src/**/*.module.css`, `src/styles/**/*.css`)에서 `var(--ds-*)` 패턴 추출
2. `buildTokenSet(defaultPalette, minimalStyle)`의 `flattenTokenSet` 결과 키 목록과 대조
3. CSS에는 있지만 `ThemeTokenSet`에 없는 변수 목록 작성 → 각각 처리 결정

### 예상 발견 항목

감사 전 코드 분석에서 예상되는 누락 변수:

| 변수명 | 발견 위치 | 예상 처리 |
|---|---|---|
| `--ds-color-bg-subtle` | `ComponentCard.module.css` | `ThemeTokenSet`에 추가 또는 CSS에서 제거 |
| `--ds-border-style` | 여러 컴포넌트 | `ThemeTokenSet`에 추가 확인 |
| `--ds-color-text-inverse` | 확인 필요 | `combineTheme`에는 있으나 `ThemeTokenSet` 경로 확인 |

### 처리 기준

변수마다 아래 중 하나를 선택:

**A. ThemeTokenSet에 추가** — 의미 있는 테마 반응형 변수이지만 현재 빠진 경우
- `SemanticColors` 또는 `ResolvedStyle`에 필드 추가
- `buildTokenSet` 출력에 포함

**B. CSS에서 수정** — 잘못된 변수명이거나 이미 다른 변수로 대체된 경우
- CSS 모듈의 `var(--ds-X)` → 올바른 변수명으로 교체

**C. 하드코딩으로 전환** — 팔레트/스타일과 무관한 값인 경우
- `var(--ds-X)` → 직접 값(`#FFFFFF` 등)으로 교체

### Primitive 변수 재확인

`--ds-spacing-*`, `--ds-font-*`, `--ds-radius-*` 등 primitive 변수는 `ThemeTokenSet` 대상이 아니다.
이것들은 `ThemeProvider`의 `primitiveCSSVars`로만 주입되는 게 맞다.
감사 시 이 변수들이 `data-context="preview"` 래퍼 내에서도 올바르게 상속되는지 확인.

## 체크리스트

- [x] `src/**/*.module.css`에서 `var(--ds-*)` 전체 목록 추출 (grep 활용)
- [x] `src/styles/**/*.css`에서 `var(--ds-*)` 전체 목록 추출
- [x] `buildTokenSet` 출력 키 목록과 대조하여 미커버 변수 목록 작성
- [x] 각 미커버 변수에 대해 A/B/C 처리 결정 및 적용
- [x] `--ds-color-bg-subtle` 처리 (추가 or 제거)
- [x] 처리 완료 후 전체 컴포넌트 시각적 확인 (Default / 봄빛 크림소다 / Oriental 팔레트)
- [x] Minimal / Neumorphism / Brutalism / Glassmorphism 스타일 각각 확인
- [x] TypeScript 컴파일 오류 없음 확인

## 사후 발견 (P04 완료 후)

P04 감사 범위가 `--ds-*` base 변수에 한정됐으나, `ThemeProvider`가 이후 `-global` 앨리어스
(`--ds-*-global`)를 추가 주입하면서 새로운 누수 경로가 생겼다.
빌드 프리뷰의 inline style이 `-global` 앨리어스를 오버라이드하지 못하는 문제는 **P06에서 해결**.
