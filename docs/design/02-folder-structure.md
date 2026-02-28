# 02. Folder Structure

## Overview

에이전틱 코딩과 확장성에 최적화된 폴더 구조를 정의한다.

핵심 원칙:
- 파일명 = 역할 (단일 책임)
- 타입/스타일/로직 분리
- 명시적 export (배럴 패턴)

---

## 전체 구조

```
src/
├── @types/                    # 전역 타입 정의
│   ├── tokens.d.ts
│   ├── theme.d.ts
│   └── components.d.ts
│
├── tokens/
│   ├── primitives/            # 원시 토큰 (외부 입력 포함)
│   │   ├── colors.ts          # 외부 palette 입력점
│   │   ├── spacing.ts
│   │   ├── typography.ts
│   │   ├── borders.ts
│   │   └── index.ts
│   │
│   ├── semantic/              # 의미 기반 토큰
│   │   ├── colors.ts
│   │   ├── shadows.ts
│   │   └── index.ts
│   │
│   └── index.ts               # 토큰 통합 export
│
├── themes/
│   ├── minimal/
│   │   ├── tokens.ts          # Minimal 테마 토큰
│   │   └── index.ts
│   │
│   ├── neumorphism/
│   │   ├── tokens.ts          # Neumorphism 테마 토큰
│   │   └── index.ts
│   │
│   ├── ThemeProvider.tsx      # 테마 컨텍스트 + CSS 변수 주입
│   ├── useTheme.ts            # 테마 훅
│   └── index.ts
│
├── components/
│   ├── Button/
│   │   ├── Button.tsx         # 컴포넌트 구현
│   │   ├── Button.styles.ts   # 스타일 정의
│   │   ├── Button.types.ts    # Props 타입
│   │   └── index.ts
│   │
│   ├── Card/
│   │   ├── Card.tsx
│   │   ├── Card.styles.ts
│   │   ├── Card.types.ts
│   │   └── index.ts
│   │
│   ├── Input/
│   │   ├── Input.tsx
│   │   ├── Input.styles.ts
│   │   ├── Input.types.ts
│   │   └── index.ts
│   │
│   ├── Navigation/
│   │   ├── Navigation.tsx
│   │   ├── Navigation.styles.ts
│   │   ├── Navigation.types.ts
│   │   └── index.ts
│   │
│   └── index.ts               # 컴포넌트 배럴 export
│
├── utils/
│   ├── color.ts               # 색상 유틸 (lighten, darken, etc.)
│   ├── css.ts                 # CSS 변수 주입 유틸
│   └── index.ts
│
├── constants/
│   └── index.ts               # 매직 넘버/문자열 상수
│
├── pages/
│   └── Exhibition/
│       ├── Exhibition.tsx     # 전시 페이지
│       ├── Exhibition.styles.ts
│       └── index.ts
│
├── App.tsx                    # 앱 진입점
├── main.tsx                   # React 렌더링
└── index.css                  # 글로벌 리셋 스타일
```

---

## 디렉토리별 역할

### `@types/`

전역 타입 정의. 여러 모듈에서 공유하는 인터페이스.

```typescript
// @types/tokens.d.ts
export interface ExternalPalette {
  primary: string;
  secondary?: string;
  accent?: string;
  sub?: string;
}
```

### `tokens/primitives/`

원시 토큰. 순수한 값만 정의. 외부 입력 색상이 여기로 들어옴.

```typescript
// tokens/primitives/colors.ts
export const defaultPalette: ExternalPalette = {
  primary: '#6366F1',
};
```

### `tokens/semantic/`

의미 기반 토큰. primitives를 참조하여 용도별 매핑.

```typescript
// tokens/semantic/colors.ts
export function createSemanticColors(palette: ResolvedPalette) {
  return {
    bg: { primary: palette.sub, ... },
    text: { primary: palette.primary, ... },
  };
}
```

### `themes/`

테마별 토큰 구성과 ThemeProvider.

```typescript
// themes/minimal/tokens.ts
export function createMinimalTheme(palette: ResolvedPalette): Theme {
  return { name: 'minimal', ... };
}
```

### `components/`

UI 컴포넌트. 각 컴포넌트는 독립 폴더로 구성.

```
Button/
├── Button.tsx       # 로직
├── Button.styles.ts # CSS 변수 기반 스타일
├── Button.types.ts  # Props 인터페이스
└── index.ts         # export { Button } from './Button'
```

### `utils/`

공통 유틸리티 함수.

```typescript
// utils/color.ts
export function lighten(color: string, amount: number): string;
export function darken(color: string, amount: number): string;
```

### `pages/`

페이지 단위 컴포넌트. POC에서는 Exhibition 단일 페이지.

---

## 네이밍 컨벤션

### 파일명

| 유형 | 패턴 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `Button.tsx` |
| 타입 | PascalCase + `.types.ts` | `Button.types.ts` |
| 스타일 | PascalCase + `.styles.ts` | `Button.styles.ts` |
| 유틸 | camelCase | `color.ts` |
| 상수 | camelCase 또는 UPPER_CASE | `constants/index.ts` |

### 변수/함수명

| 유형 | 패턴 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `Button`, `ThemeProvider` |
| 함수 | camelCase | `createTheme`, `resolvePalette` |
| 상수 | camelCase 또는 UPPER_CASE | `defaultPalette`, `CSS_VAR_PREFIX` |
| 타입/인터페이스 | PascalCase | `ButtonProps`, `Theme` |

### CSS 변수

```
--{prefix}-{category}-{property}-{variant}

예시:
--ds-color-bg-primary
--ds-color-text-secondary
--ds-shadow-md
--ds-spacing-4
--ds-radius-md
```

---

## Import 규칙

### Path Alias 사용

```typescript
// Good
import { Button } from '@components/Button';
import { useTheme } from '@themes';
import type { Theme } from '@/@types/theme';

// Bad
import { Button } from '../../../components/Button';
```

### 배럴 Export

```typescript
// components/index.ts
export { Button } from './Button';
export { Card } from './Card';
export { Input } from './Input';
export { Navigation } from './Navigation';

// 사용
import { Button, Card, Input } from '@components';
```

---

## 에이전틱 친화 포인트

```
✅ 파일명으로 역할 즉시 파악
   Button.types.ts → "타입 정의 파일"

✅ 단일 책임 원칙
   한 파일 = 한 가지 역할

✅ 배럴 export로 import 단순화
   AI가 참조 경로 쉽게 파악

✅ 타입 파일 분리
   API 변경 시 영향 범위 명확
```
