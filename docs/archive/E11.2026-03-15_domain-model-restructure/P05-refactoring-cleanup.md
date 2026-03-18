# P05: 리팩토링 & 정리

## 목표

P01~P04를 통해 새 구조가 완성된 상태에서, deprecated API와 데드코드를 제거하고
상태를 단순화하여 코드베이스의 장기 유지보수성을 높인다.

## 구현 상세

### 1. ThemeContext deprecated API 제거

`ThemeContextValue`에 `@deprecated` 주석이 달린 필드들을 제거한다.

제거 대상:
```ts
// ThemeContext.ts에서 제거할 필드
themeName: StyleName;           // → styleName으로 통일
setThemeName: (name) => void;   // → setStyleName으로 통일
paletteName: string;            // → selection.presetId 또는 파생
setPaletteName: (name) => void; // → setPaletteSelection으로 통일
customColors: ExternalPalette | null;  // → selection.type === 'custom' ? selection.colors : null
setCustomColors: (...) => void; // → setPaletteSelection({ type: 'custom', colors })
palette: ExternalPalette;       // → colors (usePaletteSelection 반환값)
setPalette: (...) => void;      // → setPaletteSelection
applyCustomSemanticPreset: ...; // → setPaletteSelection({ type: 'custom-semantic', ... })
```

제거 전 `useTheme()`을 소비하는 모든 컴포넌트에서 deprecated 필드 사용 여부 확인 후 신 API로 교체.

### 2. ThemeProvider 상태 단순화

P01 이후 중복이 생기는 계산 경로 제거:
- `combineTheme()` 호출이 두 곳(상태용 `theme`, CSS 주입용 `buildTokenSet`)에서 각각 `createPalette`를 호출하면 동일 팔레트를 두 번 계산. 내부적으로 `createPalette` 결과를 공유하도록 최적화.
- `definitionForTheme` useMemo 의존성 배열 최소화

### 3. 데드코드 제거

탐색 대상:
- `utils/palette.ts`의 `generateActionColors()` — `combineTheme` 경로 변경 후 미사용 여부 확인
- `src/palettes/mapping/recommendations.ts` — 현재 어디서 사용되는지 확인, 미사용 시 제거
- `themes/presets.ts`의 `toCustomPaletteDefinition()` — `palette-definitions.ts`의 `toThemePreset`과 중복 여부 확인
- `src/constants/palette-definitions.ts` — `themePresets` re-export만 하는 파일인지 확인, 그렇다면 직접 참조로 교체
- `ResolvedPalette` (`@deprecated` alias for `ResolvedColors`) 제거

### 4. import 경로 정리

P02, P03 이후 변경된 경로들의 일관성 점검:
- barrel export(`index.ts`) 파일들이 최신 경로를 올바르게 re-export하는지 확인
- 순환 의존성 발생 여부 확인

### 5. SiteStyle 역할 정리

P03에서 `ThemeProvider` 초기값으로 연결된 후, `siteStyle` 객체의 나머지 필드들 점검:
- `uiDensity`, `guidance`, `layout`, `interaction` — 실제 사용처 있는지 확인
- 사용처 없는 필드는 제거 또는 TODO 주석으로 명시

### 6. 타입 단순화

P01~P04를 거치면서 `Theme` 타입(`@types/theme.d.ts`)의 역할이 축소되었을 수 있다:
- `ThemeColors`, `ThemeShadows` 등 `Theme` 내부 타입이 `ThemeTokenSet` 도입 후 여전히 필요한지 점검
- `ThemeProvider`의 `theme` 상태값이 외부로 노출될 필요가 있는지 재검토

## 체크리스트

- [x] `useTheme()` 소비처 전수 조사 — deprecated 필드 사용 현황 파악
- [x] deprecated 필드 사용처를 신 API로 교체
- [x] `ThemeContextValue`에서 deprecated 필드 제거
- [x] `ThemeProvider`에서 deprecated 필드 구현 코드 제거
- [x] `ThemeProvider` 내 중복 `createPalette` 계산 최적화 (`buildThemeAndTokenSet` 도입)
- [x] `generateActionColors()` 미사용 여부 확인 및 제거
- [x] `recommendations.ts` 미사용 여부 확인 및 처리
- [x] `toCustomPaletteDefinition` / `toThemePreset` 중복 정리
- [x] `palette-definitions.ts` re-export 파일 필요 여부 검토
- [x] `ResolvedPalette` deprecated alias 제거
- [x] barrel export 파일 경로 일관성 점검
- [x] `siteStyle` 미사용 필드 정리
- [x] `Theme` 타입 및 내부 타입 역할 재검토
- [x] TypeScript 컴파일 오류 없음 확인
- [x] 전체 기능 정상 동작 최종 확인

## 사후 발견 (P05 완료 후)

- `utils/palette-selection.ts`가 deprecated re-export 스텁으로만 남아 있어 완전 제거가 필요하다 → **P07에서 처리**
- `constants/`의 페이지별 콘텐츠 상수(`build-content.ts` 등)가 도메인 상수와 혼재 → **P07에서 처리**
