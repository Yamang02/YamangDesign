# E01: CSS Modules 인프라 구축

## 목표

CSS Modules를 프로젝트에 도입하고, 개발 경험을 위한 타입 지원 설정.

---

## 작업 항목

### 1. TypeScript 타입 선언

```typescript
// src/@types/css-modules.d.ts
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
```

### 2. Vite 설정 확인

Vite는 CSS Modules를 기본 지원. 추가 설정 불필요.

```typescript
// vite.config.ts - 이미 지원됨
// .module.css 파일은 자동으로 CSS Modules로 처리
```

### 3. 공통 스타일 변수 파일

```css
/* src/styles/variables.css */
/*
 * 이 파일은 참조용.
 * 실제 변수는 ThemeProvider에서 JS로 주입됨.
 * IDE 자동완성을 위한 힌트 제공.
 */

:root {
  /* Colors - 테마에서 주입 */
  --ds-color-bg-base: initial;
  --ds-color-bg-surface: initial;
  --ds-color-bg-elevated: initial;
  --ds-color-bg-muted: initial;

  --ds-color-text-primary: initial;
  --ds-color-text-secondary: initial;
  --ds-color-text-muted: initial;
  --ds-color-text-onAction: initial;

  --ds-color-border-default: initial;
  --ds-color-border-subtle: initial;
  --ds-color-border-focus: initial;

  --ds-color-action-primary-default: initial;
  --ds-color-action-primary-hover: initial;
  --ds-color-action-primary-active: initial;

  /* Spacing */
  --ds-spacing-1: 4px;
  --ds-spacing-2: 8px;
  --ds-spacing-3: 12px;
  --ds-spacing-4: 16px;
  --ds-spacing-5: 20px;
  --ds-spacing-6: 24px;
  --ds-spacing-8: 32px;

  /* Typography */
  --ds-text-xs: 0.75rem;
  --ds-text-sm: 0.875rem;
  --ds-text-md: 1rem;
  --ds-text-lg: 1.125rem;
  --ds-text-xl: 1.25rem;

  --ds-font-weight-normal: 400;
  --ds-font-weight-medium: 500;
  --ds-font-weight-semibold: 600;
  --ds-font-weight-bold: 700;

  /* Borders */
  --ds-radius-sm: 4px;
  --ds-radius-md: 8px;
  --ds-radius-lg: 12px;
  --ds-radius-full: 9999px;

  /* Shadows - 테마에서 주입 */
  --ds-shadow-sm: initial;
  --ds-shadow-md: initial;
  --ds-shadow-lg: initial;

  /* Sizes */
  --ds-size-sm: 32px;
  --ds-size-md: 40px;
  --ds-size-lg: 48px;

  /* Z-index */
  --ds-z-dropdown: 100;
  --ds-z-modal: 200;
  --ds-z-tooltip: 300;

  /* Transitions */
  --ds-transition-fast: 100ms ease-out;
  --ds-transition-normal: 200ms ease-out;
  --ds-transition-slow: 300ms ease-out;
}
```

### 4. clsx 유틸 강화

```typescript
// src/utils/clsx.ts
type ClassValue = string | undefined | null | false | { [key: string]: boolean };

export function clsx(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string') {
      classes.push(input);
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }

  return classes.join(' ');
}
```

### 5. 기본 reset/normalize 스타일

```css
/* src/styles/reset.css */
*,
*::before,
*::after {
  box-sizing: border-box;
}

* {
  margin: 0;
}

html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--ds-font-sans);
  line-height: 1.5;
  color: var(--ds-color-text-primary);
  background-color: var(--ds-color-bg-base);
}

button {
  font: inherit;
  color: inherit;
  background: none;
  border: none;
  cursor: pointer;
}

input {
  font: inherit;
  color: inherit;
}

a {
  color: inherit;
  text-decoration: none;
}

ul, ol {
  list-style: none;
  padding: 0;
}
```

---

## 폴더 구조 변경

```
src/
├── @types/
│   ├── css-modules.d.ts    # [NEW]
│   └── ...
├── styles/                  # [NEW]
│   ├── reset.css
│   └── variables.css
└── ...
```

---

## 완료 기준

- [ ] `*.module.css` 파일 import 시 타입 에러 없음
- [ ] CSS 변수 IDE 자동완성 동작
- [ ] clsx 유틸 정상 동작
- [ ] 빌드 통과

---

## 예상 소요

- 설정 작업: 단순
- 영향 범위: 없음 (기존 코드 수정 없음)
