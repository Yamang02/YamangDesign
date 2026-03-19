# 기본값 정책 (Default Value Policy)

디자인 시스템에서 **기본값이 쓰이는 지점**을 한 문서로 정리한다. 코드는 기존 위치를 유지하며, 이 문서는 “기본값은 여기 참고”용이다. (E09 P08 7.5)

---

## 1. 팔레트 색상 파생 — `resolvePalette`

**위치**: `src/utils/palette.ts`

외부에서 주어진 `ExternalPalette`(primary 등 일부만 있을 수 있음)를 **완전한 5색**으로 채우는 규칙.

| 필드 | 필수 | 없을 때 파생 규칙 | 비고 |
|------|------|-------------------|------|
| `primary` | ✅ | — | 없으면 런타임 오류 가능, 호출부에서 보장 |
| `secondary` | | `deriveSecondary(primary)` = primary 기준 색상환 +30° | 유사색 |
| `accent` | | `deriveAccent(primary)` = primary 기준 +180° (보색) | 대비 강조 |
| `neutral` | | `neutral ?? sub ?? deriveNeutral(primary)` | sub 우선, 없으면 primary 기반 저채도·밝게 |
| `sub` | | `sub ?? deriveSub(primary)` | primary 기반 연한 보조색 |

- **deriveNeutral(primary)**: `desaturate(lighten(primary, 40), 70)` — 텍스트/테두리/배경용.
- **deriveSub(primary)**: `lighten(primary, 40)` — 컬러풀 보조색.

빌트인 프리셋은 **5색 전부 명시**하는 것을 권장하며, 사용자 입력·가져오기 등에는 optional + 위 파생 규칙이 적용된다.

---

## 2. 시맨틱 매핑 — bgStrategy별 기본값

**위치**: `src/domain/palettes/strategies/default-mappings.ts`

`PaletteDefinition`에 `semanticMapping`이 없거나 **일부만** 있을 때, **베이스**로 쓰이는 매핑.

| BgStrategy | 용도 | 요약 |
|------------|------|------|
| `light` | 밝은 배경 (Minimal) | bg.base = #FFFFFF, surface/surfaceBrand/elevated/muted, text/border/action/feedback 스케일 참조 |
| `colored` | 컬러 배경 (Neumorphism) | bg.base = neutral 100, elevated = #FFFFFF, 나머지 neutral/primary 스케일 기반 |
| `dark` | 어두운 배경 (다크모드) | bg.base = neutral 900, text primary = neutral 50, action 스텝 400~600 등 |

- **병합**: `getMergedMapping(defaultSemanticMappings[definition.bgStrategy], definition.semanticMapping)`  
  → 프리셋에 `semanticMapping`이 없으면 **전부 bgStrategy 기본값**; 일부만 오버라이드하면 해당 경로만 덮어쓰고 나머지는 기본값 유지.
- **사용처**: `domain/palettes/index.ts` `createPalette()`, `ThemeProvider`, `PaletteLab`, `SemanticTab` 등.

---

## 3. StoredSettings(전역 설정) 초기값

**위치**: `src/components/GlobalSettings/types.ts`, `src/App.tsx`, `src/themes/ThemeProvider.tsx`, `src/components/GlobalSettings/hooks/useGlobalSettings.ts`

저장된 값이 없거나, v1 마이그레이션 후 누락된 필드에 쓰이는 기본값.

| 필드 | 기본값 | 적용 시점 / 비고 |
|------|--------|------------------|
| `version` | `'2.0'` | v2 저장/마이그레이션 |
| `palette` | (아래 defaultPalette) | App `defaultPalette`, 마이그레이션 시 palette-selection 해석 결과 |
| `palettePresetId` | 저장 안 함 (undefined) | P08: 저장 정책에서 제거 |
| `semanticMapping` | `null` | v1→v2 마이그레이션, 초기화, 적용 시 병합 시 `?? null` |
| `styleName` | `'minimal'` | `normalizeStyleName`(비유효 시), App/ThemeProvider `?? 'minimal'`, 초기화 버튼 |
| `systemPreset` | `'default'` | App/ThemeProvider `?? 'default'`, 초기화 버튼 |
| `updatedAt` | `new Date().toISOString()` | v1→v2, 저장 시 |

**App 기본 팔레트** (`App.tsx`):

```ts
const defaultPalette = {
  primary: '#6366F1',
  secondary: '#8B5CF6',
  accent: '#F59E0B',
  neutral: '#E5E7EB',
} as const;
```

- `sub` 없음 → 런타임에 `resolvePalette` 시 `deriveSub(primary)`로 채워짐.
- **styleName**: 로드 직후 `normalizeStoredSettings` / `migrateV1ToV2`에서 비유효 시 `'minimal'`로 보정(P08).

---

## 4. 유효 값 열거

- **StyleName**: `'minimal' | 'neumorphism' | 'brutalism' | 'glassmorphism'` (`@types/theme.d.ts`, `types.ts` VALID_STYLE_NAMES).
- **SystemPresetName**: `'default' | 'muted'`.
- **BgStrategy**: `'light' | 'colored' | 'dark'` (`domain/palettes/types.ts`).

---

## 5. 참고 경로 요약

| 목적 | 파일 |
|------|------|
| 팔레트 파생 규칙 | `src/utils/palette.ts` — `resolvePalette`, `derive*` |
| bgStrategy 기본 시맨틱 | `src/domain/palettes/strategies/default-mappings.ts` — `defaultSemanticMappings` |
| StoredSettings 타입·마이그레이션·보정 | `src/components/GlobalSettings/types.ts` — `migrateV1ToV2`, `normalizeStoredSettings` |
| App/테마 초기값 | `src/App.tsx` — `defaultPalette`, `initialSettings` / ThemeProvider props |
| 초기화 시 로컬 기본값 | `src/components/GlobalSettings/hooks/useGlobalSettings.ts` — reset 시 styleName/systemPreset 등 |

실제 기본값 로직은 위 경로의 코드를 따른다.
