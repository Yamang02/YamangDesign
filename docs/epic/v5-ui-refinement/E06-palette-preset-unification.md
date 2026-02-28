# E06: Palette 프리셋 통합

## 문제

**헤더 ColorPicker**와 **PaletteLab**이 서로 다른 프리셋 시스템을 사용

### 현재 구조

```
┌─────────────────────────────────────────────────────────────────┐
│                        두 개의 프리셋 소스                        │
├─────────────────────────────┬───────────────────────────────────┤
│  헤더 ColorPicker           │  PaletteLab                       │
│  (usePalettePresets)        │  (palettePresets)                 │
├─────────────────────────────┼───────────────────────────────────┤
│  • Indigo  { primary }      │  • default  { primary, sub }      │
│  • Emerald { primary }      │  • vivid    { primary, secondary, │
│  • Rose    { primary }      │              accent, sub }        │
│  • Amber   { primary }      │  • pastel   { ... }               │
│  • Cyan    { primary }      │  • monochrome { primary, sub }    │
│            ↓                │  • earth    { ... }               │
│    localStorage 저장        │            ↓                      │
│    사용자 프리셋 추가 가능   │    코드에 고정                     │
└─────────────────────────────┴───────────────────────────────────┘
```

### 관련 파일

| 파일 | 용도 |
|------|------|
| `src/hooks/usePalettePresets.ts` | 헤더 ColorPicker용 - localStorage 기반 |
| `src/themes/presets.ts` | PaletteLab용 - 코드에 고정된 프리셋 |

### 불일치 내용

| 항목 | usePalettePresets | palettePresets |
|------|-------------------|----------------|
| **이름** | Indigo, Emerald, Rose, Amber, Cyan | default, vivid, pastel, monochrome, earth |
| **색상 구조** | `{ primary }` 만 | `{ primary, secondary?, accent?, sub }` |
| **저장** | localStorage | 코드 고정 |
| **사용자 추가** | 가능 | 불가능 |

---

## 목표

1. **단일 프리셋 소스** - 동일한 프리셋 정의를 양쪽에서 사용
2. **일관된 네이밍** - 프리셋 이름 통일
3. **확장성 유지** - 사용자 프리셋 저장 기능 유지

---

## 설계 방안

### Option A: palettePresets를 기준으로 통합

`themes/presets.ts`의 `palettePresets`를 단일 소스로 사용

```typescript
// src/themes/presets.ts (기존)
export const palettePresets = {
  default: { name: 'default', colors: { primary: '#6366F1', sub: '#E5E7EB' }, ... },
  vivid: { ... },
  ...
};

// src/hooks/usePalettePresets.ts (수정)
import { palettePresets } from '../themes/presets';

const defaultPresets: PalettePreset[] = Object.entries(palettePresets).map(
  ([id, def]) => ({
    id: `builtin-${id}`,
    name: def.name,
    palette: def.colors as ExternalPalette,
    createdAt: 0,
    isDefault: true,
  })
);
```

**장점**: 프리셋 정의가 한 곳에만 존재
**단점**: 기존 ColorPicker 프리셋 (Indigo, Emerald 등) 제거됨

### Option B: 두 프리셋 세트 병합

기존 두 세트를 모두 유지하되 카테고리로 구분

```typescript
// src/constants/palette-presets.ts

export const builtinPresets = {
  // 기존 palettePresets (테마용)
  themes: {
    default: { ... },
    vivid: { ... },
    pastel: { ... },
  },
  // 기존 usePalettePresets (단색 베이스)
  colors: {
    indigo: { primary: '#6366F1' },
    emerald: { primary: '#10B981' },
    rose: { primary: '#F43F5E' },
  },
};
```

**장점**: 기존 프리셋 유지, 더 많은 옵션 제공
**단점**: 복잡도 증가

### Option C: 기능별 분리 유지 (권장)

- **PaletteLab**: "테마 프리셋" 비교용 (default, vivid, pastel 등)
- **ColorPicker**: "색상 편집" 시작점 (단색 베이스 + 사용자 저장)

두 기능의 목적이 다르므로 분리 유지하되, **공통 타입과 유틸리티 공유**

```typescript
// src/constants/palette-definitions.ts

import type { PaletteDefinition } from '../palettes';
import type { ExternalPalette } from '../@types/tokens';

/** 테마 프리셋 (PaletteLab용 - 완전한 색상 세트) */
export const themePresets: Record<string, PaletteDefinition> = {
  default: { name: 'default', colors: { primary: '#6366F1', sub: '#E5E7EB' }, bgStrategy: 'light' },
  vivid: { ... },
  pastel: { ... },
  monochrome: { ... },
  earth: { ... },
};

/** 색상 시작점 (ColorPicker용 - 단일 primary) */
export const colorStartPoints: Record<string, ExternalPalette> = {
  indigo: { primary: '#6366F1' },
  emerald: { primary: '#10B981' },
  rose: { primary: '#F43F5E' },
  amber: { primary: '#F59E0B' },
  cyan: { primary: '#06B6D4' },
};

/** ExternalPalette를 PaletteDefinition으로 확장 */
export function toThemePreset(colors: ExternalPalette, name = 'custom'): PaletteDefinition {
  return { name, colors, bgStrategy: 'light' };
}
```

---

## 권장안: Option C + UI 힌트

### 변경 사항

1. **공통 정의 파일 생성**: `src/constants/palette-definitions.ts`
2. **타입 통일**: `PaletteDefinition` ↔ `ExternalPalette` 변환 유틸
3. **UI 개선**: ColorPicker에 "테마 프리셋 불러오기" 옵션 추가

### ColorPicker 개선안

```
┌─────────────────────────────────┐
│  Color Palette                  │
├─────────────────────────────────┤
│  Quick Colors                   │  ← 단색 시작점
│  ● ● ● ● ●                      │
│  Indigo Emerald Rose Amber Cyan │
├─────────────────────────────────┤
│  Theme Presets (NEW)            │  ← 테마 프리셋 불러오기
│  Default | Vivid | Pastel | ... │
├─────────────────────────────────┤
│  Your Presets                   │
│  + Save Current                 │
└─────────────────────────────────┘
```

---

## 체크리스트

- [ ] `src/constants/palette-definitions.ts` 생성
- [ ] `themePresets` 정의 (기존 palettePresets 이동)
- [ ] `colorStartPoints` 정의 (기존 defaultPresets 이동)
- [ ] `usePalettePresets` 수정 - 새 정의 파일 import
- [ ] `themes/presets.ts` 수정 - palette-definitions re-export
- [ ] ColorPicker에 "Theme Presets" 섹션 추가 (선택적)
- [ ] PaletteLab에서 새 정의 사용 확인
