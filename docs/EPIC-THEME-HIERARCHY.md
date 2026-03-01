# Epic: 테마 카테고리 시스템 및 확장 가능한 프리셋 구조

> **페이즈별 분리 문서**: 이 에픽은 `docs/epic/theme-hierarchy/` 에서 P01~P06 페이즈별로 분리 관리됩니다.
> - [epic-overview.md](./epic/theme-hierarchy/epic-overview.md) | [P01](./epic/theme-hierarchy/P01-foundation.md) | [P02](./epic/theme-hierarchy/P02-migration.md) | [P03](./epic/theme-hierarchy/P03-semantic-mapping.md) | [P04](./epic/theme-hierarchy/P04-ui-components.md) | [P05](./epic/theme-hierarchy/P05-lab-integration.md) | [P06](./epic/theme-hierarchy/P06-testing.md) | [REVIEW](./epic/theme-hierarchy/REVIEW-impact-and-improvements.md)

## 개요

현재 flat한 프리셋 구조를 카테고리 기반 시스템으로 변경하고, Default만 남긴 상태에서 점진적으로 확장 가능한 구조로 개선합니다.

## 배경 및 문제점

### 현재 구조
- **Flat Preset List**: `default`, `vivid`, `pastel`, `monochrome`, `earth` 등이 동일 레벨에 나열
- **불필요한 프리셋**: 개발 중인 시스템에 미리 정의된 테마들이 많아 관리 부담
- **확장성 제약**: 새로운 프리셋 추가 시 분류 체계 없음
- **카테고리 부재**: Custom과 Preset의 구분이 명확하지 않음

### 기존 파일 구조
```
src/palettes/presets/
├── index.ts           # 모든 프리셋 export
├── default.ts
├── vivid.ts          # 제거 예정
├── pastel.ts         # 제거 예정
├── monochrome.ts     # 제거 예정
└── earth.ts          # 제거 예정
```

## 목표

1. **미니멀한 시작점**
   - Default 카테고리에 default 프리셋만 유지
   - 나머지 프리셋(vivid, pastel, monochrome, earth) 제거

2. **확장 가능한 카테고리 구조**
   - Default, Custom, Natural 3개 카테고리로 시작
   - 향후 카테고리 추가 시 쉽게 확장 가능한 구조

3. **메타데이터 시스템**
   - 각 프리셋에 카테고리, 이름, 설명만 포함
   - 단순한 이름/설명 기반 검색 지원

4. **UI/UX 개선**
   - Custom 탭을 기본으로 하는 탭 구조
   - 이름/설명 기반 검색 기능 구현

5. **시맨틱 매핑 커스터마이징**
   - 컬러 스케일 → 시맨틱 토큰 매핑을 프리셋별로 정의 가능
   - Lab에서 시각적으로 매핑 조정 가능
   - Default 매핑 제공 및 오버라이드 지원

## 제안 구조

### 1. 새로운 타입 정의

```typescript
// src/palettes/types.ts

/** 테마 카테고리 */
export type ThemeCategory =
  | 'default'   // 기본 시스템 테마
  | 'custom'    // 사용자 정의
  | 'natural';  // 자연에서 영감을 받은 테마 (확장 예정)

/** 테마 메타데이터 */
export interface ThemeMetadata {
  /** 테마 ID (고유 키) */
  id: string;

  /** 표시 이름 */
  displayName: string;

  /** 카테고리 */
  category: ThemeCategory;

  /** 설명 */
  description?: string;
}

/** 시맨틱 토큰 매핑 정의 */
export interface SemanticMapping {
  bg: {
    base: string | ScaleReference;      // '#FFFFFF' 또는 { scale: 'neutral', step: 50 }
    surface: string | ScaleReference;
    surfaceBrand: string | ScaleReference;
    elevated: string | ScaleReference;
    muted: string | ScaleReference;
  };
  text: {
    primary: string | ScaleReference;
    secondary: string | ScaleReference;
    muted: string | ScaleReference;
    onAction: string | ScaleReference;
  };
  border: {
    default: string | ScaleReference;
    subtle: string | ScaleReference;
    accent: string | ScaleReference;
    focus: string | ScaleReference;
  };
}

/** 스케일 참조 (예: primary-500, neutral-900) */
export interface ScaleReference {
  scale: 'primary' | 'secondary' | 'accent' | 'neutral' | 'sub';
  step: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
}

/** 확장된 Palette Definition */
export interface PaletteDefinition {
  // ... 기존 필드 유지

  /** 테마 메타데이터 (선택적, 점진적 마이그레이션) */
  metadata?: ThemeMetadata;

  /** 시맨틱 매핑 (선택적, 없으면 bgStrategy 기본값 사용) */
  semanticMapping?: SemanticMapping;
}
```

