# 컴포넌트 중복 분석

**우선순위: P3 (중간 영향도, 중간 작업량)**

---

## 문제 1: 탭 컴포넌트 중복

거의 동일한 탭 컴포넌트가 두 개 존재합니다.

### 현재 상태

#### PaletteCategoryTabs.tsx

```typescript
// src/pages/layouts/PaletteLab/PaletteCategoryTabs.tsx (전체 47줄)

import styles from './ThemeTabNavigation.module.css';

export type BrandColorTabId = 'default' | 'natural' | 'custom';

const TABS: { id: BrandColorTabId; label: string }[] = [
  { id: 'default', label: 'Default' },
  { id: 'natural', label: 'Natural' },
  { id: 'custom', label: 'Custom' },
];

export interface PaletteCategoryTabsProps {
  activeTab: BrandColorTabId;
  onTabChange: (tab: BrandColorTabId) => void;
}

export function PaletteCategoryTabs({ activeTab, onTabChange }: PaletteCategoryTabsProps) {
  return (
    <div className={styles.tabList} role="tablist" aria-label="브랜드 컬러">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          // ...
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
```

#### ThemeTabNavigation.tsx (GlobalSettings에서 사용)

```typescript
// src/pages/layouts/PaletteLab/ThemeTabNavigation.tsx (추정, 유사 구조)

import styles from './ThemeTabNavigation.module.css';

export type ThemeCategory = 'custom' | 'default' | 'natural';

const TABS: { id: ThemeCategory; label: string }[] = [
  { id: 'custom', label: 'Custom' },   // 순서만 다름
  { id: 'default', label: 'Default' },
  { id: 'natural', label: 'Natural' },
];

// 나머지 구조 동일
```

### 영향

1. **코드 중복**: 동일한 렌더링 로직 2회 작성
2. **스타일 공유**: 같은 CSS 파일 사용하지만 컴포넌트는 별도
3. **유지보수 부담**: 탭 디자인 변경 시 두 곳 수정 필요

### 해결 방안: GenericTabs 컴포넌트

```typescript
// src/components/GenericTabs/GenericTabs.tsx

export interface TabItem<T extends string> {
  id: T;
  label: string;
}

export interface GenericTabsProps<T extends string> {
  tabs: TabItem<T>[];
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

#### 사용 예시

```typescript
// PaletteLab에서
const PALETTE_TABS = [
  { id: 'default', label: 'Default' },
  { id: 'natural', label: 'Natural' },
  { id: 'custom', label: 'Custom' },
] as const;

<GenericTabs
  tabs={PALETTE_TABS}
  activeTab={activeBrandTab}
  onTabChange={setActiveBrandTab}
  ariaLabel="브랜드 컬러"
/>

// GlobalSettings에서
const THEME_TABS = [
  { id: 'custom', label: 'Custom' },
  { id: 'default', label: 'Default' },
  { id: 'natural', label: 'Natural' },
] as const;

<GenericTabs
  tabs={THEME_TABS}
  activeTab={presetTab}
  onTabChange={setPresetTab}
  ariaLabel="테마 카테고리"
/>
```

---

## 문제 2: 프리셋 필터링 로직 중복

프리셋을 카테고리별로 필터링하고 검색하는 로직이 중복됩니다.

### 현재 상태

#### GlobalSettingsModal.tsx (라인 200-240 추정)

```typescript
const filteredDefaultThemes = useMemo(() => {
  if (!presetSearch.trim()) return defaultThemes;
  const all = searchThemesByName(presetSearch);
  return defaultThemes.filter((t) => all.some((a) => a.metadata?.id === t.metadata?.id));
}, [defaultThemes, presetSearch]);

const filteredNaturalThemes = useMemo(() => {
  if (!presetSearch.trim()) return naturalThemes;
  const all = searchThemesByName(presetSearch);
  return naturalThemes.filter((t) => all.some((a) => a.metadata?.id === t.metadata?.id));
}, [naturalThemes, presetSearch]);

