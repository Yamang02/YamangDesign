# 상태 관리 문제점 분석

**우선순위: P2 (높은 영향도, 중간 작업량)**

---

## 문제 1: ThemeProvider 팔레트 해석 로직 중복

`ThemeProvider.tsx`에서 팔레트 이름을 해석하는 로직이 두 번 반복됩니다.

### 현재 상태

#### 위치 1: basePaletteDefinition (라인 110-123)

```typescript
// src/themes/ThemeProvider.tsx:110-123
const basePaletteDefinition = useMemo((): PaletteDefinition => {
  if (isCustomSemanticPaletteId(paletteName)) {
    const id = paletteName.replace('custom-semantic:', '');
    const preset = customSemanticPresets.find((p) => p.id === id);
    if (preset) {
      const def = presetToPaletteDefinition(preset);
      if (def) return def;
    }
    return palettePresets.default;
  }
  if (customColors) return toCustomPaletteDefinition(customColors);
  const preset = palettePresets[paletteName as Exclude<PaletteName, 'custom'>];
  return preset ?? palettePresets.default;
}, [paletteName, customColors, customSemanticPresets]);
```

#### 위치 2: palette (라인 184-196)

```typescript
// src/themes/ThemeProvider.tsx:184-196
const palette: ExternalPalette = useMemo(() => {
  if (customColors) return customColors;
  if (isCustomSemanticPaletteId(paletteName)) {
    const id = paletteName.replace('custom-semantic:', '');
    const preset = customSemanticPresets.find((p) => p.id === id);
    if (preset) {
      const base = palettePresets[preset.basePaletteId as keyof typeof palettePresets];
      if (base) return base.colors as ExternalPalette;
    }
  }
  const p = palettePresets[paletteName as Exclude<PaletteName, 'custom'>] ?? palettePresets.default;
  return p.colors as ExternalPalette;
}, [customColors, paletteName, customSemanticPresets]);
```

### 영향

1. **코드 중복**: 동일한 조건 분기 2회 작성
2. **동기화 위험**: 한 곳 수정 시 다른 곳도 수정해야 함
3. **유지보수 어려움**: 새로운 팔레트 유형 추가 시 두 곳 모두 변경 필요

### 해결 방안: usePaletteResolution 훅 추출

```typescript
// src/hooks/usePaletteResolution.ts

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
    // 1. Custom semantic preset
    if (isCustomSemanticPaletteId(paletteName)) {
      const id = paletteName.replace('custom-semantic:', '');
      const preset = customSemanticPresets.find((p) => p.id === id);
      if (preset) {
        const def = presetToPaletteDefinition(preset);
        const base = palettePresets[preset.basePaletteId as keyof typeof palettePresets];
        if (def && base) {
          return {
            definition: def,
            colors: base.colors as ExternalPalette,
          };
        }
      }
      // fallback
      return {
        definition: palettePresets.default,
        colors: palettePresets.default.colors as ExternalPalette,
      };
    }

    // 2. Custom colors
    if (customColors) {
      return {
        definition: toCustomPaletteDefinition(customColors),
        colors: customColors,
      };
    }

    // 3. Preset
    const preset = palettePresets[paletteName as Exclude<PaletteName, 'custom'>]
      ?? palettePresets.default;
    return {
      definition: preset,
      colors: preset.colors as ExternalPalette,
    };
  }, [paletteName, customColors, customSemanticPresets]);
}
```

---

## 문제 2: PaletteLab 상태 분산

`PaletteLab.tsx`에서 5개의 독립적인 상태 변수가 관리됩니다.

### 현재 상태

```typescript
// src/pages/layouts/PaletteLab/PaletteLab.tsx
// 상태 선언 위치: 컴포넌트 본문 (라인 번호는 추정)

const [detailSelection, setDetailSelection] = useState<DetailSelection>(null);
const [mappingModalTarget, setMappingModalTarget] = useState<MappingModalTarget>(null);
const [mappingOverrides, setMappingOverrides] = useState<Partial<SemanticMapping> | null>(null);
const [activeBrandTab, setActiveBrandTab] = useState<BrandColorTabId>('default');
```

### 문제점

1. **연관 상태 분리**: `mappingModalTarget`과 `mappingOverrides`는 항상 함께 동작
2. **상태 초기화 복잡**: 모달 닫힐 때 여러 상태를 개별 초기화해야 함
3. **타입 복잡성**: 각 상태의 타입이 독립적으로 정의됨

### 해결 방안 A: useReducer 사용

```typescript
// src/pages/layouts/PaletteLab/usePaletteLabState.ts

interface PaletteLabState {
  detailSelection: DetailSelection;
  mappingModal: {
    target: MappingModalTarget;
    overrides: Partial<SemanticMapping> | null;
  } | null;
  activeBrandTab: BrandColorTabId;
}

type PaletteLabAction =
  | { type: 'SELECT_DETAIL'; payload: DetailSelection }
  | { type: 'OPEN_MAPPING_MODAL'; payload: MappingModalTarget }
  | { type: 'UPDATE_MAPPING_OVERRIDES'; payload: Partial<SemanticMapping> }
  | { type: 'CLOSE_MAPPING_MODAL' }
  | { type: 'SET_BRAND_TAB'; payload: BrandColorTabId };

function paletteLabReducer(state: PaletteLabState, action: PaletteLabAction): PaletteLabState {
  switch (action.type) {
    case 'OPEN_MAPPING_MODAL':
      return {
        ...state,
        mappingModal: { target: action.payload, overrides: null },
      };
    case 'CLOSE_MAPPING_MODAL':
      return {
        ...state,
        mappingModal: null,
      };
    // ...
  }
}

export function usePaletteLabState() {
  const [state, dispatch] = useReducer(paletteLabReducer, initialState);
  return { state, dispatch };
}
```

