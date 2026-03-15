# 02. Folder Structure

## Overview

`src/`는 **domain / app / shared** 3계층으로 구성된다.
계층 경계가 디렉토리 구조에 직접 드러나므로, 새 파일 위치 결정과 도메인 로직 탐색이 즉시 가능하다.

---

## 전체 구조

```
src/
├── domain/                    # 비즈니스 개념의 순수 표현 (React/브라우저 없음)
│   ├── palettes/              # 팔레트 도메인 (palette.ts 유틸 포함)
│   │   ├── mapping/
│   │   ├── presets/
│   │   ├── strategies/
│   │   ├── templates/
│   │   └── types.ts
│   ├── themes/                # 테마 도메인 (ThemeContext, ThemeProvider 포함)
│   │   ├── minimal/
│   │   ├── neumorphism/
│   │   ├── ThemeContext.ts
│   │   ├── ThemeProvider.tsx  # React 의존성 있음 — 예외적 위치
│   │   ├── token-set.ts
│   │   └── useTheme.ts
│   ├── tokens/                # 디자인 토큰 (system-colors.ts 유틸 포함)
│   │   ├── global/
│   │   ├── primitives/
│   │   ├── semantic/
│   │   ├── typography/
│   │   └── ui/
│   ├── styles/                # 스타일 도메인 (.ts 파일만 — preset 로직, CSS var 생성)
│   │   └── presets/
│   └── constants/             # 도메인 상수 (palette-definitions, theme-presets 등)
│
├── app/                       # React 애플리케이션 레이어
│   ├── components/            # 재사용 UI 컴포넌트
│   ├── pages/                 # 페이지 뷰
│   ├── layouts/               # 레이아웃 컴포넌트
│   ├── hooks/                 # React 훅 (도메인↔UI 브리지 포함)
│   ├── state/                 # 앱 상태
│   ├── content/               # 정적 콘텐츠 (JSON, 페이지 텍스트)
│   ├── config/                # 앱 설정
│   └── infra/                 # 외부 경계 (localStorage, 파일 export)
│       ├── storage.ts
│       └── export.ts
│
├── shared/                    # 계층 지식 없는 범용 유틸/자원
│   ├── utils/                 # 순수 함수 (clsx, css helpers, color 연산)
│   ├── styles/                # 전역 CSS 파일 (reset, variables, transitions 등)
│   ├── @types/                # TypeScript ambient declarations
│   └── assets/                # 정적 자산
│
└── App.tsx                    # 앱 진입점
```

---

## 계층 정의

### `domain/`

비즈니스 개념을 표현하는 순수 TypeScript 코드.
원칙적으로 React/브라우저 의존성을 갖지 않는다.

> **예외**: `themes/ThemeProvider.tsx`는 React Context 특성상 domain에 위치한다.
> Context가 도메인 개념(Theme 상태)의 단일 소스이기 때문.

| 디렉토리 | 역할 |
|---|---|
| `palettes/` | 팔레트 정의, 스케일 생성, 시맨틱 매핑, 팔레트 프리셋 |
| `themes/` | ThemeContext, ThemeProvider, TokenSet 빌더 |
| `tokens/` | 글로벌 토큰, 시맨틱 토큰, 타이포그래피 토큰 |
| `styles/` | 스타일 프리셋 로직 (.ts), CSS 변수 생성 함수 |
| `constants/` | 팔레트·스타일·시맨틱 정의 상수 |

### `app/`

React 기반 애플리케이션 동작 코드.
도메인 개념을 UI와 연결하는 모든 코드가 여기 위치한다.

| 디렉토리 | 역할 |
|---|---|
| `components/` | 재사용 가능한 UI 컴포넌트 |
| `pages/` | 라우트 단위 페이지 컴포넌트 |
| `layouts/` | 레이아웃 컴포넌트 |
| `hooks/` | 도메인 훅(`usePalettePresets` 등) 포함 React 훅 |
| `state/` | PaletteSelection 등 앱 상태 관리 |
| `content/` | 페이지별 정적 콘텐츠 (JSON, 텍스트 상수) |
| `config/` | 네비게이션, 사이트 스타일 설정 |
| `infra/` | localStorage CRUD, 파일 export 등 외부 시스템 경계 |

### `shared/`

도메인 지식도 앱 지식도 없는 범용 코드.
`domain/`과 `app/` 모두 이 계층에 의존할 수 있다.

| 디렉토리 | 역할 |
|---|---|
| `utils/` | `clsx`, CSS 헬퍼, 색상 연산 등 순수 함수 |
| `styles/` | 전역 CSS 파일 (reset, variables, fonts 등) |
| `@types/` | TypeScript ambient declarations |
| `assets/` | 이미지, 폰트 등 정적 자산 |

---

## 의존성 방향

```
app/  →  domain/  →  shared/
app/  →  shared/
```

- `domain/`은 `app/`을 import하지 않는다
- `shared/`는 `domain/`과 `app/`을 import하지 않는다

---

## "어디에 넣어야 하나?" 판단 기준

| 조건 | 위치 |
|---|---|
| `import React` / `useState` / `useEffect` 등 React hook이 있다 | `app/` |
| `localStorage` / `fetch` / 파일 I/O가 있다 | `app/infra/` |
| palette / theme / token 개념을 다루되 React 없다 | `domain/` |
| 어떤 도메인 지식도 없는 순수 함수다 | `shared/utils/` |
| 전역 CSS 파일이다 | `shared/styles/` |
| 페이지별 정적 텍스트/JSON 콘텐츠다 | `app/content/` |
| 앱 동작 설정 (라우트, 기본값) 이다 | `app/config/` |

---

## 컴포넌트 디렉토리 구조

각 컴포넌트는 독립 폴더로 구성한다.

```
app/components/Button/
├── Button.tsx          # 컴포넌트 구현
├── Button.module.css   # CSS Modules 스타일
├── Button.types.ts     # Props 타입
└── index.ts            # export { Button } from './Button'
```

---

## 네이밍 컨벤션

### 파일명

| 유형 | 패턴 | 예시 |
|---|---|---|
| 컴포넌트 | PascalCase | `Button.tsx` |
| 타입 | PascalCase + `.types.ts` | `Button.types.ts` |
| 훅 | camelCase + `use` prefix | `useTheme.ts` |
| 유틸 | camelCase | `color.ts` |
| 상수/설정 | camelCase | `theme-presets.ts` |

### CSS 변수

```
--{prefix}-{category}-{property}-{variant}

예시:
--ds-color-bg-base
--ds-color-text-primary
--ds-shadow-md
--ds-spacing-4
--ds-radius-md
```

---

## Import 규칙

### Path Alias

```typescript
// tsconfig.json에 정의된 alias 사용
import { Button } from '@app/components/Button';
import { createPalette } from '@domain/palettes';
import { clsx } from '@shared/utils/clsx';

// 상대 경로는 같은 계층 내부에서만 허용
import { PaletteType } from './types';
```

### 배럴 Export

```typescript
// app/components/index.ts
export { Button } from './Button';
export { Card } from './Card';

// 사용
import { Button, Card } from '@app/components';
```
