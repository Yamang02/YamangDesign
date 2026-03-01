# 권장 리팩토링 순서

이 문서는 발견된 문제점을 해결하기 위한 단계별 리팩토링 계획을 제시합니다.

---

## 의존성 그래프

```
┌─────────────────────────────────────────────────────────────┐
│                     Phase 1: 타입 시스템                      │
│  - PaletteName 단일 소스화                                   │
│  - ThemeCategory 통합                                        │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    Phase 2: 상태 관리                        │
│  - usePaletteResolution 훅                                  │
│  - useCustomSemanticPresets 훅                              │
│                             │                                │
│                    (Phase 1 타입 필요)                       │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   Phase 3: 컴포넌트                          │
│  - GenericTabs 컴포넌트                                      │
│  - usePresetFiltering 훅                                    │
│                             │                                │
│              (Phase 2 훅 활용 가능)                          │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    Phase 4: 상수                             │
│  - palette-scales.ts                                        │
│                             │                                │
│                   (독립적, 언제든 가능)                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 1: 타입 시스템 통합

**영향도**: 높음 | **작업량**: 낮음 | **위험도**: 낮음

### 목표
- `PaletteName` 타입을 단일 소스(`theme-presets.ts`)에서만 정의
- `ThemeCategory`와 `BrandColorTabId` 통합

### 작업 항목

#### 1.1 PaletteName 정리

```diff
// src/palettes/types.ts

- /** 배색 프리셋 이름 - theme-presets에서 유도됨, palettes에서는 string 사용 */
- export type PaletteName = string;

+ // PaletteName은 constants/theme-presets.ts에서 정의됨
+ // PaletteDefinition.name은 내부 유연성을 위해 string 유지
```

#### 1.2 영향받는 import 업데이트

```bash
# 영향 범위 확인
grep -rn "from.*palettes.*types.*PaletteName" src/
grep -rn "from.*palettes/types.*PaletteName" src/
```

필요시 import 경로를 `@types/theme` 또는 `constants/theme-presets`로 변경

#### 1.3 BrandColorTabId를 ThemeCategory alias로

```diff
// src/pages/layouts/PaletteLab/PaletteCategoryTabs.tsx

+ import type { ThemeCategory } from '../../../palettes/types';

- export type BrandColorTabId = 'default' | 'natural' | 'custom';
+ export type BrandColorTabId = ThemeCategory;
```

### 검증

```bash
npx tsc --noEmit
npm run build
```

---

## Phase 2: 상태 관리 개선

**영향도**: 높음 | **작업량**: 중간 | **위험도**: 중간

### 목표
- 팔레트 해석 로직 단일화
- localStorage 로직 분리
- ThemeProvider 코드 단순화

### 작업 항목

#### 2.1 usePaletteResolution 훅 생성

```typescript
// src/hooks/usePaletteResolution.ts

import { useMemo } from 'react';
import type { PaletteName } from '../constants/theme-presets';
import type { ExternalPalette } from '../@types/tokens';
import type { PaletteDefinition } from '../palettes/types';
import type { CustomSemanticPreset } from '../constants/semantic-presets';
import { isCustomSemanticPaletteId } from '../constants/theme-presets';
import { presetToPaletteDefinition } from '../constants/semantic-presets';
import { palettePresets, toCustomPaletteDefinition } from '../themes/presets';

interface PaletteResolution {
  definition: PaletteDefinition;
  colors: ExternalPalette;
}

export function usePaletteResolution(
  paletteName: PaletteName,
  customColors: ExternalPalette | null,
  customSemanticPresets: CustomSemanticPreset[]
): PaletteResolution {
  return useMemo(() => {
    // Custom semantic preset
    if (isCustomSemanticPaletteId(paletteName)) {
      const id = paletteName.replace('custom-semantic:', '');
      const preset = customSemanticPresets.find((p) => p.id === id);
      if (preset) {
        const def = presetToPaletteDefinition(preset);
        const base = palettePresets[preset.basePaletteId as keyof typeof palettePresets];
        if (def && base) {
          return { definition: def, colors: base.colors as ExternalPalette };
        }
      }
      return {
        definition: palettePresets.default,
        colors: palettePresets.default.colors as ExternalPalette,
      };
    }

    // Custom colors
    if (customColors) {
      return {
        definition: toCustomPaletteDefinition(customColors),
        colors: customColors,
      };
    }

    // Preset
    const preset = palettePresets[paletteName as keyof typeof palettePresets]
      ?? palettePresets.default;
    return {
      definition: preset,
      colors: preset.colors as ExternalPalette,
    };
  }, [paletteName, customColors, customSemanticPresets]);
}
```

#### 2.2 useCustomSemanticPresets 훅 생성

```typescript
// src/hooks/useCustomSemanticPresets.ts

