# E08: 시스템 컬러 프리셋

## 목표

Error, Warning, Success, Info 등 시스템 컬러를 프리셋 기반으로 관리하여, 용도별 Theme(Service, Admin 등)에 맞게 선택 가능하도록 함

## 현재 문제

```css
/* Input.module.css - accent 색상을 에러로 사용 중 */
.input[data-error='true'] {
  border-color: var(--ds-color-action-accent-default);
}

.errorMessage {
  color: var(--ds-color-action-accent-default);
}
```

| 문제 | 설명 |
|------|------|
| 시스템 컬러 미정의 | error, warning, success, info 전용 컬러 없음 |
| accent 오용 | 브랜드 accent를 에러에 사용 → accent가 노랑이면 에러도 노랑 |
| 확장 불가 | Toast, Alert, Badge 등 추가 시 대응 불가 |

---

## 설계

### 시스템 컬러 프리셋

```typescript
// src/tokens/primitives/system-colors.ts

export type SystemColorName = 'error' | 'warning' | 'success' | 'info';

export interface SystemColorScale {
  50: string;   // 배경용 (light)
  500: string;  // 기본
  700: string;  // 강조/다크
}

export interface SystemColorPreset {
  name: string;
  colors: Record<SystemColorName, SystemColorScale>;
}

/** 기본 프리셋 - Tailwind 계열 */
export const defaultSystemColors: SystemColorPreset = {
  name: 'default',
  colors: {
    error: {
      50: '#FEF2F2',
      500: '#EF4444',
      700: '#B91C1C',
    },
    warning: {
      50: '#FFFBEB',
      500: '#F59E0B',
      700: '#B45309',
    },
    success: {
      50: '#F0FDF4',
      500: '#22C55E',
      700: '#15803D',
    },
    info: {
      50: '#EFF6FF',
      500: '#3B82F6',
      700: '#1D4ED8',
    },
  },
};

/** 차분한 프리셋 - Admin/Dashboard용 */
export const mutedSystemColors: SystemColorPreset = {
  name: 'muted',
  colors: {
    error: {
      50: '#FEF2F2',
      500: '#DC2626',
      700: '#991B1B',
    },
    warning: {
      50: '#FEF9C3',
      500: '#CA8A04',
      700: '#A16207',
    },
    success: {
      50: '#DCFCE7',
      500: '#16A34A',
      700: '#166534',
    },
    info: {
      50: '#DBEAFE',
      500: '#2563EB',
      700: '#1E40AF',
    },
  },
};

/**
 * default vs muted 차이
 *
 * | 구분 | default | muted |
 * |------|---------|-------|
 * | error 500 | #EF4444 (밝은 빨강) | #DC2626 (어두운 빨강) |
 * | warning 500 | #F59E0B (호박색) | #CA8A04 (황갈/올리브) |
 * | success 500 | #22C55E (밝은 초록) | #16A34A (어두운 초록) |
 * | info 500 | #3B82F6 (밝은 파랑) | #2563EB (어두운 파랑) |
 *
 * default: 선명·고대비 → CTA·알림에 주목도 높음. 일반 서비스용.
 * muted: 채도·명도 낮음 → 눈 피로 감소. Admin 대시보드 등 장시간 사용 화면용.
 */
export const systemColorPresets = {
  default: defaultSystemColors,
  muted: mutedSystemColors,
} as const;

export type SystemPresetName = keyof typeof systemColorPresets;
```

### CSS 변수 생성

```typescript
// src/utils/system-colors.ts

import type { SystemColorPreset } from '../tokens/primitives/system-colors';

export function generateSystemColorVars(preset: SystemColorPreset): Record<string, string> {
  const vars: Record<string, string> = {};

  for (const [name, scale] of Object.entries(preset.colors)) {
    vars[`--ds-color-system-${name}-bg`] = scale[50];
    vars[`--ds-color-system-${name}`] = scale[500];
    vars[`--ds-color-system-${name}-emphasis`] = scale[700];
  }

  return vars;
}
```

### ThemeProvider 확장

```typescript
// src/themes/ThemeProvider.tsx

export interface ThemeProviderProps {
  children: ReactNode;
  initialStyleName?: StyleName;
  initialPaletteName?: PaletteName;
  initialPalette?: ExternalPalette;
  /** 시스템 컬러 프리셋 (기본: 'default') */
  systemPreset?: SystemPresetName;
}

export function ThemeProvider({
  // ...
  systemPreset = 'default',
}: ThemeProviderProps) {
  // ...

  useEffect(() => {
    // 기존 CSS 변수 주입
    // ...

    // 시스템 컬러 주입
    const systemVars = generateSystemColorVars(systemColorPresets[systemPreset]);
    injectCSSVariables(systemVars);
  }, [/* ... */, systemPreset]);
}
```