const filteredCustomPresets = useMemo(() => {
  if (!presetSearch.trim()) return customSemanticPresets;
  // ... 유사 로직
}, [customSemanticPresets, presetSearch]);
```

#### PaletteLab.tsx (라인 477-484 추정)

```typescript
const defaultThemes = useMemo(() => getThemesByCategory('default'), []);
const naturalThemes = useMemo(() => getThemesByCategory('natural'), []);
// 검색 로직도 유사
```

### 영향

1. **로직 중복**: 필터링 패턴 3회 반복
2. **일관성 위험**: 필터링 방식 변경 시 모든 곳 수정 필요

### 해결 방안: usePresetFiltering 훅

```typescript
// src/hooks/usePresetFiltering.ts

interface UsePresetFilteringOptions {
  defaultThemes: PaletteDefinition[];
  naturalThemes: PaletteDefinition[];
  customPresets?: CustomSemanticPreset[];
}

interface UsePresetFilteringResult {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredDefault: PaletteDefinition[];
  filteredNatural: PaletteDefinition[];
  filteredCustom: CustomSemanticPreset[];
}

export function usePresetFiltering({
  defaultThemes,
  naturalThemes,
  customPresets = [],
}: UsePresetFilteringOptions): UsePresetFilteringResult {
  const [searchQuery, setSearchQuery] = useState('');

  const filterBySearch = useCallback(
    <T extends { metadata?: { id?: string; displayName?: string } }>(items: T[]): T[] => {
      if (!searchQuery.trim()) return items;
      const query = searchQuery.toLowerCase();
      return items.filter((item) => {
        const name = item.metadata?.displayName?.toLowerCase() ?? '';
        const id = item.metadata?.id?.toLowerCase() ?? '';
        return name.includes(query) || id.includes(query);
      });
    },
    [searchQuery]
  );

  const filteredDefault = useMemo(
    () => filterBySearch(defaultThemes),
    [filterBySearch, defaultThemes]
  );

  const filteredNatural = useMemo(
    () => filterBySearch(naturalThemes),
    [filterBySearch, naturalThemes]
  );

  const filteredCustom = useMemo(
    () => filterBySearch(customPresets),
    [filterBySearch, customPresets]
  );

  return {
    searchQuery,
    setSearchQuery,
    filteredDefault,
    filteredNatural,
    filteredCustom,
  };
}
```

---

## 문제 3: ColorUsageDiagram 다중 모드

단일 컴포넌트가 3가지 다른 모드를 처리합니다.

### 현재 상태

```typescript
// src/pages/layouts/PaletteLab/ColorUsageDiagram.tsx (라인 396-424 추정)

interface ColorUsageDiagramProps {
  // ...
  interactive?: boolean;         // 인터랙티브 모드 토글
  hideColorRoles?: boolean;      // 색상 역할 숨김
  horizontalLayout?: boolean;    // 가로 레이아웃
  hideTokenExample?: boolean;    // 토큰 예시 숨김
  onTokenSelect?: (token: SemanticTokenPath, currentValue: string | ScaleReference) => void;
}
```

### 모드별 사용 패턴

| 모드 | interactive | onTokenSelect | 사용처 |
|------|-------------|---------------|--------|
| 읽기 전용 | false | - | 개요 표시 |
| 인라인 편집 | true | 콜백 제공 | SemanticMappingModal 내부 |
| 모달 편집 | true | 내부 모달 열기 | PaletteLab 직접 사용 |

### 영향

1. **복잡한 조건부 렌더링**: 모드에 따라 다른 UI 표시
2. **Props 과다**: 모드 조합에 따라 불필요한 Props 전달
3. **테스트 어려움**: 모든 모드 조합 테스트 필요

### 해결 방안: 모드별 컴포넌트 분리

```typescript
// 공통 로직 추출
// src/pages/layouts/PaletteLab/ColorUsageDiagramCore.tsx
export function ColorUsageDiagramCore({ mapping, scales }: CoreProps) {
  // 색상 스와치, 레이블 등 공통 렌더링
}

// 읽기 전용 버전
// src/pages/layouts/PaletteLab/ColorUsageOverview.tsx
export function ColorUsageOverview({ mapping, scales }: OverviewProps) {
  return <ColorUsageDiagramCore mapping={mapping} scales={scales} />;
}

