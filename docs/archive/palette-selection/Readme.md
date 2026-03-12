# Epic: PaletteSelection 기반 상태 모델 통합

> **상태: 완료** ✅

## 배경

현재 팔레트 선택 상태가 `paletteName` + `customColors` 두 개의 독립 상태로 분리되어 있어 복잡성이 발생한다.

### 이전 문제점

1. **상태가 둘로 분리**: `paletteName` + `customColors`로 "선택 상태"를 나눠 표현
2. **우선순위 분기에 의존**: resolution 시 `custom-semantic` → `custom` → `preset` 순으로 분기
3. **API가 역할별로 나뉨**: `setPalette` vs `setPaletteName` → 호출부에서 잘못 고르면 버그 (semanticMapping 손실)
4. **의도가 암시적**: 상태 조합을 보고 의도를 추론해야 함

```
이전 흐름:
paletteName: 'custom' + customColors: {...}     → 사용자가 직접 색상 선택
paletteName: 'custom-semantic:xxx' + customColors: null → 커스텀 시맨틱 프리셋
paletteName: 'default-spring' + customColors: null      → 프리셋 선택
```

## 해결책

**의도 기반 단일 선택 타입 `PaletteSelection`**으로 통합:
- 선택 의도를 타입에 명시
- Resolution 로직 단일화
- API 오용 방지
- 확장성 확보

## 구현 결과

### 1. PaletteSelection 타입 (`src/palettes/types.ts`)

```typescript
export type PaletteSelection =
  | { type: 'preset'; presetId: string }
  | { type: 'custom'; colors: ExternalPalette }
  | { type: 'custom-semantic'; presetId: string };
```

### 2. resolveSelection 함수 (`src/hooks/usePaletteResolution.ts`)

```typescript
export function resolveSelection(
  selection: PaletteSelection,
  customSemanticPresets: CustomSemanticPreset[]
): PaletteResolution {
  switch (selection.type) {
    case 'preset': { ... }
    case 'custom': { ... }
    case 'custom-semantic': { ... }
  }
}
```

### 3. 유틸리티 함수 (`src/utils/palette-selection.ts`)

- `PALETTE_SELECTION_STORAGE_KEY` - localStorage 키 (`yamang-palette-selection`)
- `savePaletteSelection()` / `loadPaletteSelection()` - localStorage 연동
- `getDefaultSelection()` - 기본 선택 반환 (`{ type: 'preset', presetId: 'default' }`)
- `createPresetSelection()` / `createCustomSelection()` / `createCustomSemanticSelection()` - 헬퍼
- `isPaletteSelectionEqual()` - deep equality 비교
- `isValidPaletteSelection()` - 타입 가드

### 4. ThemeProvider 리팩터링

- 단일 상태: `selection: PaletteSelection`
- 새 API: `setPaletteSelection(selection)`
- 하위 호환 API 유지 (deprecated)

## 완료된 작업

### Phase 1: 타입 및 코어 로직

- [x] **P1-1**: `PaletteSelection` 타입 정의 (`src/palettes/types.ts`)
- [x] **P1-2**: `resolveSelection` 함수 구현 (`src/hooks/usePaletteResolution.ts`)
- [x] **P1-3**: localStorage 직렬화/역직렬화 헬퍼 (`src/utils/palette-selection.ts`)

### Phase 2: ThemeProvider 리팩터링

- [x] **P2-1**: `ThemeProvider` 상태를 `PaletteSelection` 기반으로 전환
- [x] **P2-2**: `setPaletteSelection` API 구현
- [x] **P2-3**: 기존 API deprecated 처리 및 래퍼로 유지
- [x] **P2-4**: `ThemeContext` 인터페이스 업데이트

### Phase 3: 소비자 마이그레이션

- [x] **P3-1**: `GlobalSettingsModal` 마이그레이션 (`useGlobalSettings` 훅 포함)
- [x] **P3-2**: `PaletteLab` 마이그레이션
- [x] **P3-3**: `Navigation` 마이그레이션

## 변경된 파일

| 파일 | 변경 내용 |
|-----|---------|
| `src/palettes/types.ts` | `PaletteSelection` 타입, `ThemeCategory` (`pop` 추가) |
| `src/hooks/usePaletteResolution.ts` | `resolveSelection`, `usePaletteSelection` 구현 |
| `src/utils/palette-selection.ts` | **신규** - 유틸리티 함수 |
| `src/themes/ThemeProvider.tsx` | 상태 모델 전환, 새 API 추가 |
| `src/themes/ThemeContext.ts` | 인터페이스 업데이트 |
| `src/components/GlobalSettings/GlobalSettingsModal.tsx` | 새 API 사용 |
| `src/components/GlobalSettings/hooks/useGlobalSettings.ts` | `PaletteSelection` 기반 리팩터링 |
| `src/pages/layouts/PaletteLab/PaletteLab.tsx` | `setPaletteSelection` 사용 |
| `src/pages/layouts/PaletteLab/PaletteCategoryTabs.tsx` | 카테고리 탭 (PaletteLab 일부) |
| `src/pages/layouts/PaletteLab/ThemeTabNavigation.tsx` | 테마 탭 네비게이션 (PaletteLab 일부) |
| `src/pages/layouts/PaletteLab/SemanticMappingModal.tsx` | 시맨틱 매핑 모달 (PaletteLab 일부) |
| `src/components/Navigation/Navigation.tsx` | `setPaletteSelection` 사용 |

## 사용법

```typescript
// 프리셋 선택
setPaletteSelection({ type: 'preset', presetId: 'default-spring-cream' })

// 커스텀 색상 선택
setPaletteSelection({ type: 'custom', colors: { primary: '#6366F1', ... } })

// 커스텀 시맨틱 프리셋 선택
setPaletteSelection({ type: 'custom-semantic', presetId: 'custom-semantic-abc123' })

// 헬퍼 사용
import {
  createPresetSelection,
  createCustomSelection,
  createCustomSemanticSelection,
  getDefaultSelection,
} from '@/utils/palette-selection'

setPaletteSelection(createPresetSelection('default'))
setPaletteSelection(createCustomSelection({ primary: '#6366F1' }))
setPaletteSelection(createCustomSemanticSelection('my-preset-id'))
setPaletteSelection(getDefaultSelection())  // 초기값으로 리셋
```

## 이점

1. **타입 안전성**: 잘못된 조합이 컴파일 타임에 방지됨
2. **의도 명확**: discriminated union으로 선택 의도가 타입에 드러남
3. **로직 집중**: Resolution 로직이 `resolveSelection` 한 곳에 집중
4. **확장성**: 새로운 선택 타입 추가 시 케이스만 추가하면 됨

```typescript
// 미래 확장 예시
type PaletteSelection =
  | { type: 'preset'; presetId: string }
  | { type: 'custom'; colors: ExternalPalette }
  | { type: 'custom-semantic'; presetId: string }
  | { type: 'ai-generated'; prompt: string; colors: ExternalPalette }  // 확장
```

## 하위 호환

기존 API는 deprecated되었지만 래퍼로 유지되어 기존 코드가 작동합니다:
- `setPaletteName()` → 내부적으로 `setPaletteSelection()` 호출
- `setPalette()` → 내부적으로 `setPaletteSelection()` 호출
- `applyCustomSemanticPreset()` → 내부적으로 `setPaletteSelection()` 호출
