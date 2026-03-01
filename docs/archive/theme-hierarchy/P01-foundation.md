# P01: 기반 구조 변경

## 개요

타입 정의 업데이트, 디렉토리 구조 생성, Registry 구현을 통해 카테고리 기반 테마 시스템의 기반을 마련합니다.

## 작업 항목

### 1. 타입 정의 업데이트

**파일:** `src/palettes/types.ts`

- [x] `PaletteDefinition`에 선택적 `metadata` 필드 추가
- [ ] `ThemeCategory` 타입 정의 (`'default' | 'custom' | 'natural'`)
- [ ] `ThemeMetadata` 인터페이스 정의
- [ ] (선택) `SemanticMapping`, `ScaleReference` 타입 추가 (P03에서 사용)

```typescript
export type ThemeCategory =
  | 'default'
  | 'custom'
  | 'natural';

export interface ThemeMetadata {
  id: string;
  displayName: string;
  category: ThemeCategory;
  description?: string;
}

// PaletteDefinition에 추가
metadata?: ThemeMetadata;
```

### 2. 디렉토리 구조 생성

- [x] `src/palettes/presets/default/` 폴더 생성
- [x] `src/palettes/presets/natural/` 폴더 생성

### 3. Registry 구현

**파일:** `src/palettes/presets/registry.ts` (신규)

- [x] `ThemeGroup` 인터페이스
- [x] `themeRegistry` 배열
- [x] `findThemeById(id: string)`
- [x] `getThemesByCategory(category: ThemeCategory)`
- [x] `searchThemesByName(query: string)`
- [x] `getAllThemes()`

### 4. 영향 범위

| 파일 | 변경 내용 |
|------|----------|
| `palettes/types.ts` | ThemeCategory, ThemeMetadata, metadata 필드 |
| `@types/theme.d.ts` | PaletteName 재export 유지 (P02에서 축소 예정) |

## 의존성

- 선행: 없음
- 후행: P02 (프리셋 마이그레이션)