// 인라인 편집 버전
// src/pages/layouts/PaletteLab/ColorUsageEditor.tsx
export function ColorUsageEditor({
  mapping,
  scales,
  onTokenChange,
}: EditorProps) {
  return (
    <ColorUsageDiagramCore mapping={mapping} scales={scales}>
      {/* 편집 UI */}
    </ColorUsageDiagramCore>
  );
}

// 모달 편집 버전 (기존 동작 유지)
// src/pages/layouts/PaletteLab/ColorUsageWithModal.tsx
export function ColorUsageWithModal({ mapping, scales }: ModalProps) {
  const [modalToken, setModalToken] = useState<SemanticTokenPath | null>(null);
  // ...
}
```

---

## 문제 4: 상수 중복

동일한 상수가 여러 파일에서 로컬로 정의됩니다.

### 현재 상태

#### PaletteLab.tsx (라인 42-45)

```typescript
const colorKeys = ['primary', 'secondary', 'accent', 'sub', 'neutral'] as const;
const systemColorKeys = ['error', 'warning', 'success', 'info'] as const;
const systemScaleSteps = [50, 500, 700] as const;
const scaleSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
```

#### ScaleSelectionModal.tsx (라인 17-27 추정)

```typescript
const SCALES: ScaleReference['scale'][] = ['primary', 'secondary', 'accent', 'neutral', 'sub'];
const STEPS: ScaleReference['step'][] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
```

### 해결 방안: 상수 중앙화

```typescript
// src/constants/palette-scales.ts

/** 팔레트 스케일 키 (순서 중요: UI 표시 순서) */
export const PALETTE_SCALES = ['primary', 'secondary', 'accent', 'sub', 'neutral'] as const;
export type PaletteScale = typeof PALETTE_SCALES[number];

/** 스케일 스텝 (50-900) */
export const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
export type ScaleStep = typeof SCALE_STEPS[number];

/** 시스템 컬러 키 */
export const SYSTEM_COLOR_KEYS = ['error', 'warning', 'success', 'info'] as const;
export type SystemColorKey = typeof SYSTEM_COLOR_KEYS[number];

/** 시스템 컬러에서 사용하는 스텝 */
export const SYSTEM_SCALE_STEPS = [50, 500, 700] as const;
```

---

## 리팩토링 단계

### Step 1: 상수 중앙화

```bash
touch src/constants/palette-scales.ts
```

### Step 2: GenericTabs 컴포넌트 생성

```bash
mkdir -p src/components/GenericTabs
touch src/components/GenericTabs/GenericTabs.tsx
touch src/components/GenericTabs/GenericTabs.module.css
touch src/components/GenericTabs/index.ts
```

### Step 3: usePresetFiltering 훅 생성

```bash
touch src/hooks/usePresetFiltering.ts
```

### Step 4: 기존 컴포넌트 마이그레이션

```diff
// PaletteCategoryTabs.tsx
+ import { GenericTabs } from '../../../components/GenericTabs';
+ import { PALETTE_TABS } from '../constants';

- export function PaletteCategoryTabs({ activeTab, onTabChange }) {
-   return (...)
- }
+ // 기존 컴포넌트를 GenericTabs 래퍼로 변경
+ export function PaletteCategoryTabs({ activeTab, onTabChange }: Props) {
+   return (
+     <GenericTabs
+       tabs={PALETTE_TABS}
+       activeTab={activeTab}
+       onTabChange={onTabChange}
+       ariaLabel="브랜드 컬러"
+     />
+   );
+ }
```

### Step 5: ColorUsageDiagram 분리 (선택적)

복잡도에 따라 점진적 분리 검토

---

## 체크리스트

- [ ] `constants/palette-scales.ts` 생성
- [ ] `GenericTabs` 컴포넌트 생성
- [ ] 기존 탭 컴포넌트 마이그레이션
- [ ] `usePresetFiltering` 훅 생성
- [ ] 프리셋 필터링 로직 마이그레이션
- [ ] 상수 import 업데이트
- [ ] ColorUsageDiagram 분리 검토 (선택적)