### 2. 새로운 디렉토리 구조

```
src/palettes/
├── presets/
│   ├── index.ts                    # 중앙 export
│   ├── registry.ts                 # 테마 레지스트리 (메타데이터 + 조회 유틸)
│   ├── default/
│   │   ├── index.ts
│   │   └── default.ts              # 기존 default만 유지
│   └── natural/
│       └── index.ts                # 빈 카테고리 (향후 확장용)
├── strategies/
│   └── default-mappings.ts         # NEW: 기본 매핑 정의 (light/colored/dark)
    # light-bg, colored-bg, dark-bg.ts 제거됨 (resolve 경로로 통일)
└── mapping/
    └── resolve.ts                  # NEW: 매핑 해석 (ScaleReference → 실제 색상)
    # editor.ts 없음: 매핑 편집은 ColorUsageDiagram + ScaleSelectionModal 내부 로직으로 처리
```

**제거 예정 파일:**
- `vivid.ts`, `pastel.ts`, `monochrome.ts`, `earth.ts` (P02)
- `light-bg.ts`, `colored-bg.ts`, `dark-bg.ts` (P03, resolve 경로로 통일)

### 3. Registry 구현

```typescript
// src/palettes/presets/registry.ts

import type { PaletteDefinition, ThemeCategory } from '../types';
import * as defaultThemes from './default';

export interface ThemeGroup {
  category: ThemeCategory;
  displayName: string;
  description: string;
  themes: PaletteDefinition[];
}

/** 전체 테마 레지스트리 */
export const themeRegistry: ThemeGroup[] = [
  {
    category: 'default',
    displayName: 'Default',
    description: '기본 시스템 테마',
    themes: Object.values(defaultThemes),
  },
  {
    category: 'natural',
    displayName: 'Natural',
    description: '자연에서 영감을 받은 유기적이고 편안한 테마',
    themes: [], // 향후 추가 예정
  },
];

/** ID로 테마 찾기 */
export function findThemeById(id: string): PaletteDefinition | undefined {
  return themeRegistry
    .flatMap(group => group.themes)
    .find(theme => theme.metadata?.id === id);
}

/** 카테고리별 테마 조회 */
export function getThemesByCategory(category: ThemeCategory): PaletteDefinition[] {
  return themeRegistry
    .find(group => group.category === category)
    ?.themes ?? [];
}

/** 이름/설명으로 테마 검색 */
export function searchThemesByName(query: string): PaletteDefinition[] {
  const lowerQuery = query.toLowerCase();
  return themeRegistry
    .flatMap(group => group.themes)
    .filter(theme =>
      theme.metadata?.displayName.toLowerCase().includes(lowerQuery) ||
      theme.metadata?.description?.toLowerCase().includes(lowerQuery)
    );
}

/** 모든 테마 플랫 리스트 */
export function getAllThemes(): PaletteDefinition[] {
  return themeRegistry.flatMap(group => group.themes);
}
```

### 4. 시맨틱 매핑 시스템

#### 기본 매핑 정의