### 해결 방안 B: 관련 상태 그룹화

```typescript
// 모달 관련 상태만 그룹화
const [mappingModal, setMappingModal] = useState<{
  target: MappingModalTarget;
  overrides: Partial<SemanticMapping> | null;
} | null>(null);

// 모달 열기
const openMappingModal = (target: MappingModalTarget) => {
  setMappingModal({ target, overrides: null });
};

// 모달 닫기 - 한 번에 초기화
const closeMappingModal = () => {
  setMappingModal(null);
};
```

---

## 문제 3: localStorage 로직 혼재

`ThemeProvider.tsx`에서 localStorage 접근 로직이 컴포넌트 로직과 섞여 있습니다.

### 현재 상태

#### useState 초기화 (라인 76-87)

```typescript
const [customSemanticPresets, setCustomSemanticPresetsState] = useState<
  CustomSemanticPreset[]
>(() => {
  try {
    const raw = localStorage.getItem(CUSTOM_SEMANTIC_PRESETS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: StoredCustomSemanticPresets = JSON.parse(raw);
    return parsed?.presets ?? [];
  } catch {
    return [];
  }
});
```

#### 저장 콜백 (라인 89-94)

```typescript
const persistCustomSemanticPresets = useCallback((presets: CustomSemanticPreset[]) => {
  localStorage.setItem(
    CUSTOM_SEMANTIC_PRESETS_STORAGE_KEY,
    JSON.stringify({ version: '1', presets } satisfies StoredCustomSemanticPresets)
  );
}, []);
```

#### CRUD 작업 (라인 132-178)

각 CRUD 함수에서 `persistCustomSemanticPresets` 호출

### 영향

1. **관심사 혼합**: UI 로직과 스토리지 로직이 한 파일에 존재
2. **테스트 어려움**: localStorage 모킹 필요
3. **재사용 불가**: 다른 컴포넌트에서 동일 로직 사용 불가

### 해결 방안: useCustomSemanticPresets 훅 추출

```typescript
// src/hooks/useCustomSemanticPresets.ts

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

  const add = useCallback((preset: Omit<CustomSemanticPreset, 'id' | 'createdAt'>) => {
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
  }, [persist]);

  const update = useCallback((id: string, updates: Partial<CustomSemanticPreset>) => {
    setPresets((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      persist(next);
      return next;
    });
  }, [persist]);

  const remove = useCallback((id: string) => {
    setPresets((prev) => {
      const next = prev.filter((p) => p.id !== id);
      persist(next);
      return next;
    });
  }, [persist]);

  return {
    presets,
    add,
    update,
    remove,
  };
}
```

---

## 리팩토링 단계

### Step 1: usePaletteResolution 훅 생성

```bash
# 새 파일 생성
touch src/hooks/usePaletteResolution.ts
```

### Step 2: useCustomSemanticPresets 훅 생성

```bash
touch src/hooks/useCustomSemanticPresets.ts
```

### Step 3: ThemeProvider 리팩토링

```diff
// src/themes/ThemeProvider.tsx

+ import { usePaletteResolution } from '../hooks/usePaletteResolution';
+ import { useCustomSemanticPresets } from '../hooks/useCustomSemanticPresets';

export function ThemeProvider({ ... }) {
-  const [customSemanticPresets, setCustomSemanticPresetsState] = useState<...>(() => { ... });
-  const persistCustomSemanticPresets = useCallback(...);
+  const {
+    presets: customSemanticPresets,
+    add: addCustomSemanticPreset,
+    update: updateCustomSemanticPreset,
+    remove: deleteCustomSemanticPreset,
+  } = useCustomSemanticPresets();

-  const basePaletteDefinition = useMemo(() => { ... }, [...]);
-  const palette: ExternalPalette = useMemo(() => { ... }, [...]);
+  const { definition: basePaletteDefinition, colors: palette } = usePaletteResolution(
+    paletteName,
+    customColors,
+    customSemanticPresets
+  );
```

### Step 4: PaletteLab 상태 통합 (선택적)

```diff
// src/pages/layouts/PaletteLab/PaletteLab.tsx

- const [mappingModalTarget, setMappingModalTarget] = useState<...>(null);
- const [mappingOverrides, setMappingOverrides] = useState<...>(null);
+ const [mappingModal, setMappingModal] = useState<{
+   target: MappingModalTarget;
+   overrides: Partial<SemanticMapping> | null;
+ } | null>(null);
```

---

## 체크리스트

- [ ] `usePaletteResolution` 훅 생성
- [ ] `useCustomSemanticPresets` 훅 생성
- [ ] `ThemeProvider`에서 새 훅 사용
- [ ] `PaletteLab` 상태 그룹화 (선택적)
- [ ] 기존 기능 동작 확인
- [ ] localStorage 데이터 호환성 확인
