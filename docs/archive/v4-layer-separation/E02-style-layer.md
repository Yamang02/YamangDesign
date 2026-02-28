# E02: Style 레이어 분리

> **구현 완료** (2025-02)

## 목표

GUI 스타일(Visual Style)을 독립된 레이어로 추출하여 배색과 무관하게 관리한다.

---

## 현재 구조

```typescript
// themes/neumorphism/tokens.ts
function createNeumorphismTheme(palette: ResolvedPalette): Theme {
  const bgColor = palette.sub;
  const lightShadow = lighten(bgColor, 15);
  const darkShadow = darken(bgColor, 15);

  return {
    colors: { ... },  // ← 배색도 함께
    shadows: {
      sm: `3px 3px 6px ${darkShadow}, -3px -3px 6px ${lightShadow}`,
      // ...
    }
  };
}
```

**문제:** 그림자 색상이 palette.sub에 종속되어 있음

---

## 목표 구조

```
src/
├── styles/                      # [REFACTOR] 스타일 레이어
│   ├── types.ts                 # Style 타입 정의
│   ├── presets/
│   │   ├── minimal.ts           # 플랫 스타일
│   │   ├── neumorphism.ts       # 뉴모피즘 스타일
│   │   ├── glassmorphism.ts     # 글래스모피즘 (향후)
│   │   └── brutalism.ts         # 브루탈리즘 (향후)
│   └── index.ts
```

---

## 타입 정의

```typescript
// styles/types.ts

/** 스타일 프리셋 이름 */
type StyleName = 'minimal' | 'neumorphism' | 'glassmorphism' | 'brutalism';

/** 표면 처리 방식 */
type SurfaceType = 'flat' | 'raised' | 'inset';

/** 스타일 정의 */
interface StyleDefinition {
  name: StyleName;

  /** 그림자 생성 함수 (배경색을 받아서 그림자 반환) */
  createShadows: (bgColor: string) => {
    none: string;
    sm: string;
    md: string;
    lg: string;
    active: string;  // pressed/inset 상태
  };

  /** 경계선 스타일 */
  border: {
    width: string;       // '1px' | '0px' 등
    style: string;       // 'solid' | 'none'
    useColor: boolean;   // border-color 사용 여부
  };

  /** 표면 처리 */
  surface: {
    default: SurfaceType;
    interactive: SurfaceType;  // 버튼 등
    active: SurfaceType;       // 눌린 상태
  };

  /** 상태 표현 방식 */
  states: {
    hover: 'shadow' | 'background' | 'border';
    active: 'shadow' | 'background' | 'transform';
  };
}

/** 해석된 Style (특정 배경색에 적용 완료) */
interface ResolvedStyle {
  name: StyleName;
  shadows: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;    // 유지: 큰 elevation 표현용
    inset: string; // active 대신 inset 유지 (현재 코드와 일치)
  };
  border: {
    width: string;
    style: string;
  };
}
```

### Shadow 키 결정

현재 코드(`ThemeShadows`)는 `inset`, `xl`을 사용한다. 문서에서 `active`로 변경하려 했으나, 혼란을 피하기 위해 **현재 코드 기준 유지**:

| 키 | 용도 | 결정 |
|----|------|------|
| `xl` | 큰 elevation (modal 등) | ✅ 유지 |
| `inset` | pressed/active 상태 | ✅ 유지 (`active` 대신) |

> 컴포넌트에서 `--ds-shadow-inset`을 참조하므로 기존 이름 유지. 추후 semantic alias(`active → inset`)가 필요하면 별도 매핑 추가.

### surface / states 결정

`StyleDefinition`의 `surface`, `states`는 **스타일 가이드/문서 전용**이며, `ResolvedStyle`·`Theme`에는 포함하지 않는다.
- 런타임에서 필요 시 `StyleDefinition`을 직접 참조
- CSS 변수로 주입하지 않음 (JS 레벨 힌트)

### Border 책임 분리

| 속성 | 담당 레이어 | 설명 |
|------|-------------|------|
| Border **색상** | **Palette** | `semantic.border.default`, `subtle`, `focus` |
| Border **두께/스타일** | **Style** | `border.width`, `border.style` |

---

## 스타일 프리셋 구현

### Minimal

