# 13. Component: Navigation

## Overview

레이아웃과 Spacing 토큰을 검증하는 컴포넌트. 테마 토글 버튼을 포함.

---

## 역할

- layout + spacing 토큰 테스트
- 상단 고정 네비게이션
- 테마 토글 버튼 포함
- 색상 팔레트 입력 UI (POC 확장)

---

## Props 정의

```typescript
// components/Navigation/Navigation.types.ts

export interface NavigationProps {
  /**
   * 브랜드/로고 텍스트
   */
  brand?: string;

  /**
   * 브랜드 클릭 핸들러
   */
  onBrandClick?: () => void;

  /**
   * 테마 토글 표시 여부
   */
  showThemeToggle?: boolean;

  /**
   * 컬러 에디터 표시 여부
   */
  showColorEditor?: boolean;

  /**
   * 네비게이션 링크 목록
   */
  links?: NavigationLink[];

  /**
   * 고정 여부 (sticky)
   */
  sticky?: boolean;

  /**
   * 추가 클래스명
   */
  className?: string;

  /**
   * 우측 영역 커스텀 컨텐츠
   */
  rightContent?: React.ReactNode;
}

export interface NavigationLink {
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}
```

---

## 구조

```
┌─────────────────────────────────────────────────────────────┐
│ Navigation (상단 고정)                                       │
│ ┌───────────┬─────────────────────────┬──────────────────┐  │
│ │  Brand    │      Links              │   Right Content  │  │
│ │  (Logo)   │  [Link1] [Link2] ...    │ [Toggle] [Edit]  │  │
│ └───────────┴─────────────────────────┴──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 스타일 정의

```typescript
// components/Navigation/Navigation.styles.ts

export const navigationStyles = {
  base: `
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--ds-spacing-3) var(--ds-spacing-6);
    background-color: var(--ds-color-bg-surface);
    box-shadow: var(--ds-shadow-sm);
    transition:
      background-color var(--ds-duration-slow) var(--ds-ease-in-out),
      box-shadow var(--ds-duration-slow) var(--ds-ease-in-out);
  `,

  sticky: `
    position: sticky;
    top: 0;
    z-index: var(--ds-z-sticky);
  `,

  // 섹션들
  section: {
    left: `
      display: flex;
      align-items: center;
      gap: var(--ds-spacing-6);
    `,
    center: `
      display: flex;
      align-items: center;
      gap: var(--ds-spacing-4);
    `,
    right: `
      display: flex;
      align-items: center;
      gap: var(--ds-spacing-3);
    `,
  },

  // 브랜드
  brand: `
    font-size: var(--ds-text-xl);
    font-weight: var(--ds-font-bold);
    color: var(--ds-color-action-primary-default);
    text-decoration: none;
    cursor: pointer;
    transition: color var(--ds-duration-fast) var(--ds-ease-out);

    &:hover {
      opacity: 0.8;
    }
  `,

  // 링크
  link: `
    font-size: var(--ds-text-md);
    font-weight: var(--ds-font-medium);
    color: var(--ds-color-text-primary);
    text-decoration: none;
    padding: var(--ds-spacing-2) var(--ds-spacing-3);
    border-radius: var(--ds-radius-md);
    transition:
      color var(--ds-duration-fast) var(--ds-ease-out),
      background-color var(--ds-duration-fast) var(--ds-ease-out);

    &:hover {
      color: var(--ds-color-action-primary-default);
      background-color: var(--ds-color-bg-muted);
    }
  `,

  linkActive: `
    color: var(--ds-color-action-primary-default);
    background-color: var(--ds-color-bg-muted);
  `,

  // 테마 토글
  themeToggle: `
    display: flex;
    align-items: center;
    gap: var(--ds-spacing-2);
    padding: var(--ds-spacing-2) var(--ds-spacing-3);
    border-radius: var(--ds-radius-md);
    background-color: var(--ds-color-bg-muted);
    border: none;
    cursor: pointer;
    font-size: var(--ds-text-sm);
    font-weight: var(--ds-font-medium);
    color: var(--ds-color-text-primary);
    transition:
      background-color var(--ds-duration-fast) var(--ds-ease-out),
      box-shadow var(--ds-duration-normal) var(--ds-ease-out);

    &:hover {
      background-color: var(--ds-color-action-accent-default);
      color: var(--ds-color-text-onAction);
    }
  `,
} as const;
```

---

## 컴포넌트 구현

```tsx
// components/Navigation/Navigation.tsx

import type { NavigationProps } from './Navigation.types';
import { useTheme } from '@themes';
import { clsx } from '@/utils/clsx';

