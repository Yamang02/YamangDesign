# E01: Palette 레이어 분리

> **구현 완료** (2025-02)

## 목표

배색(Color Palette)을 독립된 레이어로 추출하여 GUI 스타일과 무관하게 관리한다.

---

## 현재 구조

```typescript
// themes/minimal/tokens.ts
function createMinimalTheme(palette: ResolvedPalette): Theme {
  return {
    colors: {
      bg: { base: '#FFFFFF' },  // ← 배경색이 테마에 종속
      // ...
    },
    shadows: { ... }  // ← 스타일도 함께
  };
}
```

---

## 목표 구조

```
src/
├── palettes/                    # [NEW] 배색 레이어
│   ├── types.ts                 # Palette 타입 정의
│   ├── presets/
│   │   ├── default.ts           # 기본 배색 (현재 방식 유지)
│   │   ├── vivid.ts             # 고채도 배색
│   │   ├── pastel.ts            # 파스텔 배색
│   │   ├── monochrome.ts        # 단색 배색
│   │   └── earth.ts             # 어스톤 배색
│   ├── strategies/
│   │   ├── light-bg.ts          # 밝은 배경 전략
│   │   ├── colored-bg.ts        # 컬러 배경 전략
│   │   └── dark-bg.ts           # 어두운 배경 전략
│   └── index.ts
```

---

## 타입 정의

### 기존 타입과의 관계

현재 코드베이스에는 `ResolvedPalette` 타입이 이미 존재한다 (4색 + `_meta`).
혼란을 피하기 위해 새로운 타입에는 다른 이름을 사용한다:

| 현재 코드 | E01 신규 | 설명 |
|-----------|----------|------|
| `ExternalPalette` | 그대로 유지 | 사용자 입력 (primary만 필수) |
| `ResolvedPalette` | `ResolvedColors` | 4색 해석 완료 + `_meta` |
| (없음) | `PaletteDefinition` | 프리셋 정의 (colors + bgStrategy) |
| (없음) | `ExpandedPalette` | scales + semantic 포함한 최종 형태 |

> **마이그레이션**: 기존 `ResolvedPalette`는 `ResolvedColors`로 리네이밍하고, 신규 `ExpandedPalette`가 scales·semantic을 포함한다.

```typescript
// palettes/types.ts

/** 배색 프리셋 이름 */
type PaletteName = 'default' | 'vivid' | 'pastel' | 'monochrome' | 'earth';

/** 배경 전략 */
type BgStrategy = 'light' | 'colored' | 'dark';

/** Palette 정의 */
interface PaletteDefinition {
  name: PaletteName;

  /** 기본 색상 (사용자 입력 또는 프리셋) */
  colors: {
    primary: string;
    secondary?: string;
    accent?: string;
    sub?: string;
  };

  /** 배경색 전략 */
  bgStrategy: BgStrategy;

  /** 대비 설정 */
  contrast?: 'normal' | 'high';
}

/** 4색 해석 완료 (기존 ResolvedPalette 리네이밍) */
interface ResolvedColors {
  primary: string;
  secondary: string;
  accent: string;
  sub: string;

  _meta: {
    derived: {
      secondary: boolean;
      accent: boolean;
      sub: boolean;
    };
  };
}

/** 확장된 Palette (스케일 + 시맨틱 포함) */
interface ExpandedPalette {
  name: PaletteName;
  bgStrategy: BgStrategy;

  /** 색상 스케일 */
  scales: {
    primary: ColorScale;
    secondary: ColorScale;
    accent: ColorScale;
    sub: ColorScale;
  };

  /** 시맨틱 색상 (배경, 텍스트, 경계선) */
  semantic: {
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
      onAction: string;
    };
    border: {
      default: string;
      subtle: string;
      focus: string;
    };
  };
}
```

---

## 배경 전략 구현

```typescript
// palettes/strategies/light-bg.ts
export function applyLightBgStrategy(scales: GeneratedScales): SemanticColors {
  return {
    bg: {
      base: '#FFFFFF',
      surface: scales.sub[100],
      elevated: '#FFFFFF',
      muted: scales.sub[200],
    },
    text: {
      primary: scales.sub[900],
      secondary: scales.sub[700],
      muted: scales.sub[500],
      onAction: '#FFFFFF',
    },
    border: {
      default: scales.sub[300],
      subtle: scales.sub[200],
      focus: scales.primary[500],
    },
  };
}
```

