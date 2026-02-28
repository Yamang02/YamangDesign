# 09. Theme Switching

## Overview

테마 전환 메커니즘. 전역 상태 하나로 모든 컴포넌트가 즉시 변화.

---

## 핵심 원칙 (PRD 기반)

```
1. 스타일은 토큰으로만 제어
2. 컴포넌트 내부에 스타일 하드코딩 금지
3. 테마 변경은 전역 상태 1개로 처리
```

---

## 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                    ThemeProvider                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  State: { themeName, externalPalette }          │    │
│  └─────────────────────────────────────────────────┘    │
│                          │                               │
│                          ▼                               │
│  ┌─────────────────────────────────────────────────┐    │
│  │  resolvePalette() → createTheme()               │    │
│  └─────────────────────────────────────────────────┘    │
│                          │                               │
│                          ▼                               │
│  ┌─────────────────────────────────────────────────┐    │
│  │  injectCSSVariables() → :root                   │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Components                            │
│   var(--ds-color-bg-primary)                            │
│   var(--ds-shadow-md)                                   │
│   → CSS 변수 참조만 하므로 자동 업데이트                   │
└─────────────────────────────────────────────────────────┘
```

---

## ThemeProvider 구현

```typescript
// themes/ThemeProvider.tsx

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import type { Theme, ThemeName } from '@/@types/theme';
import type { ExternalPalette } from '@/@types/tokens';
import { resolvePalette } from '@/utils/palette';
import { createMinimalTheme } from './minimal';
import { createNeumorphismTheme } from './neumorphism';
import { injectCSSVariables, flattenToCSSVars } from '@/utils/css';

// 기본 팔레트
const defaultPalette: ExternalPalette = {
  primary: '#6366F1',
};

// Context 타입
interface ThemeContextValue {
  theme: Theme;
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
  palette: ExternalPalette;
  setPalette: (palette: ExternalPalette) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// Provider Props
interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: ThemeName;
  initialPalette?: ExternalPalette;
}

