# P02: 용어 리뉴얼

## 목표

혼란스러운 타입/인터페이스 이름을 업계 표준 및 도메인 의미에 맞게 일괄 리네임한다.
런타임 동작 변경 없이 TypeScript 타입 수준의 정비만 수행한다.

## 구현 상세

### 리네임 목록

| 현재 이름 | 변경 후 | 위치 | 이유 |
|---|---|---|---|
| `ExternalPalette` | `ColorInput` | `src/@types/tokens.d.ts` | "External"이 무의미. 입력값임을 명시 |
| `ExpandedPalette` | `ComputedPalette` | `src/palettes/types.ts` | `createPalette()`의 계산 결과물임을 명시 |
| `CustomSemanticPreset` | `CustomThemePreset` | `src/constants/semantic-presets.ts` | "Semantic"만이 아니라 테마 전체 커스텀임 |
| `CUSTOM_SEMANTIC_PRESETS_STORAGE_KEY` | `CUSTOM_THEME_PRESETS_STORAGE_KEY` | 동일 파일 | 일관성 |
| `StoredCustomSemanticPresets` | `StoredCustomThemePresets` | 동일 파일 | 일관성 |
| `PresetPaletteName` | `BuiltinPaletteId` | `src/constants/theme-presets.ts` | "Preset"이 사용자 저장 프리셋과 혼동됨 |
| `ThemeName` | 제거 | `src/@types/theme.d.ts` | `StyleName`으로 이미 대체됨. deprecated 잔재 |

### PaletteDefinition ID 단일화

현재 `PaletteDefinition`에 `name`(내부용)과 `metadata.id`(공식 키) 두 개의 ID가 공존한다.

```ts
// 현재
interface PaletteDefinition {
  name: string;          // 내부 식별자 (레거시)
  metadata?: {
    id: string;          // 공식 키 (registry, themePresets에서 사용)
    displayName: string;
    ...
  }
}

// 변경 후
interface PaletteDefinition {
  /** 고유 ID. registry와 themePresets의 키로 사용 */
  id: string;
  /** 사람이 읽는 표시 이름 */
  displayName?: string;
  /** 팔레트 카테고리 */
  category?: ThemeCategory;
  /** 설명 */
  description?: string;
  // ... 나머지 필드 유지
}
```

- `metadata` 객체를 해체하여 최상위 필드로 플랫화
- `name` 필드 제거 (역할이 `id`와 중복)
- 프리셋 파일들(`default.ts`, `SpringCreamSoda01.ts` 등) 업데이트
- `themePresets` 생성 로직: `t.metadata?.id` → `t.id`
- `findThemeById`, `searchThemesByName` 등 registry 함수 업데이트

### ThemeName 제거

`src/@types/theme.d.ts`에서 `ThemeName` 타입 제거.
참조처 검색 후 `StyleName`으로 교체:
- `ThemeProvider` props의 `initialTheme?: ThemeName` → `initialStyle?: StyleName`
- `ThemeContextValue.themeName: StyleName` → `styleName`으로 통일 (이미 있는 필드)
- `setThemeName` → `setStyleName` (이미 있음)

### useCustomSemanticPresets → useCustomThemePresets

`src/hooks/useCustomSemanticPresets.ts` → `useCustomThemePresets.ts` 리네임.
내부 로직 동일, 스토리지 키는 `CUSTOM_THEME_PRESETS_STORAGE_KEY` 사용.

> **주의**: localStorage 키가 변경되므로 마이그레이션 코드 필요.
> 기존 `yamang-custom-semantic-presets` 키 데이터를 읽어 새 키로 이전하는 one-time 마이그레이션을 `ThemeProvider` mount 시 실행.

## 체크리스트

- [ ] `ExternalPalette` → `ColorInput` 리네임 및 전체 참조 업데이트
- [ ] `ExpandedPalette` → `ComputedPalette` 리네임 및 전체 참조 업데이트
- [ ] `CustomSemanticPreset` → `CustomThemePreset` 리네임 및 전체 참조 업데이트
- [ ] `CUSTOM_SEMANTIC_PRESETS_STORAGE_KEY` → `CUSTOM_THEME_PRESETS_STORAGE_KEY` 변경 + localStorage 마이그레이션 코드 추가
- [ ] `PresetPaletteName` → `BuiltinPaletteId` 리네임 및 전체 참조 업데이트
- [ ] `ThemeName` 타입 제거 및 참조처 `StyleName`으로 교체
- [ ] `PaletteDefinition.metadata` 플랫화 (`id`, `displayName`, `category`, `description` 최상위 필드로)
- [ ] `PaletteDefinition.name` 필드 제거 및 `id`로 통일
- [ ] 프리셋 파일 3개(`default.ts`, `SpringCreamSoda01.ts`, `OrientalChineseRestaurant01.ts`) 업데이트
- [ ] `useCustomSemanticPresets.ts` → `useCustomThemePresets.ts` 리네임
- [ ] TypeScript 컴파일 오류 없음 확인
- [ ] 전체 기능 정상 동작 확인 (팔레트 전환, 커스텀 프리셋 저장/불러오기)