```typescript
// palettes/strategies/colored-bg.ts
export function applyColoredBgStrategy(scales: GeneratedScales): SemanticColors {
  return {
    bg: {
      base: scales.sub[100],      // 연한 컬러 배경
      surface: scales.sub[50],
      elevated: '#FFFFFF',
      muted: scales.sub[200],
    },
    text: {
      primary: scales.sub[900],
      secondary: scales.sub[700],
      muted: scales.sub[600],
      onAction: '#FFFFFF',
    },
    border: {
      default: scales.sub[300],
      subtle: scales.sub[200],
      focus: scales.primary[500],
    },
  };
}
```

```typescript
// palettes/strategies/dark-bg.ts
export function applyDarkBgStrategy(scales: GeneratedScales): SemanticColors {
  return {
    bg: {
      base: scales.sub[900],
      surface: scales.sub[800],
      elevated: scales.sub[700],
      muted: scales.sub[800],
    },
    text: {
      primary: scales.sub[50],
      secondary: scales.sub[200],
      muted: scales.sub[400],
      onAction: scales.sub[900],
    },
    border: {
      default: scales.sub[600],
      subtle: scales.sub[700],
      focus: scales.primary[400],
    },
  };
}
```

---

## Palette 프리셋 예시

```typescript
// palettes/presets/vivid.ts
export const vividPalette: PaletteDefinition = {
  name: 'vivid',
  colors: {
    primary: '#6366F1',    // 인디고
    secondary: '#EC4899',  // 핑크
    accent: '#F59E0B',     // 앰버
    sub: '#1F2937',        // 다크 그레이
  },
  bgStrategy: 'light',
  contrast: 'high',
};
```

```typescript
// palettes/presets/pastel.ts
export const pastelPalette: PaletteDefinition = {
  name: 'pastel',
  colors: {
    primary: '#A5B4FC',    // 연한 인디고
    secondary: '#FBCFE8',  // 연한 핑크
    accent: '#FDE68A',     // 연한 앰버
    sub: '#F3F4F6',        // 라이트 그레이
  },
  bgStrategy: 'colored',
  contrast: 'normal',
};
```

---

## Palette 해석 함수

```typescript
// palettes/index.ts
import { generateColorScales, resolvePalette } from '../utils/palette';
import { applyLightBgStrategy, applyColoredBgStrategy, applyDarkBgStrategy } from './strategies';

export function createPalette(definition: PaletteDefinition): ResolvedPalette {
  // 1. 색상 해석 (기존 로직 재사용)
  const resolved = resolvePalette(definition.colors);

  // 2. 스케일 생성
  const scales = generateColorScales(resolved);

  // 3. 배경 전략 적용
  const strategyFn = {
    light: applyLightBgStrategy,
    colored: applyColoredBgStrategy,
    dark: applyDarkBgStrategy,
  }[definition.bgStrategy];

  const semantic = strategyFn(scales);

  return {
    name: definition.name,
    bgStrategy: definition.bgStrategy,
    scales,
    semantic,
  };
}
```

---

## 작업 항목

### 1. 타입 정의
- [x] `PaletteDefinition`, `ExpandedPalette` 타입
- [x] `BgStrategy` 타입
- [x] 기존 `ExternalPalette` 타입과의 호환

### 2. 배경 전략 구현
- [x] `light-bg.ts` - 밝은 배경
- [x] `colored-bg.ts` - 컬러 배경
- [x] `dark-bg.ts` - 어두운 배경

### 3. 프리셋 구현

**필수 (P0):**
- [x] `default.ts` - 기존 동작 유지
- [x] `vivid.ts` - 고채도 예시
- [x] `pastel.ts` - 파스텔 예시

**선택 (P1/P2):**
- [x] `monochrome` - presets에 정의
- [x] `earth` - presets에 정의

### 4. Palette 해석 함수
- [x] `createPalette()` 함수 구현 (`palettes/index.ts`)
- [x] 기존 `resolvePalette()`, `generateColorScales()` 재사용

### 5. 타입 리네이밍
- [x] `ExpandedPalette` 사용 (doc의 ResolvedColors/ExpandedPalette 병합)

---

## 완료 기준

- [x] Palette 레이어가 Style 레이어와 분리됨
- [x] 배경 전략을 Palette에서 결정 (light/colored/dark)
- [x] 프리셋 5개 정의 (default, vivid, pastel, monochrome, earth)
- [x] 타입 안전성 유지
- [x] 기존 동작 호환 (default palette)

---

## 다음 단계

E02에서 Style 레이어를 분리한 후, E03에서 조합 시스템 구축.
