# P01: 사조별 토큰 오버라이드

## 목표

각 StyleDefinition의 `createVars()`를 통해 radius·motion 토큰을 사조별로 다르게 주입하여, 같은 `--ds-radius-md`가 Brutalism에서는 0px, Glassmorphism에서는 16px이 되도록 한다.

## 구현 상세

### 접근 방법

`StyleDefinition` 인터페이스를 수정하지 않는다. 기존 `createVars()` 훅의 반환값에 radius·motion 키를 포함하는 것을 **공식 관례**로 채택한다.

현재 `extractStyleVars()`가 `createVars()` 출력을 병합하고, `ThemeProvider`의 `injectCSSVariables()`가 이를 `:root`에 주입한다. `primitiveCSSVars`보다 `paletteStyleVars`가 나중에 전개되므로, createVars에서 같은 CSS 변수 이름을 반환하면 자연스럽게 전역값을 오버라이드한다.

### 사조별 오버라이드 값

| 토큰 | Minimal | Neumorphism | Brutalism | Glassmorphism |
|------|---------|-------------|-----------|---------------|
| `--ds-radius-sm` | 4px | 8px | 0 | 8px |
| `--ds-radius-md` | 8px | 12px | 0 | 16px |
| `--ds-radius-lg` | 12px | 16px | 0 | 20px |
| `--ds-radius-xl` | 16px | 20px | 0 | 24px |
| `--ds-radius-full` | 9999px | 9999px | 0 | 9999px |
| `--ds-duration-fast` | 100ms | 200ms | 0ms | 150ms |
| `--ds-duration-normal` | 200ms | 350ms | 50ms | 250ms |
| `--ds-duration-slow` | 300ms | 500ms | 100ms | 400ms |
| `--ds-ease-default` | ease-out | ease-in-out | linear | ease |

### 변경 파일

- `src/domain/styles/presets/minimal.ts` — createVars에 radius·motion 추가 (또는 신규 정의)
- `src/domain/styles/presets/neumorphism.ts` — 동일
- `src/domain/styles/presets/brutalism.ts` — 동일
- `src/domain/styles/presets/glassmorphism.ts` — 동일
- `docs/design/20-style-system-review.md` — "해결 방향" 섹션에 관례 확정 반영

### 주의사항

- `injectCSSVariables`의 전개 순서(`...primitiveCSSVars, ...paletteStyleVars`)가 오버라이드를 보장하는지 확인. 같은 키가 있으면 뒤의 값이 우선한다.
- 기존 전역 기본값(`borders.ts`, `motion.ts`)은 제거하지 않는다. createVars가 없는 미래 스타일은 전역값을 그대로 사용하게 된다.

### 문서 보완(계약/검증)
- `createVars()` 반환 키 이름은 전역 토큰 네이밍(`--ds-radius-...`, `--ds-duration-...`, `--ds-ease-default`)과 1:1로 매핑되어야 한다.
- `createVars()`의 인자 시그니처(예: `{ bgColor }`)는 P04의 Overview 추출 로직과 호환되어야 한다. “인자를 읽는 스타일/안 읽는 스타일” 모두 안전하게 동작해야 한다.
- 반대로, P04에서 dummy 인자로 주입할 값의 규격(예: `bgColor`가 문자열 hex인지)을 고정한다.

## 체크리스트

- [ ] minimal.ts의 createVars에 radius 오버라이드 값 추가
- [ ] neumorphism.ts의 createVars에 radius 오버라이드 값 추가
- [ ] brutalism.ts의 createVars에 radius·motion 오버라이드 값 추가
- [ ] glassmorphism.ts의 createVars에 radius·motion 오버라이드 값 추가
- [ ] ThemeProvider에서 primitiveCSSVars보다 paletteStyleVars가 후순위로 전개되는지 확인
- [ ] createVars 반환 키가 전역 토큰(`--ds-radius-*`, `--ds-duration-*`)과 정확히 일치하는지 확인
- [ ] `createVars()` 인자 시그니처가 P04 Overview 추출에서 사용하는 인자와 호환되는지 확인
- [ ] 브라우저에서 4개 사조 전환 시 radius·motion 값이 실제로 달라지는지 DevTools로 확인
- [ ] 20-style-system-review.md에 관례 확정 내용 반영
