# 05. Shadow System

## Overview

Minimal과 Neumorphism 테마의 핵심 차별점인 Shadow 시스템을 정의한다.

---

## Shadow 역할

| 레벨 | 용도 | 예시 |
|------|------|------|
| `none` | 그림자 없음 | flat 요소 |
| `sm` | 미세한 깊이감 | 버튼 기본 상태 |
| `md` | 중간 elevation | 카드, 패널 |
| `lg` | 높은 elevation | 드롭다운, 팝오버 |
| `xl` | 최대 elevation | 모달 (확장용) |
| `inset` | 눌림 효과 | 버튼 active, input focus |

---

## Minimal Theme Shadows

단순한 drop shadow. Y축 오프셋으로 자연스러운 깊이감.

```typescript
// themes/minimal/shadows.ts

export const minimalShadows = {
  none: 'none',

  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',

  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',

  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',

  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',

  inset: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
};
```

### 특징

```
- 단순한 아래 방향 그림자
- rgba 기반 반투명
- 가볍고 미니멀한 느낌
- Y 오프셋 > X 오프셋
```

---

## Neumorphism Theme Shadows

배경색 기반 양각/음각 그림자. 빛과 그림자 두 방향.

```typescript
// themes/neumorphism/shadows.ts

import { lighten, darken } from '@/utils/color';

/**
 * Neumorphism 그림자 생성
 * 배경색에서 밝은 쪽/어두운 쪽 그림자 계산
 */
export function createNeumorphismShadows(bgColor: string) {
  const lightShadow = lighten(bgColor, 15);  // 밝은 하이라이트
  const darkShadow = darken(bgColor, 15);    // 어두운 그림자

  return {
    none: 'none',

    // 살짝 떠있는 느낌
    sm: `
      3px 3px 6px ${darkShadow},
      -3px -3px 6px ${lightShadow}
    `.trim(),

    // 기본 돌출
    md: `
      6px 6px 12px ${darkShadow},
      -6px -6px 12px ${lightShadow}
    `.trim(),

    // 강한 돌출
    lg: `
      10px 10px 20px ${darkShadow},
      -10px -10px 20px ${lightShadow}
    `.trim(),

    // 최대 돌출
    xl: `
      15px 15px 30px ${darkShadow},
      -15px -15px 30px ${lightShadow}
    `.trim(),

    // 눌림 (inset)
    inset: `
      inset 4px 4px 8px ${darkShadow},
      inset -4px -4px 8px ${lightShadow}
    `.trim(),

    // 플랫 (그림자 없이 배경과 동화)
    flat: 'none',
  };
}
```

### 특징

```
- 배경색 기반 동적 계산
- 좌상단: 밝은 하이라이트 (빛)
- 우하단: 어두운 그림자
- 볼록(raised) / 오목(inset) 전환
- 배경과 요소가 같은 색
```

---

## Shadow 비교

```
Minimal                          Neumorphism
─────────────────────────────    ─────────────────────────────
       ┌─────────────┐                    ┌─────────────┐
       │             │           ░░░░░░░░░│             │
       │   Card      │           ░░░░░░░░░│   Card      │
       │             │           ░░░░░░░░░│             │
       └─────────────┘           ░░░░░░░░░└─────────────┘
              ▓▓▓▓▓▓▓▓                           ▓▓▓▓▓▓▓▓
              (아래 그림자)         (좌상: 밝음, 우하: 어두움)


       드롭 섀도우                  양각 (Raised)
       - Y축 오프셋                 - 대각선 양방향
       - 단일 방향                  - 빛/그림자 분리
```

---

## 컴포넌트별 Shadow 적용

### Button

| 상태 | Minimal | Neumorphism |
|------|---------|-------------|
| default | `sm` | `sm` (raised) |
| hover | `md` | `md` (raised) |
| active | `inset` | `inset` (pressed) |
| disabled | `none` | `none` |

### Card

| 상태 | Minimal | Neumorphism |
|------|---------|-------------|
| default | `md` | `md` (raised) |
| hover | `lg` | `lg` (raised) |

### Input

| 상태 | Minimal | Neumorphism |
|------|---------|-------------|
| default | `none` + border | `inset` (오목) |
| focus | `none` + border | `inset` + focus ring |

### Navigation

| 요소 | Minimal | Neumorphism |
|------|---------|-------------|
| Bar | `sm` | `sm` (raised) |

---

## CSS 변수 출력

### Minimal

```css
:root[data-theme="minimal"] {
  --ds-shadow-none: none;
  --ds-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --ds-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --ds-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  --ds-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  --ds-shadow-inset: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}
```

### Neumorphism (배경색 #E0E5EC 기준)

```css
:root[data-theme="neumorphism"] {
  --ds-shadow-none: none;
  --ds-shadow-sm: 3px 3px 6px #b8bec5, -3px -3px 6px #ffffff;
  --ds-shadow-md: 6px 6px 12px #b8bec5, -6px -6px 12px #ffffff;
  --ds-shadow-lg: 10px 10px 20px #b8bec5, -10px -10px 20px #ffffff;
  --ds-shadow-xl: 15px 15px 30px #b8bec5, -15px -15px 30px #ffffff;
  --ds-shadow-inset: inset 4px 4px 8px #b8bec5, inset -4px -4px 8px #ffffff;
}
```

---

## 동적 Shadow 계산

Neumorphism은 배경색에 따라 shadow가 달라지므로, 외부 컬러 입력 시 자동 계산:

```typescript
// themes/neumorphism/tokens.ts

export function createNeumorphismTheme(palette: ResolvedPalette): Theme {
  // Sub 컬러를 Neumorphism 배경으로 사용
  const bgColor = palette.sub;

  return {
    name: 'neumorphism',
    colors: {
      bg: {
        base: bgColor,      // 배경 = 요소 = 동일 색상
        surface: bgColor,
        elevated: bgColor,
      },
      // ...
    },
    shadows: createNeumorphismShadows(bgColor),  // 배경 기반 계산
  };
}
```

### 컬러 입력에 따른 Shadow 변화

```typescript
// 밝은 회색 배경
{ sub: '#E0E5EC' }
→ light: #FFFFFF, dark: #B8BEC5

// 연한 베이지 배경
{ sub: '#F5E6D3' }
→ light: #FFFFFF, dark: #D4C4B1

// 연한 블루 배경
{ sub: '#E3F2FD' }
→ light: #FFFFFF, dark: #B8D4ED
```

---

## Transition

Shadow 변화 시 부드러운 전환:

```css
.component {
  transition: box-shadow 0.2s ease-in-out;
}
```

| 전환 | 시간 | 이징 |
|------|------|------|
| hover | 200ms | ease-in-out |
| active | 100ms | ease-out |
| theme switch | 300ms | ease-in-out |