```typescript
// src/palettes/strategies/default-mappings.ts

import type { SemanticMapping, BgStrategy } from '../types';

/** BgStrategy별 기본 매핑 */
export const defaultSemanticMappings: Record<BgStrategy, SemanticMapping> = {
  light: {
    bg: {
      base: '#FFFFFF',
      surface: { scale: 'neutral', step: 50 },
      surfaceBrand: { scale: 'primary', step: 50 },
      elevated: '#FFFFFF',
      muted: { scale: 'neutral', step: 100 },
    },
    text: {
      primary: { scale: 'neutral', step: 900 },
      secondary: { scale: 'neutral', step: 700 },
      muted: { scale: 'neutral', step: 500 },
      onAction: '#FFFFFF',
    },
    border: {
      default: { scale: 'neutral', step: 300 },
      subtle: { scale: 'neutral', step: 200 },
      accent: { scale: 'primary', step: 200 },
      focus: { scale: 'primary', step: 500 },
    },
  },
  colored: {
    bg: {
      base: { scale: 'neutral', step: 100 },
      surface: { scale: 'neutral', step: 50 },
      surfaceBrand: { scale: 'primary', step: 50 },
      elevated: '#FFFFFF',
      muted: { scale: 'neutral', step: 200 },
    },
    text: {
      primary: { scale: 'neutral', step: 900 },
      secondary: { scale: 'neutral', step: 700 },
      muted: { scale: 'neutral', step: 600 },
      onAction: '#FFFFFF',
    },
    border: {
      default: { scale: 'neutral', step: 300 },
      subtle: { scale: 'neutral', step: 200 },
      accent: { scale: 'primary', step: 200 },
      focus: { scale: 'primary', step: 500 },
    },
  },
  dark: {
    bg: {
      base: { scale: 'neutral', step: 900 },
      surface: { scale: 'neutral', step: 800 },
      surfaceBrand: { scale: 'primary', step: 900 },
      elevated: { scale: 'neutral', step: 700 },
      muted: { scale: 'neutral', step: 800 },
    },
    text: {
      primary: { scale: 'neutral', step: 50 },
      secondary: { scale: 'neutral', step: 200 },
      muted: { scale: 'neutral', step: 400 },
      onAction: { scale: 'neutral', step: 900 },
    },
    border: {
      default: { scale: 'neutral', step: 600 },
      subtle: { scale: 'neutral', step: 700 },
      accent: { scale: 'primary', step: 400 },
      focus: { scale: 'primary', step: 400 },
    },
  },
};
```

#### 매핑 해석 (Resolve)

```typescript
// src/palettes/mapping/resolve.ts

import type { GeneratedScales } from '../../@types/tokens';
import type { SemanticMapping, SemanticColors, ScaleReference } from '../types';

/**
 * ScaleReference 또는 직접 색상을 실제 색상 값으로 변환
 */
function resolveColorValue(
  value: string | ScaleReference,
  scales: GeneratedScales
): string {
  if (typeof value === 'string') {
    return value; // 직접 색상 (#FFFFFF 등)
  }

  // ScaleReference인 경우
  const scale = scales[value.scale];
  if (!scale) {
    console.warn(`Scale '${value.scale}' not found, using fallback`);
    return '#000000';
  }

  const color = scale[value.step];
  if (!color) {
    console.warn(`Step ${value.step} not found in '${value.scale}' scale`);
    return '#000000';
  }

  return color;
}

/**
 * SemanticMapping을 실제 SemanticColors로 변환
 */
export function resolveSemanticMapping(
  mapping: SemanticMapping,
  scales: GeneratedScales
): SemanticColors {
  return {
    bg: {
      base: resolveColorValue(mapping.bg.base, scales),
      surface: resolveColorValue(mapping.bg.surface, scales),
      surfaceBrand: resolveColorValue(mapping.bg.surfaceBrand, scales),
      elevated: resolveColorValue(mapping.bg.elevated, scales),
      muted: resolveColorValue(mapping.bg.muted, scales),
    },
    text: {
      primary: resolveColorValue(mapping.text.primary, scales),
      secondary: resolveColorValue(mapping.text.secondary, scales),
      muted: resolveColorValue(mapping.text.muted, scales),
      onAction: resolveColorValue(mapping.text.onAction, scales),
    },
    border: {
      default: resolveColorValue(mapping.border.default, scales),
      subtle: resolveColorValue(mapping.border.subtle, scales),
      accent: resolveColorValue(mapping.border.accent, scales),
      focus: resolveColorValue(mapping.border.focus, scales),
    },
  };
}
```

#### 업데이트된 createPalette

```typescript
// src/palettes/index.ts

import { defaultSemanticMappings } from './strategies/default-mappings';
import { resolveSemanticMapping } from './mapping/resolve';

export function createPalette(definition: PaletteDefinition): ExpandedPalette {
  const resolved = resolvePalette(definition.colors as ExternalPalette);
  const scales = generateColorScales(resolved);

  // 시맨틱 매핑: 프리셋 정의 > 기본 매핑
  const mapping = definition.semanticMapping
    ?? defaultSemanticMappings[definition.bgStrategy];

  const semantic = resolveSemanticMapping(mapping, scales);

  return {
    name: definition.name,
    bgStrategy: definition.bgStrategy,
    scales,
    semantic,
  };
}
```