export function Navigation({
  brand = 'Design System',
  onBrandClick,
  showThemeToggle = true,
  showColorEditor = false,
  links = [],
  sticky = true,
  className,
  rightContent,
}: NavigationProps) {
  const { themeName, setThemeName } = useTheme();

  const toggleTheme = () => {
    setThemeName(themeName === 'minimal' ? 'neumorphism' : 'minimal');
  };

  return (
    <nav
      className={clsx(
        'navigation',
        sticky && 'navigation--sticky',
        className
      )}
    >
      {/* Left: Brand */}
      <div className="navigation__left">
        <span
          className="navigation__brand"
          onClick={onBrandClick}
          role={onBrandClick ? 'button' : undefined}
          tabIndex={onBrandClick ? 0 : undefined}
        >
          {brand}
        </span>

        {/* Links */}
        {links.length > 0 && (
          <div className="navigation__links">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                onClick={link.onClick}
                className={clsx(
                  'navigation__link',
                  link.active && 'navigation__link--active'
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="navigation__right">
        {rightContent}

        {showThemeToggle && (
          <button
            className="navigation__theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${themeName === 'minimal' ? 'neumorphism' : 'minimal'} theme`}
          >
            {themeName === 'minimal' ? '🔲 Minimal' : '🔘 Neumorphism'}
          </button>
        )}
      </div>
    </nav>
  );
}
```

---

## 테마 토글 버튼 상세

```tsx
// components/Navigation/ThemeToggle.tsx

import { useTheme } from '@themes';

export function ThemeToggle() {
  const { themeName, setThemeName } = useTheme();

  const themes = [
    { name: 'minimal', label: 'Minimal', icon: '🔲' },
    { name: 'neumorphism', label: 'Neumorphism', icon: '🔘' },
  ] as const;

  return (
    <div className="theme-toggle">
      {themes.map((theme) => (
        <button
          key={theme.name}
          onClick={() => setThemeName(theme.name)}
          className={clsx(
            'theme-toggle__button',
            themeName === theme.name && 'theme-toggle__button--active'
          )}
          aria-pressed={themeName === theme.name}
        >
          <span className="theme-toggle__icon">{theme.icon}</span>
          <span className="theme-toggle__label">{theme.label}</span>
        </button>
      ))}
    </div>
  );
}
```

---

## 컬러 에디터 (POC 확장)

```tsx
// components/Navigation/ColorEditor.tsx

import { useState } from 'react';
import { useTheme } from '@themes';
import type { ExternalPalette } from '@/@types/tokens';

export function ColorEditor() {
  const { palette, setPalette } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [colors, setColors] = useState<ExternalPalette>(palette);

  const colorFields = [
    { key: 'primary', label: 'Primary', required: true },
    { key: 'secondary', label: 'Secondary', required: false },
    { key: 'accent', label: 'Accent', required: false },
    { key: 'sub', label: 'Sub', required: false },
  ] as const;

  const handleChange = (key: keyof ExternalPalette, value: string) => {
    setColors((prev) => ({
      ...prev,
      [key]: value || undefined,  // 빈 값이면 undefined (파생 사용)
    }));
  };

  const apply = () => {
    setPalette(colors);
    setIsOpen(false);
  };

  const reset = () => {
    setColors(palette);
  };

  if (!isOpen) {
    return (
      <button
        className="color-editor__trigger"
        onClick={() => setIsOpen(true)}
      >
        🎨 Colors
      </button>
    );
  }

  return (
    <div className="color-editor">
      <div className="color-editor__header">
        <span>Color Palette</span>
        <button onClick={() => setIsOpen(false)}>✕</button>
      </div>

      <div className="color-editor__fields">
        {colorFields.map((field) => (
          <div key={field.key} className="color-editor__field">
            <label>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              type="color"
              value={colors[field.key] || '#CCCCCC'}
              onChange={(e) => handleChange(field.key, e.target.value)}
            />
            {!field.required && (
              <button
                className="color-editor__clear"
                onClick={() => handleChange(field.key, '')}
                title="Use derived color"
              >
                Auto
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="color-editor__actions">
        <button onClick={reset}>Reset</button>
        <button onClick={apply}>Apply</button>
      </div>
    </div>
  );
}
```

---

## 테마별 차이점

### Minimal

```
┌─────────────────────────────────────────────────┐
│ Brand     [Link1] [Link2]       [🔲] [🎨]      │ ← 밝은 표면
└─────────────────────────────────────────────────┘
  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ← drop shadow (아래)
```

### Neumorphism

```
░░┌───────────────────────────────────────────────┐░░
░░│ Brand     [Link1] [Link2]       [🔘] [🎨]    │░░ ← 배경과 동일 색상
░░└───────────────────────────────────────────────┘░░
                                              ▓▓▓▓▓▓  ← raised shadow
```

---

## 접근성

### 키보드 네비게이션

```tsx
// 링크 간 Tab 이동
<nav role="navigation" aria-label="Main navigation">
  <a href="#section1" tabIndex={0}>Section 1</a>
  <a href="#section2" tabIndex={0}>Section 2</a>
</nav>
```

### 테마 토글 ARIA

```tsx
<button
  aria-label="Switch theme"
  aria-pressed={themeName === 'neumorphism'}
>
  Toggle Theme
</button>
```

### Skip Link (확장)

```tsx
// 접근성: 본문으로 건너뛰기
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
```

---

## 사용 예시

### 기본 사용

```tsx
<Navigation brand="My App" />
```

### 링크 포함

```tsx
<Navigation
  brand="Design System"
  links={[
    { label: 'Components', href: '#components', active: true },
    { label: 'Tokens', href: '#tokens' },
    { label: 'Themes', href: '#themes' },
  ]}
/>
```

### 테마/컬러 에디터 포함

```tsx
<Navigation
  brand="POC"
  showThemeToggle
  showColorEditor
/>
```

### 커스텀 우측 컨텐츠

```tsx
<Navigation
  brand="App"
  rightContent={
    <>
      <Button variant="ghost" size="sm">Login</Button>
      <Button variant="primary" size="sm">Sign Up</Button>
    </>
  }
/>
```

---

## 검증 항목

POC에서 확인할 것:

- [ ] 상단 고정 (sticky) 동작
- [ ] spacing 토큰 올바르게 적용 (padding, gap)
- [ ] 테마 토글 클릭 시 즉시 전체 UI 변경
- [ ] 컬러 에디터에서 색상 변경 시 반영
- [ ] 링크 hover 스타일 적용
- [ ] 테마별 navigation 배경/그림자 차이