```typescript
// styles/presets/minimal.ts
export const minimalStyle: StyleDefinition = {
  name: 'minimal',

  createShadows: (bgColor: string) => ({
    none: 'none',
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.07)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
    inset: '0 1px 2px rgba(0, 0, 0, 0.05)',  // minimal은 변화 없음
  }),

  border: {
    width: '1px',
    style: 'solid',
    useColor: true,
  },

  surface: {
    default: 'flat',
    interactive: 'flat',
    active: 'flat',
  },

  states: {
    hover: 'shadow',
    active: 'background',
  },
};
```

### Neumorphism

```typescript
// styles/presets/neumorphism.ts
import { lighten, darken } from '../../utils/color';

export const neumorphismStyle: StyleDefinition = {
  name: 'neumorphism',

  createShadows: (bgColor: string) => {
    const light = lighten(bgColor, 15);
    const dark = darken(bgColor, 15);

    return {
      none: 'none',
      sm: `3px 3px 6px ${dark}, -3px -3px 6px ${light}`,
      md: `5px 5px 10px ${dark}, -5px -5px 10px ${light}`,
      lg: `10px 10px 20px ${dark}, -10px -10px 20px ${light}`,
      xl: `15px 15px 30px ${dark}, -15px -15px 30px ${light}`,
      inset: `inset 3px 3px 6px ${dark}, inset -3px -3px 6px ${light}`,
    };
  },

  border: {
    width: '0px',
    style: 'none',
    useColor: false,
  },

  surface: {
    default: 'raised',
    interactive: 'raised',
    active: 'inset',
  },

  states: {
    hover: 'shadow',
    active: 'shadow',  // inset shadow
  },
};
```

### Glassmorphism (향후)

```typescript
// styles/presets/glassmorphism.ts
export const glassmorphismStyle: StyleDefinition = {
  name: 'glassmorphism',

  createShadows: (bgColor: string) => ({
    none: 'none',
    sm: '0 4px 30px rgba(0, 0, 0, 0.1)',
    md: '0 8px 32px rgba(0, 0, 0, 0.15)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.2)',
    xl: '0 12px 40px rgba(0, 0, 0, 0.25)',
    inset: '0 2px 15px rgba(0, 0, 0, 0.1)',
  }),

  border: {
    width: '1px',
    style: 'solid',
    useColor: true,  // rgba border
  },

  surface: {
    default: 'flat',
    interactive: 'flat',
    active: 'flat',
  },

  states: {
    hover: 'background',
    active: 'background',
  },

  // 추가 속성 (glassmorphism 전용)
  // effects: {
  //   blur: '10px',
  //   bgOpacity: 0.25,
  // },
};
```

---

## Style 해석 함수

```typescript
// styles/index.ts
export function createStyle(
  definition: StyleDefinition,
  bgColor: string
): ResolvedStyle {
  return {
    name: definition.name,
    shadows: definition.createShadows(bgColor),
    border: {
      width: definition.border.width,
      style: definition.border.style,
    },
  };
}
```

---

## 작업 항목

### 1. 타입 정의
- [x] `StyleDefinition`, `ResolvedStyle` 타입
- [x] `SurfaceType` 타입
- [x] 기존 `ThemeShadows` 타입과의 호환

### 2. 스타일 프리셋 구현
- [x] `minimal.ts` - 플랫 스타일
- [x] `neumorphism.ts` - 뉴모피즘 스타일

### 3. Style 해석 함수
- [x] `createStyle()` 함수 구현 (`styles/index.ts`)
- [x] 배경색을 받아 그림자 생성

### 4. 기존 테마 파일 정리
- [x] `styles/presets/minimal.ts`, `neumorphism.ts`로 분리

---

## 핵심 변경점

### Before (현재)

```typescript
// Neumorphism 그림자가 palette.sub에 종속
const bgColor = palette.sub;
const shadow = `3px 3px 6px ${darken(bgColor, 15)}...`;
```

### After (목표)

```typescript
// Style이 배경색을 '받아서' 그림자 생성
const shadows = neumorphismStyle.createShadows(resolvedPalette.semantic.bg.base);
```

이렇게 하면:
- Neumorphism + 흰색 배경 → 흰색 기준 그림자
- Neumorphism + 컬러 배경 → 해당 컬러 기준 그림자
- Minimal + 어떤 배경이든 → 동일한 drop shadow

---

## 완료 기준

- [x] Style 레이어가 Palette 레이어와 분리됨
- [x] 그림자가 배경색을 파라미터로 받아 생성됨
- [x] 프리셋 2개 정의 (minimal, neumorphism)
- [x] 타입 안전성 유지

---

## 다음 단계

E03에서 Palette × Style 조합 시스템 구축.