## UI 변경 사항

### PaletteLab 모달 개선

#### 현재 구조
```
[Modal]
├── Color Scales Section
│   └── [default] [vivid] [pastel] [monochrome] [earth]
```

#### 개선된 구조
```
[Modal with Tabs]
├── Tab: Custom (기본 선택)
│   └── 사용자 직접 색상 입력 UI
├── Tab: Default
│   └── [Default Theme]
└── Tab: Natural
    └── (비어있음 - 향후 추가 예정)

[Search Bar]
└── "Search themes..." (name, description 검색)
```

### 검색 UI 동작

1. **검색 입력 시**
   - 모든 탭에서 일치하는 테마만 표시
   - 일치 항목이 없는 탭은 비활성화 또는 숨김
   - 검색어 하이라이트

2. **빈 카테고리 표시**
   - Natural 탭 선택 시 "아직 테마가 없습니다" 메시지 표시
   - 향후 테마 추가 시 자동으로 표시됨

## 구현 단계

### Phase 1: 기반 구조 변경
- [ ] 타입 정의 업데이트
  - `PaletteDefinition`에 선택적 `metadata` 필드 추가
  - `ThemeCategory` 타입 정의 (`'default' | 'custom' | 'natural'`)
  - `ThemeMetadata` 인터페이스 정의
- [ ] 디렉토리 구조 생성
  - `src/palettes/presets/default/` 폴더 생성
  - `src/palettes/presets/natural/` 폴더 생성
- [ ] Registry 구현
  - `src/palettes/presets/registry.ts` 생성
  - 검색/조회 유틸 함수 구현

### Phase 2: 프리셋 정리 및 마이그레이션
- [ ] Default 프리셋 마이그레이션
  - `default.ts` → `default/default.ts` 이동
  - 메타데이터 추가
- [ ] 불필요한 프리셋 제거
  - `vivid.ts` 삭제
  - `pastel.ts` 삭제
  - `monochrome.ts` 삭제
  - `earth.ts` 삭제
  - `monochrome.ts` 삭제 (git에서 untracked)
  - `earth.ts` 삭제 (git에서 untracked)
- [ ] Export 구조 업데이트
  - `index.ts`에서 default만 export
  - registry export 추가
- [ ] 관련 파일 업데이트
  - `palette-definitions.ts`에서 제거된 프리셋 참조 제거
  - `lab-presets.ts`에서 비교 목록 업데이트

### Phase 3: 시맨틱 매핑 시스템
- [ ] 기본 매핑 정의
  - `default-mappings.ts` 생성
  - light/colored/dark 매핑 이전
- [ ] 매핑 해석 로직
  - `mapping/resolve.ts` 구현
  - ScaleReference → 실제 색상 변환
- [ ] createPalette 업데이트
  - strategy 제거. 항상 getMergedMapping → resolveSemanticMapping 경로만 사용

### Phase 4: UI 컴포넌트 구현
- [ ] ThemeTabNavigation 컴포넌트
  - Custom, Default, Natural 탭 구현
  - 빈 카테고리 처리 (Natural)
- [ ] ThemeSearchBar 컴포넌트
  - 검색 입력 UI
  - Debounce 적용 (300ms)
- [ ] EmptyCategory 컴포넌트
  - "아직 테마가 없습니다" 메시지
- [ ] ColorUsageDiagram 인터랙티브 모드
  - 컬러 배지 클릭 가능하도록 개선
  - 클릭 시 스케일 선택 모달 트리거