export function ThemeProvider({
  children,
  initialTheme = 'minimal',
  initialPalette = defaultPalette,
}: ThemeProviderProps) {
  const [themeName, setThemeName] = useState<ThemeName>(initialTheme);
  const [palette, setPalette] = useState<ExternalPalette>(initialPalette);

  // 테마 객체 생성 (메모이제이션)
  const theme = useMemo(() => {
    const resolved = resolvePalette(palette);

    switch (themeName) {
      case 'minimal':
        return createMinimalTheme(resolved);
      case 'neumorphism':
        return createNeumorphismTheme(resolved);
      default:
        return createMinimalTheme(resolved);
    }
  }, [themeName, palette]);

  // CSS 변수 주입
  useEffect(() => {
    const cssVars = flattenToCSSVars({
      color: theme.colors,
      shadow: theme.shadows,
    });
    injectCSSVariables(cssVars);

    // data 속성으로 테마 표시 (디버깅/CSS 선택자용)
    document.documentElement.setAttribute('data-theme', themeName);
  }, [theme, themeName]);

  const value: ThemeContextValue = {
    theme,
    themeName,
    setThemeName,
    palette,
    setPalette,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

---

## CSS 변수 주입 유틸

```typescript
// utils/css.ts

const CSS_VAR_PREFIX = 'ds';

/**
 * 중첩 객체를 평탄화하여 CSS 변수 객체 생성
 *
 * 입력: { color: { bg: { primary: '#fff' } } }
 * 출력: { '--ds-color-bg-primary': '#fff' }
 */
export function flattenToCSSVars(
  obj: Record<string, unknown>,
  prefix = ''
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    // _meta 등 내부 필드 스킵
    if (key.startsWith('_')) continue;

    const varName = prefix ? `${prefix}-${key}` : key;

    if (typeof value === 'object' && value !== null) {
      Object.assign(
        result,
        flattenToCSSVars(value as Record<string, unknown>, varName)
      );
    } else if (typeof value === 'string') {
      result[`--${CSS_VAR_PREFIX}-${varName}`] = value;
    }
  }

  return result;
}

/**
 * CSS 변수를 :root에 주입
 */
export function injectCSSVariables(vars: Record<string, string>): void {
  const root = document.documentElement;

  for (const [name, value] of Object.entries(vars)) {
    root.style.setProperty(name, value);
  }
}

/**
 * CSS 변수 제거 (테마 전환 시 정리용)
 */
export function removeCSSVariables(varNames: string[]): void {
  const root = document.documentElement;

  for (const name of varNames) {
    root.style.removeProperty(name);
  }
}
```

---

## 사용 예시

### App 설정

```tsx
// App.tsx

import { ThemeProvider } from '@themes';
import { Exhibition } from '@pages/Exhibition';

function App() {
  return (
    <ThemeProvider
      initialTheme="minimal"
      initialPalette={{
        primary: '#6366F1',
        accent: '#F59E0B',
      }}
    >
      <Exhibition />
    </ThemeProvider>
  );
}

export default App;
```

### 테마 토글 버튼

```tsx
// components/ThemeToggle/ThemeToggle.tsx

import { useTheme } from '@themes';

export function ThemeToggle() {
  const { themeName, setThemeName } = useTheme();

  const toggle = () => {
    setThemeName(themeName === 'minimal' ? 'neumorphism' : 'minimal');
  };

  return (
    <button onClick={toggle}>
      {themeName === 'minimal' ? 'Neumorphism' : 'Minimal'}
    </button>
  );
}
```

### 외부 컬러 입력 UI

```tsx
// components/PaletteEditor/PaletteEditor.tsx

import { useTheme } from '@themes';
import { useState } from 'react';

export function PaletteEditor() {
  const { palette, setPalette } = useTheme();
  const [colors, setColors] = useState(palette);

  const handleChange = (key: string, value: string) => {
    setColors(prev => ({ ...prev, [key]: value }));
  };

  const apply = () => {
    setPalette(colors);
  };

  return (
    <div>
      <label>
        Primary:
        <input
          type="color"
          value={colors.primary}
          onChange={(e) => handleChange('primary', e.target.value)}
        />
      </label>

      <label>
        Secondary:
        <input
          type="color"
          value={colors.secondary || ''}
          onChange={(e) => handleChange('secondary', e.target.value)}
        />
      </label>

      <label>
        Accent:
        <input
          type="color"
          value={colors.accent || ''}
          onChange={(e) => handleChange('accent', e.target.value)}
        />
      </label>

      <label>
        Sub:
        <input
          type="color"
          value={colors.sub || ''}
          onChange={(e) => handleChange('sub', e.target.value)}
        />
      </label>

      <button onClick={apply}>Apply</button>
    </div>
  );
}
```

---

## 테마 전환 시퀀스

```
1. 사용자가 테마 토글 클릭
        │
        ▼
2. setThemeName('neumorphism')
        │
        ▼
3. useMemo 트리거 → createNeumorphismTheme(palette)
        │
        ▼
4. useEffect 트리거 → flattenToCSSVars(theme)
        │
        ▼
5. injectCSSVariables() → :root 스타일 업데이트
        │
        ▼
6. 모든 컴포넌트가 var(--ds-xxx) 참조 → 자동 리렌더링
```

---

## 전환 애니메이션

부드러운 테마 전환을 위한 CSS:

```css
/* index.css */

:root {
  /* 전역 전환 효과 */
  transition:
    background-color 0.3s ease-in-out,
    color 0.3s ease-in-out;
}

/* 또는 개별 컴포넌트에서 */
.theme-transition {
  transition:
    background-color var(--ds-duration-slow) var(--ds-ease-in-out),
    box-shadow var(--ds-duration-slow) var(--ds-ease-in-out),
    border-color var(--ds-duration-slow) var(--ds-ease-in-out);
}
```

---

## 타입 정의

```typescript
// @types/theme.d.ts

export type ThemeName = 'minimal' | 'neumorphism';

export interface Theme {
  name: ThemeName;
  colors: ThemeColors;
  shadows: ThemeShadows;
}

export interface ThemeColors {
  bg: {
    base: string;
    surface: string;
    elevated: string;
    muted: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
    onAction: string;
  };
  border: {
    default: string;
    subtle: string;
    focus: string;
  };
  action: {
    primary: ActionColors;
    secondary: ActionColors;
    accent: ActionColors;
  };
}

export interface ActionColors {
  default: string;
  hover: string;
  active?: string;
}

export interface ThemeShadows {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  inset: string;
}
```

---

## 테마 추가 가이드 (확장 시)

새 테마 추가 시:

1. `themes/newtheme/tokens.ts` 생성
2. `createNewTheme(palette)` 함수 구현
3. `ThemeProvider`의 switch 문에 케이스 추가
4. `ThemeName` 타입에 추가

```typescript
// 1. themes/glassmorphism/tokens.ts
export function createGlassmorphismTheme(palette: ResolvedPalette): Theme {
  // ...
}

// 2. ThemeProvider 수정
case 'glassmorphism':
  return createGlassmorphismTheme(resolved);

// 3. 타입 수정
export type ThemeName = 'minimal' | 'neumorphism' | 'glassmorphism';
```

---

## 완료 기준 체크리스트

PRD Definition of Done:

- [ ] 테마 토글 시 모든 컴포넌트 즉시 변화
- [ ] 스타일 하드코딩 없음
- [ ] 테마 추가 시 기존 코드 수정 최소
- [ ] 최소 1개의 shadow 구조가 완전히 다르게 동작
