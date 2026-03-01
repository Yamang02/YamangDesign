# 새 프리셋 추가 방법

이 문서는 테마 카테고리 시스템(P01~P05) 이후 새 프리셋을 추가하는 방법을 설명합니다.

## 구조 개요

- **themeRegistry** (`src/palettes/presets/registry.ts`): 카테고리별 테마 목록
- **palette-definitions** (`src/constants/palette-definitions.ts`): ColorPicker/Lab용 SOT(단일 소스)
- **PaletteDefinition** (`src/palettes/types.ts`): 프리셋 타입

## 기존 카테고리에 프리셋 추가

### 1. 프리셋 파일 생성

`src/palettes/presets/{category}/` 폴더에 새 파일 추가. 예: `natural/forest.ts`

```typescript
// src/palettes/presets/natural/forest.ts
import type { PaletteDefinition } from '../../types';

export const forestPalette: PaletteDefinition = {
  name: 'forest',
  subname: '숲에서 영감을 받은 그린 톤',
  colors: {
    primary: '#2D5A27',
    secondary: '#3D7A37',
    accent: '#1D4A17',
    sub: '#8FBC8F',
    neutral: '#556B2F',
  },
  bgStrategy: 'light',
  contrast: 'normal',
  metadata: {
    id: 'natural-forest',
    displayName: 'Forest',
    category: 'natural',
    description: '숲의 초록을 담은 자연 테마',
  },
};
```

### 2. 카테고리 index에 export 추가

```typescript
// src/palettes/presets/natural/index.ts
export { forestPalette } from './forest';
```

### 3. registry.ts에 카테고리/테마 등록

`themeRegistry`에서 해당 카테고리의 `themes` 배열에 추가:

```typescript
// registry.ts - natural 카테고리
{
  category: 'natural',
  displayName: 'Natural',
  description: '자연에서 영감을 받은 유기적이고 편안한 테마',
  themes: [forestPalette],  // Object.values(naturalThemes) 등으로 동적으로 로드
}
```

### 4. palette-definitions.ts 업데이트 (Lab/ColorPicker에 노출 시)

Lab 비교 그리드나 ColorPicker Theme Presets에 노출하려면:

```typescript
// src/constants/palette-definitions.ts
import { forestPalette } from '../palettes/presets/natural';

export const themePresets: Record<...> = {
  default: defaultPalette,
  forest: forestPalette,  // 추가
};
```

- `@types/theme.d.ts`의 `PaletteName`에 새 이름 추가 필요

## 새 카테고리 추가

1. `src/palettes/types.ts`의 `ThemeCategory`에 새 값 추가
2. `src/palettes/presets/{category}/` 폴더 생성
3. `registry.ts`의 `themeRegistry`에 새 `ThemeGroup` 추가
4. `GlobalSettingsModal`의 탭/필터가 자동으로 새 카테고리를 인식 (registry 기반)

## 참조

- [P01: 기반 구조 변경](./P01-foundation.md)
- [epic-overview](./epic-overview.md)