- [ ] ScaleSelectionModal 컴포넌트
  - 스케일 목록 표시 (primary/secondary/accent/neutral/sub)
  - 헤더에 추천(✓)/경고(⚠️) 아이콘 고정 배치
  - 아이콘 호버 시 툴팁으로 이유 설명
  - Step 선택 UI (50~900)
  - Direct Color Input 옵션 (#HEX)
- [ ] 추천 시스템 구현
  - `mapping/recommendations.ts` 로직 구현
  - bgStrategy 기반 동적 추천
  - 고정 레이아웃으로 UI 깨짐 방지

### Phase 5: PaletteLab 통합
- [ ] PaletteLab 레이아웃 변경
  - 탭 네비게이션 통합
  - Custom 탭을 기본으로 설정
- [ ] 카테고리별 렌더링
  - Default 카테고리: default 테마만 표시
  - Natural 카테고리: 빈 상태 표시
- [ ] 검색 기능 통합
  - 검색어 입력 시 필터링
  - 결과 없는 탭 비활성화
- [ ] 시맨틱 매핑 편집 UI
  - DetailPanel에 Semantic Mapping 섹션 추가
  - ColorUsageDiagram를 인터랙티브 모드로 통합
  - ScaleSelectionModal 연동
  - 추천/경고 아이콘 및 툴팁 표시
  - 실시간 프리뷰
  - "Reset to Default" 버튼
- [ ] 상태 관리
  - 선택된 탭 상태
  - 검색어 상태
  - 편집 중인 매핑 상태

### Phase 6: 테스트 및 정리
- [ ] 빌드 테스트
- [ ] 타입 에러 확인
- [ ] 기존 참조 확인 (ThemeProvider, ColorPicker 등)
- [ ] 문서 업데이트

## 마이그레이션 예시

### Default 프리셋 (기존 → 마이그레이션 후)

#### 기존
```typescript
// src/palettes/presets/default.ts
export const defaultPalette: PaletteDefinition = {
  name: 'default',
  subname: '범용 균형잡힌 배색',
  colors: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    accent: '#10B981',
    neutral: '#64748B',
  },
  bgStrategy: 'light',
};
```

#### 마이그레이션 후
```typescript
// src/palettes/presets/default/default.ts
export const defaultPalette: PaletteDefinition = {
  name: 'default',
  subname: '범용 균형잡힌 배색',
  colors: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    accent: '#10B981',
    neutral: '#64748B',
  },
  bgStrategy: 'light',
  metadata: {
    id: 'default',
    displayName: 'Default',
    category: 'default',
    description: '범용적으로 사용 가능한 균형 잡힌 배색',
  },
};
```

### Export 구조 업데이트

```typescript
// src/palettes/presets/index.ts
export { defaultPalette } from './default/default';

// Registry export
export * from './registry';
export {
  themeRegistry,
  getAllThemes,
  findThemeById,
  getThemesByCategory,
  searchThemesByName
} from './registry';
```

### Natural 카테고리 (향후 확장 예정)

```typescript
// src/palettes/presets/natural/index.ts (빈 파일)
// 향후 ocean.ts, forest.ts 등 추가 예정
```

## 하위 호환성

### 제거되는 Export
- `vividPalette` - 제거
- `pastelPalette` - 제거
- `monochromePalette` - 제거
- `earthPalette` - 제거

### 영향받는 코드
- `palette-definitions.ts`: `themePresets`에서 제거된 프리셋 참조 삭제
- `lab-presets.ts`: `comparisonPresets.palettes`에서 제거된 항목 삭제
- `PaletteLab.tsx`: 제거된 프리셋을 참조하는 코드 정리

### 안전한 마이그레이션
1. Default 프리셋만 남기고 나머지는 완전히 제거
2. Custom은 런타임에서 처리 (프리셋 파일 없음)
3. Natural 카테고리는 빈 상태로 시작

## 성공 지표

1. **단순성**
   - Default 프리셋 1개만 유지
   - 불필요한 프리셋 완전 제거
   - 빌드 에러 없음

2. **확장성**
   - 새 카테고리 추가 시 registry에 한 줄 추가
   - 새 테마 추가 시 해당 카테고리 폴더에 파일 생성만
   - 타입 안전성 유지

3. **UI/UX**
   - Custom 탭이 기본으로 선택됨
   - 검색 기능 동작
   - 빈 카테고리(Natural) 적절히 표시

## 관련 파일

### 수정 필요
- [src/palettes/types.ts](../src/palettes/types.ts) - ThemeCategory, ThemeMetadata 추가
- [src/palettes/presets/index.ts](../src/palettes/presets/index.ts) - Export 구조 단순화
- [src/constants/palette-definitions.ts](../src/constants/palette-definitions.ts) - 제거된 프리셋 참조 삭제
- [src/pages/layouts/PaletteLab/PaletteLab.tsx](../src/pages/layouts/PaletteLab/PaletteLab.tsx) - 탭 구조 적용
- [src/constants/lab-presets.ts](../src/constants/lab-presets.ts) - 비교 목록 업데이트

### 생성 필요
- `src/palettes/presets/registry.ts` - 테마 레지스트리
- `src/palettes/presets/default/` - Default 카테고리 폴더
- `src/palettes/presets/default/index.ts`
- `src/palettes/presets/natural/` - Natural 카테고리 폴더 (빈 상태)
- `src/palettes/presets/natural/index.ts`
- `src/palettes/strategies/default-mappings.ts` - 기본 시맨틱 매핑
- `src/palettes/mapping/resolve.ts` - 매핑 해석 로직
- `src/palettes/mapping/recommendations.ts` - 추천/경고 시스템 로직
- `src/components/ThemeTabNavigation/` - 탭 네비게이션 컴포넌트
- `src/components/ThemeSearchBar/` - 검색 바 컴포넌트
- `src/components/EmptyCategory/` - 빈 카테고리 표시 컴포넌트
- `src/components/ScaleSelectionModal/` - 스케일 선택 모달 (추천 아이콘 포함)

### 삭제 필요
- `src/palettes/presets/vivid.ts`, `pastel.ts`, `monochrome.ts`, `earth.ts` (P02)
- `src/palettes/strategies/light-bg.ts`, `colored-bg.ts`, `dark-bg.ts` (P03, resolve 경로로 통일)

## 참고사항

### 향후 검토 (본 에픽 범위 아님)
- **다크모드/라이트모드 전략**: 별도 에픽으로 검토 예정

### 일반
- **Custom 테마**: 별도 탭으로 유지, 레지스트리에는 포함하지 않음
- **검색 기능**: Debounce 300ms 적용, 이름/설명만 검색
- **빈 카테고리**: Natural은 향후 테마 추가 시 자동으로 표시
- **접근성**: 키보드 네비게이션, ARIA 레이블 필수

### 시맨틱 매핑
- **기본 동작**: `semanticMapping` 필드가 없으면 `bgStrategy`에 따른 기본 매핑 사용
- **부분 오버라이드**: 일부 토큰만 지정하면 나머지는 기본값 사용 (deep merge)
- **검증**: 존재하지 않는 스케일 참조 시 경고 및 fallback
- **저장 방식**:
  - 런타임: 상태로만 유지 (새로고침 시 초기화)
  - 영구: 프리셋 파일에 직접 작성 또는 별도 설정 파일
- **프리뷰**: 매핑 변경 시 실시간으로 DetailPanel의 프리뷰 영역 업데이트

### 성능 최적화
- `resolveSemanticMapping`은 메모이제이션 적용
- 편집 중에는 debounce로 과도한 재계산 방지

## 향후 확장 예시

새로운 테마를 Natural 카테고리에 추가하는 경우:

```typescript
// src/palettes/presets/natural/ocean.ts
export const oceanPalette: PaletteDefinition = {
  name: 'ocean',
  subname: '바다에서 영감을 받은 배색',
  colors: {
    primary: '#0EA5E9',
    secondary: '#06B6D4',
    accent: '#14B8A6',
    neutral: '#64748B',
  },
  bgStrategy: 'light',
  metadata: {
    id: 'ocean',
    displayName: 'Ocean',
    category: 'natural',
    description: '시원하고 차분한 바다 느낌의 배색',
  },
};
```

```typescript
// src/palettes/presets/natural/index.ts
export { oceanPalette } from './ocean';
```

Registry는 자동으로 반영됨 (import 구조 활용).

## 시맨틱 매핑 커스터마이징

### 시나리오: 기본 매핑 사용

```typescript
// src/palettes/presets/default/default.ts
export const defaultPalette: PaletteDefinition = {
  name: 'default',
  subname: '범용 균형잡힌 배색',
  colors: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    accent: '#10B981',
    neutral: '#64748B',
  },
  bgStrategy: 'light',
  // semanticMapping 없음 → light의 기본 매핑 사용
  metadata: {
    id: 'default',
    displayName: 'Default',
    category: 'default',
    description: '범용적으로 사용 가능한 균형 잡힌 배색',
  },
};
```

### 시나리오: 매핑 커스터마이징

```typescript
// src/palettes/presets/natural/ocean.ts
export const oceanPalette: PaletteDefinition = {
  name: 'ocean',
  subname: '바다에서 영감을 받은 배색',
  colors: {
    primary: '#0EA5E9',
    secondary: '#06B6D4',
    accent: '#14B8A6',
    neutral: '#64748B',
  },
  bgStrategy: 'light',
  // 커스텀 매핑: surfaceBrand를 accent 컬러로 변경
  semanticMapping: {
    bg: {
      base: '#FFFFFF',
      surface: { scale: 'neutral', step: 50 },
      surfaceBrand: { scale: 'accent', step: 50 },  // 기본은 primary
      elevated: '#FFFFFF',
      muted: { scale: 'neutral', step: 100 },
    },
    text: {
      primary: { scale: 'neutral', step: 900 },
      secondary: { scale: 'neutral', step: 700 },
      muted: { scale: 'neutral', step: 500 },
      onAction: '#FFFFFF',
    },
    border: {
      default: { scale: 'neutral', step: 300 },
      subtle: { scale: 'neutral', step: 200 },
      accent: { scale: 'secondary', step: 300 },  // 기본은 primary
      focus: { scale: 'primary', step: 500 },
    },
  },
  metadata: {
    id: 'ocean',
    displayName: 'Ocean',
    category: 'natural',
    description: '시원하고 차분한 바다 느낌의 배색',
  },
};
```

### Lab UI: 시맨틱 매핑 에디터

#### 인터랙션 방식
- **ColorUsageDiagram 활용**: 기존 Overview의 시맨틱 컬러 매핑 UI를 재사용
- **클릭 대상**: 시맨틱 토큰 라벨이 아닌, 컬러 스와치/배지 영역 클릭
- **모달 열기**: 클릭 시 컬러 스케일 선택 모달 표시

#### 추천/경고 시스템
- **목적**: 사용자에게 가이드 제공하되, 모든 조합 허용
- **표시 방식**: 스케일 라벨 헤더에 아이콘 배치
  - ✓ (추천): 해당 시맨틱 토큰에 권장되는 스케일
  - ⚠️ (경고): 권장되지 않지만 선택 가능한 스케일
- **아이콘 위치**: 헤더 라벨 영역에 고정 위치 할당 (UI 깨짐 방지)
- **툴팁**: 아이콘 호버 시 추천/경고 이유 설명

#### 추천 로직 예시
```typescript
// src/palettes/mapping/recommendations.ts

export type RecommendationLevel = 'recommended' | 'warning' | 'neutral';

export interface ScaleRecommendation {
  level: RecommendationLevel;
  message: string;
}

/**
 * 시맨틱 토큰에 대한 스케일 추천 여부 판단
 */
export function getScaleRecommendation(
  semanticToken: string,  // 예: 'bg.base', 'text.primary'
  scale: 'primary' | 'secondary' | 'accent' | 'neutral' | 'sub',
  step: number,
  bgStrategy: BgStrategy
): ScaleRecommendation {
  // 배경 토큰
  if (semanticToken.startsWith('bg.')) {
    if (scale === 'neutral') {
      return {
        level: 'recommended',
        message: 'Neutral 스케일은 배경 토큰에 가장 적합합니다.',
      };
    }
    if (scale === 'primary' || scale === 'accent') {
      return {
        level: 'warning',
        message: '브랜드 컬러를 배경에 사용하면 과도한 강조가 될 수 있습니다.',
      };
    }
  }

  // 텍스트 토큰
  if (semanticToken.startsWith('text.')) {
    if (scale === 'neutral') {
      return {
        level: 'recommended',
        message: 'Neutral 스케일은 텍스트 색상에 가장 적합합니다.',
      };
    }
    if (scale === 'accent') {
      return {
        level: 'warning',
        message: 'Accent 컬러를 텍스트에 사용하면 가독성이 저하될 수 있습니다.',
      };
    }
  }

  // 테두리 토큰
  if (semanticToken.startsWith('border.')) {
    if (semanticToken === 'border.accent' || semanticToken === 'border.focus') {
      if (scale === 'primary' || scale === 'accent') {
        return {
          level: 'recommended',
          message: '강조 테두리에는 브랜드 컬러가 적합합니다.',
        };
      }
    }
    if (scale === 'neutral') {
      return {
        level: 'recommended',
        message: 'Neutral 스케일은 기본 테두리에 적합합니다.',
      };
    }
  }

  return {
    level: 'neutral',
    message: '',
  };
}
```

#### UI 구조

```
[ColorUsageDiagram - 인터랙티브]
├── Background Section
│   ├── bg.base: [#FFFFFF 배지] ← 클릭
│   ├── bg.surface: [#F8FAFC 배지] ← 클릭
│   └── ...
├── Text Section
│   ├── text.primary: [#0F172A 배지] ← 클릭
│   └── ...
└── Border Section
    └── ...

[클릭 시 → 스케일 선택 모달]
┌─────────────────────────────────────┐
│ Select Color Scale for bg.surface   │
├─────────────────────────────────────┤
│ ✓ Neutral (권장)               [>]  │  ← 추천 아이콘 고정 위치
│   - 50, 100, 200, ..., 900          │
│                                      │
│ ⚠️ Primary                      [>]  │  ← 경고 아이콘 고정 위치
│   - 50, 100, 200, ..., 900          │
│                                      │
│   Secondary                     [>]  │  ← 아이콘 없음 (neutral)
│   - 50, 100, 200, ..., 900          │
│                                      │
│ ⚠️ Accent                       [>]  │
│   - 50, 100, 200, ..., 900          │
│                                      │
│   Sub                           [>]  │
│   - 50, 100, 200, ..., 900          │
│                                      │
│ [Direct Color Input: #______]        │
└─────────────────────────────────────┘
```

#### 아이콘 레이아웃
```css
.scale-header {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 32px; /* UI 깨짐 방지 */
}

.scale-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0; /* 고정 크기 유지 */
  opacity: 0; /* 기본 숨김 */
}

.scale-icon.visible {
  opacity: 1; /* 추천/경고 시에만 표시 */
}

.scale-name {
  flex: 1;
}
```

```
[DetailPanel]
└── 시맨틱 매핑 섹션
    ├── [Reset to Default] 버튼
    ├── ColorUsageDiagram (인터랙티브 모드)
    │   └── 각 토큰의 컬러 배지 클릭 가능
    └── [실시간 프리뷰]
        └── 변경된 매핑으로 렌더링된 UI 샘플
```

### 편집 워크플로우

1. **프리셋 선택**: Default 또는 Natural 탭에서 테마 카드 클릭
2. **DetailPanel 열림**: 기본 정보 + 시맨틱 매핑 섹션 표시 (ColorUsageDiagram 인터랙티브 모드)
3. **매핑 조정**:
   - ColorUsageDiagram에서 컬러 배지 클릭
   - 스케일 선택 모달 열림
   - 추천(✓)/경고(⚠️) 아이콘으로 가이드 확인
   - 스케일 선택 후 Step 선택 (50~900)
   - 또는 "Direct Color Input"으로 HEX 색상 직접 입력
4. **실시간 반영**: 프리뷰 영역에서 변경 사항 확인
5. **저장**: 매핑이 프리셋 정의에 반영됨 (런타임 또는 파일 수정)

### 기술적 고려사항

#### 1. 부분 오버라이드 지원
사용자가 특정 토큰만 변경하고 싶을 때:

```typescript
// 부분 매핑만 제공 → 나머지는 기본 매핑 사용
semanticMapping: {
  bg: {
    surfaceBrand: { scale: 'accent', step: 50 },
    // 나머지는 기본 매핑에서 가져옴
  }
}
```

이를 위해 merge 로직 필요. **lodash 미사용.** `deepmerge` 패키지 또는 1~2 depth용 직접 구현 사용:

```typescript
// src/palettes/mapping/resolve.ts
// import { deepmerge } from 'deepmerge'; // 또는 직접 구현

export function getMergedMapping(
  customMapping: Partial<SemanticMapping> | undefined,
  bgStrategy: BgStrategy
): SemanticMapping {
  const defaultMapping = defaultSemanticMappings[bgStrategy];
  return customMapping
    ? deepMerge(defaultMapping, customMapping)
    : defaultMapping;
}
```

#### 2. 타입 안전성
편집 UI에서 잘못된 값 입력 방지:
- Scale 드롭다운: 타입으로 제한
- Step 드롭다운: 유효한 값만 (50, 100, ..., 900)
- HEX 입력: 정규식 검증

#### 3. 검증 및 경고
- 선택한 스케일이 프리셋에 없는 경우 경고
- 색상 대비 부족 시 경고 (접근성)

---

**작성일**: 2026-03-01
**작성자**: Developer
**우선순위**: High
**예상 기간**: 1-2 weeks
