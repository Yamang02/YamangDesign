# 타입 시스템 문제점 분석

**우선순위: P1 (높은 영향도, 낮은 작업량)**

---

## 문제 1: PaletteName 3중 정의

`PaletteName` 타입이 3개의 다른 파일에서 서로 다르게 정의되어 있습니다.

### 현재 상태

#### 위치 1: `src/palettes/types.ts` (라인 9)

```typescript
/** 배색 프리셋 이름 - theme-presets에서 유도됨, palettes에서는 string 사용 */
export type PaletteName = string;
```

**문제**: 너무 느슨한 타입. 어떤 문자열이든 허용됨.

#### 위치 2: `src/constants/theme-presets.ts` (라인 23-29)

```typescript
/** Lab/Playground 등에서 사용하는 프리셋 팔레트 이름 */
export type PresetPaletteName = keyof typeof themePresets;

/** 시맨틱 매핑 커스텀 프리셋 ID (베이스 참조 + 오버라이드) */
export type CustomSemanticPaletteId = `custom-semantic:${string}`;

/** 사용자 정의 포함 전체 팔레트 이름 */
export type PaletteName = PresetPaletteName | 'custom' | CustomSemanticPaletteId;
```

**문제**: 정확한 Union 타입이지만, `palettes/types.ts`와 충돌.

#### 위치 3: `src/@types/theme.d.ts` (라인 10)

```typescript
export type { PaletteName } from '../constants/theme-presets';
```

**문제**: Re-export만 수행. 어떤 타입이 사용되는지 코드에서 명확하지 않음.

### 영향

1. **타입 안전성 저하**: `palettes/types.ts`를 import하면 어떤 문자열도 허용
2. **IDE 자동완성 불가**: `string` 타입은 자동완성 지원 안 됨
3. **런타임 오류 위험**: 잘못된 팔레트 이름이 컴파일 단계에서 잡히지 않음

### 코드 예시: 문제 발생 패턴

```typescript
// palettes/types.ts에서 import 시
import type { PaletteDefinition } from '../palettes/types';

const def: PaletteDefinition = {
  name: 'anyRandomString',  // 컴파일 오류 없음 (string 타입)
  // ...
};

// theme-presets.ts에서 import 시
import type { PaletteName } from '../constants/theme-presets';

const name: PaletteName = 'anyRandomString';  // 컴파일 오류 발생
```

---

## 문제 2: ThemeCategory 분산 정의

`ThemeCategory` 타입이 여러 곳에서 정의되어 있습니다.

### 현재 상태

#### `src/palettes/types.ts` (라인 14-18)

```typescript
export type ThemeCategory =
  | 'default'
  | 'custom'
  | 'natural';
```

#### `src/pages/layouts/PaletteLab/PaletteCategoryTabs.tsx` (라인 6)

```typescript
export type BrandColorTabId = 'default' | 'natural' | 'custom';
```

### 영향

- 동일한 개념이 다른 이름으로 존재 (`ThemeCategory` vs `BrandColorTabId`)
- 값의 순서만 다름 (`custom`이 마지막 vs 첫 번째)
- 유지보수 시 양쪽 동기화 필요

---

## 해결 방안

### 방안 1: 단일 소스 유지 (권장)

```typescript
// src/constants/theme-presets.ts (유지)
export type PresetPaletteName = keyof typeof themePresets;
export type CustomSemanticPaletteId = `custom-semantic:${string}`;
export type PaletteName = PresetPaletteName | 'custom' | CustomSemanticPaletteId;

// src/palettes/types.ts (수정)
// PaletteName 정의 제거, 대신 import
import type { PaletteName } from '../constants/theme-presets';

// 또는 PaletteDefinition에서 name 타입을 string으로 유지하되
// 별도 타입 가드 함수 활용
```

### 방안 2: 타입 계층 분리

```typescript
// 내부용 느슨한 타입
type InternalPaletteName = string;

// 외부 API용 엄격한 타입
type PaletteName = PresetPaletteName | 'custom' | CustomSemanticPaletteId;

// PaletteDefinition은 내부용 사용
interface PaletteDefinition {
  name: InternalPaletteName;
  // ...
}

// ThemeProvider는 외부 API용 사용
const [paletteName, setPaletteName] = useState<PaletteName>('default');
```

---

## 리팩토링 단계

### Step 1: 영향 범위 파악

```bash
# PaletteName import 위치 확인
grep -r "import.*PaletteName" src/
grep -r "type.*PaletteName" src/
```

### Step 2: palettes/types.ts 수정

```diff
- /** 배색 프리셋 이름 - theme-presets에서 유도됨, palettes에서는 string 사용 */
- export type PaletteName = string;
+ // PaletteName은 constants/theme-presets.ts에서 정의
+ // 이 파일에서는 PaletteDefinition.name을 string으로 유지 (내부 유연성)
```

### Step 3: PaletteDefinition.name 타입 검토

현재 `PaletteDefinition.name`이 `PaletteName` 타입을 사용하는데, 이를 `string`으로 유지할지 검토:

```typescript
// 옵션 A: string 유지 (내부 유연성)
interface PaletteDefinition {
  name: string;  // 내부적으로 자유롭게 사용
  // ...
}

// 옵션 B: 엄격한 타입 사용
interface PaletteDefinition {
  name: PaletteName;  // theme-presets에서 import
  // ...
}
```

**권장**: 옵션 A (기존 동작 유지, `PaletteName` export만 제거)

### Step 4: ThemeCategory 통합

```diff
// src/palettes/types.ts
+ /** 테마 카테고리 (프리셋 분류) */
+ export type ThemeCategory = 'default' | 'natural' | 'custom';

// src/pages/layouts/PaletteLab/PaletteCategoryTabs.tsx
- export type BrandColorTabId = 'default' | 'natural' | 'custom';
+ import type { ThemeCategory } from '../../../palettes/types';
+ export type BrandColorTabId = ThemeCategory;  // alias 유지
```

### Step 5: 컴파일 검증

```bash
npx tsc --noEmit
```

---

## 체크리스트

- [ ] `palettes/types.ts`에서 `PaletteName` export 제거
- [ ] 영향받는 import 문 업데이트
- [ ] `BrandColorTabId`를 `ThemeCategory` alias로 변경
- [ ] TypeScript 컴파일 오류 없음 확인
- [ ] 기존 기능 동작 확인