import { useState, useCallback } from 'react';
import {
  CUSTOM_SEMANTIC_PRESETS_STORAGE_KEY,
  type CustomSemanticPreset,
  type StoredCustomSemanticPresets,
} from '../constants/semantic-presets';

export function useCustomSemanticPresets() {
  const [presets, setPresets] = useState<CustomSemanticPreset[]>(() => {
    try {
      const raw = localStorage.getItem(CUSTOM_SEMANTIC_PRESETS_STORAGE_KEY);
      if (!raw) return [];
      const parsed: StoredCustomSemanticPresets = JSON.parse(raw);
      return parsed?.presets ?? [];
    } catch {
      return [];
    }
  });

  const persist = useCallback((updated: CustomSemanticPreset[]) => {
    localStorage.setItem(
      CUSTOM_SEMANTIC_PRESETS_STORAGE_KEY,
      JSON.stringify({ version: '1', presets: updated } satisfies StoredCustomSemanticPresets)
    );
  }, []);

  const add = useCallback(
    (preset: Omit<CustomSemanticPreset, 'id' | 'createdAt'>): CustomSemanticPreset => {
      const id = `custom-semantic-${crypto.randomUUID().slice(0, 8)}`;
      const full: CustomSemanticPreset = {
        ...preset,
        id,
        createdAt: new Date().toISOString(),
      };
      setPresets((prev) => {
        const next = [...prev, full];
        persist(next);
        return next;
      });
      return full;
    },
    [persist]
  );

  const update = useCallback(
    (id: string, updates: Partial<Pick<CustomSemanticPreset, 'semanticOverrides' | 'displayName'>>) => {
      setPresets((prev) => {
        const next = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const remove = useCallback(
    (id: string) => {
      setPresets((prev) => {
        const next = prev.filter((p) => p.id !== id);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  return { presets, add, update, remove };
}
```

#### 2.3 ThemeProvider 리팩토링

```diff
// src/themes/ThemeProvider.tsx

+ import { usePaletteResolution } from '../hooks/usePaletteResolution';
+ import { useCustomSemanticPresets } from '../hooks/useCustomSemanticPresets';

export function ThemeProvider({ ... }) {
  // ... 기존 상태 (styleName, paletteName, customColors, systemPreset)

-  const [customSemanticPresets, setCustomSemanticPresetsState] = useState<...>(() => { ... });
-  const persistCustomSemanticPresets = useCallback(...);
-  const addCustomSemanticPreset = useCallback(...);
-  const updateCustomSemanticPreset = useCallback(...);
-  const deleteCustomSemanticPreset = useCallback(...);
+  const {
+    presets: customSemanticPresets,
+    add: addCustomSemanticPreset,
+    update: updateCustomSemanticPreset,
+    remove: deleteCustomSemanticPresetInternal,
+  } = useCustomSemanticPresets();

+  // 삭제 시 현재 팔레트 초기화 로직 유지
+  const deleteCustomSemanticPreset = useCallback((id: string) => {
+    deleteCustomSemanticPresetInternal(id);
+    if (paletteName === `custom-semantic:${id}`) {
+      setPaletteNameState('default');
+    }
+  }, [paletteName, deleteCustomSemanticPresetInternal]);

-  const basePaletteDefinition = useMemo(() => { ... }, [...]);
-  const palette: ExternalPalette = useMemo(() => { ... }, [...]);
+  const { definition: basePaletteDefinition, colors: palette } = usePaletteResolution(
+    paletteName,
+    customColors,
+    customSemanticPresets
+  );

  // ... 나머지 코드 유지
}
```

### 검증

```bash
npx tsc --noEmit
npm run dev
# 수동 테스트: 팔레트 전환, 커스텀 시맨틱 프리셋 CRUD
```

---

## Phase 3: 컴포넌트 단순화

**영향도**: 중간 | **작업량**: 중간 | **위험도**: 낮음

### 목표
- 탭 컴포넌트 통합
- 프리셋 필터링 로직 추출

### 작업 항목

#### 3.1 GenericTabs 컴포넌트

```bash
mkdir -p src/components/GenericTabs
```

```typescript
// src/components/GenericTabs/GenericTabs.tsx

import styles from './GenericTabs.module.css';

export interface TabItem<T extends string> {
  id: T;
  label: string;
}

export interface GenericTabsProps<T extends string> {
  tabs: readonly TabItem<T>[] | TabItem<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  ariaLabel: string;
}

export function GenericTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  ariaLabel,
}: GenericTabsProps<T>) {
  return (
    <div className={styles.tabList} role="tablist" aria-label={ariaLabel}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`panel-${tab.id}`}
          id={`tab-${tab.id}`}
          className={styles.tab}
          data-active={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
          tabIndex={activeTab === tab.id ? 0 : -1}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
```

#### 3.2 기존 컴포넌트 마이그레이션

```typescript
// src/pages/layouts/PaletteLab/PaletteCategoryTabs.tsx (간소화)

import { GenericTabs } from '../../../components/GenericTabs';
import type { ThemeCategory } from '../../../palettes/types';

export type BrandColorTabId = ThemeCategory;

const TABS = [
  { id: 'default' as const, label: 'Default' },
  { id: 'natural' as const, label: 'Natural' },
  { id: 'custom' as const, label: 'Custom' },
];

export interface PaletteCategoryTabsProps {
  activeTab: BrandColorTabId;
  onTabChange: (tab: BrandColorTabId) => void;
}

export function PaletteCategoryTabs({ activeTab, onTabChange }: PaletteCategoryTabsProps) {
  return (
    <GenericTabs
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={onTabChange}
      ariaLabel="브랜드 컬러"
    />
  );
}
```

#### 3.3 usePresetFiltering 훅 (선택적)

필요시 GlobalSettingsModal과 PaletteLab의 필터링 로직 통합

### 검증

```bash
npm run dev
# 수동 테스트: 탭 전환, 키보드 네비게이션
```

---

## Phase 4: 상수 중앙화

**영향도**: 낮음 | **작업량**: 낮음 | **위험도**: 낮음

### 목표
- 스케일/스텝 상수 단일 소스화
- import 일관성 확보

### 작업 항목

#### 4.1 palette-scales.ts 생성

```typescript
// src/constants/palette-scales.ts

/** 팔레트 스케일 키 */
export const PALETTE_SCALES = ['primary', 'secondary', 'accent', 'sub', 'neutral'] as const;
export type PaletteScale = typeof PALETTE_SCALES[number];

/** 스케일 스텝 */
export const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
export type ScaleStep = typeof SCALE_STEPS[number];

/** 시스템 컬러 키 */
export const SYSTEM_COLOR_KEYS = ['error', 'warning', 'success', 'info'] as const;
export type SystemColorKey = typeof SYSTEM_COLOR_KEYS[number];

/** 시스템 컬러 스텝 */
export const SYSTEM_SCALE_STEPS = [50, 500, 700] as const;
```

#### 4.2 기존 상수 교체

```diff
// src/pages/layouts/PaletteLab/PaletteLab.tsx

+ import { PALETTE_SCALES, SCALE_STEPS, SYSTEM_COLOR_KEYS, SYSTEM_SCALE_STEPS } from '../../../constants/palette-scales';

- const colorKeys = ['primary', 'secondary', 'accent', 'sub', 'neutral'] as const;
- const systemColorKeys = ['error', 'warning', 'success', 'info'] as const;
- const systemScaleSteps = [50, 500, 700] as const;
- const scaleSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

// 사용 부분에서 변수명 변경
- colorKeys.map(...)
+ PALETTE_SCALES.map(...)
```

### 검증

```bash
npx tsc --noEmit
```

---

## 최종 검증 체크리스트

### 빌드 검증
- [ ] `npx tsc --noEmit` 오류 없음
- [ ] `npm run build` 성공
- [ ] `npm run lint` 오류 없음

### 기능 검증
- [ ] 테마 전환 정상 동작
- [ ] 팔레트 선택 정상 동작
- [ ] 커스텀 시맨틱 프리셋 CRUD 동작
- [ ] localStorage 데이터 호환성 유지
- [ ] PaletteLab 탭 전환 동작
- [ ] GlobalSettings 탭 전환 동작

### 회귀 테스트
- [ ] 기존 CSS 변수 주입 확인
- [ ] 색상 스케일 표시 확인
- [ ] 시맨틱 매핑 편집 동작

---

## 롤백 계획

각 Phase는 독립적으로 롤백 가능합니다.

```bash
# Git을 통한 Phase별 롤백
git revert <phase-commit-hash>
```

Phase 완료 시마다 커밋하여 롤백 지점 확보:

```bash
git commit -m "refactor: Phase 1 - 타입 시스템 통합"
git commit -m "refactor: Phase 2 - 상태 관리 개선"
git commit -m "refactor: Phase 3 - 컴포넌트 단순화"
git commit -m "refactor: Phase 4 - 상수 중앙화"
```