### default vs muted 상세

| 구분 | default | muted | 설명 |
|------|---------|-------|------|
| error 500 | #EF4444 | #DC2626 | muted가 어두운 빨강 |
| warning 500 | #F59E0B | #CA8A04 | muted가 황갈/올리브 계열 |
| success 500 | #22C55E | #16A34A | muted가 어두운 초록 |
| info 500 | #3B82F6 | #2563EB | muted가 어두운 파랑 |

- **default**: 선명·고대비 → CTA·알림에 주목도 높음. 일반 서비스용.
- **muted**: 채도·명도 낮음 → 눈 피로 감소. Admin 대시보드 등 장시간 사용 화면용.

현재 차이가 미묘하면, muted 색상을 더 낮추거나 default를 더 선명하게 조정해 대비를 확대할 수 있음.

---

## 컴포넌트 적용

### Before

```css
.input[data-error='true'] {
  border-color: var(--ds-color-action-accent-default);
}

.errorMessage {
  color: var(--ds-color-action-accent-default);
}
```

### After

```css
.input[data-error='true'] {
  border-color: var(--ds-color-system-error);
}

.errorMessage {
  color: var(--ds-color-system-error);
}

/* 에러 배경이 필요한 경우 */
.errorBanner {
  background-color: var(--ds-color-system-error-bg);
  border-left: 3px solid var(--ds-color-system-error);
}
```

---

## PaletteLab 표시

```
┌─────────────────────────────────────────────────────────────────┐
│  Palette Lab                                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [ Brand Colors ]        ← 기존 Palette 비교                    │
│  Default | Vivid | Pastel | ...                                 │
│                                                                 │
│  [ System Colors ]       ← 신규 섹션                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Current Preset: default                                │    │
│  │                                                         │    │
│  │  Error     Warning    Success    Info                   │    │
│  │  ●──●──●   ●──●──●    ●──●──●    ●──●──●               │    │
│  │  50 500 700                                             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 용도별 Theme 적용 예시

```tsx
// Service (일반 사용자)
<ThemeProvider
  initialPaletteName="vivid"
  initialStyleName="minimal"
  systemPreset="default"
>
  <App />
</ThemeProvider>

// Admin (관리자)
<ThemeProvider
  initialPaletteName="monochrome"
  initialStyleName="minimal"
  systemPreset="muted"
>
  <AdminPanel />
</ThemeProvider>
```

---

## 영향 범위

| 파일 | 변경 내용 |
|------|-----------|
| `src/tokens/primitives/system-colors.ts` | 신규 - 시스템 컬러 프리셋 정의 |
| `src/utils/system-colors.ts` | 신규 - CSS 변수 생성 유틸 |
| `src/themes/ThemeProvider.tsx` | `systemPreset` prop 추가, CSS 변수 주입, context에 systemPreset/setSystemPreset |
| `src/components/Input/Input.module.css` | `accent` → `system-error` 교체 |
| `src/components/ColorPicker/HexInput.module.css` | `#ef4444` 하드코딩 → `var(--ds-color-system-error)` |
| `src/styles/variables.css` | `--ds-color-system-*` fallback 선언 |
| `src/pages/layouts/PaletteLab/` | System Colors 섹션 추가 (default/muted 비교, 전환 가능) |
| `src/constants/lab-content.ts` | sectionTitles.systemColors |
| `src/constants/lab-presets.ts` | getSystemColorVariables, comparisonPresets.systemPresets |

---

## 향후 확장

### 추가 프리셋

```typescript
/** 브랜드 파생 프리셋 (추후) */
export function createBrandDerivedSystemColors(palette: ExpandedPalette): SystemColorPreset {
  return {
    name: 'brand-derived',
    colors: {
      error: adjustTowardsRed(palette.scales.primary),
      warning: adjustTowardsYellow(palette.scales.accent),
      success: adjustTowardsGreen(palette.scales.secondary),
      info: adjustTowardsBlue(palette.scales.primary),
    },
  };
}
```

### Admin Theme Context

```typescript
// 추후 Admin 레이아웃 추가 시
<AdminThemeContext systemPreset="muted" palette="monochrome">
  {/* Admin 전용 컴포넌트 */}
</AdminThemeContext>
```

---

## 체크리스트

- [x] `src/tokens/primitives/system-colors.ts` 생성
- [x] `src/utils/system-colors.ts` 생성
- [x] ThemeProvider에 `systemPreset` prop 추가
- [x] CSS 변수 주입 로직 추가
- [x] Input 컴포넌트 마이그레이션 (accent → system-error)
- [x] PaletteLab에 System Colors 섹션 추가
- [x] 타입 export 정리
