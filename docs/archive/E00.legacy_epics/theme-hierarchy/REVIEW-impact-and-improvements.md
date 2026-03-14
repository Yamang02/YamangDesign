# REVIEW: 영향도 검토 및 개선사항

본 문서는 EPIC-THEME-HIERARCHY 에픽에 대한 리뷰 결과를 담습니다. 누락된 영향도와 중요한 개선사항을 정리했습니다.

---

## 1. 누락된 영향도

### 1.1 코드베이스 영향 (추가 검토 필요)

| 대상 | 경로 | 영향 내용 | 대응 |
|------|------|----------|------|
| **LabOverview.module.css** | `layouts/LabLayout/` | monochrome 제거됨. 주석을 default/브랜드 기준으로 수정 | P02: monochrome 관련 주석 제거, default 또는 브랜드 기반으로 수정 ✅ |
| **usePalettePresets** | `hooks/usePalettePresets.ts` | `colorStartPoints` 사용 (palette-definitions). themePresets 직접 사용 여부 확인 | colorStartPoints는 유지되므로 영향 없음. themePresets 구조 변경 시 호환성 확인 |
| **lab-content.ts** | `constants/lab-content.ts` | PaletteLab custom 초기화. themePresets와 간접 연관 | default만 남으면 custom 초기값 로직 유지 가능. 별도 수정 불필요 |
| **themes/combine.ts** | `themes/` | combineTheme(paletteDef, styleDef). createPalette 호출 여부 | combineTheme 내부 구조 확인. paletteDef → createPalette 경로가 있다면 P03 변경 영향 |
| **ThemeProvider** | `themes/ThemeProvider.tsx` | palette 적용, createPalette/combineTheme 사용 | createPalette 시맨틱 경로 변경 시 ThemeProvider 동작 검증 필요 |
| **Playground** | `pages/` | getThemeVariables, getPaletteVariables | palettePresets = themePresets이므로 default만 남으면 자동 반영 |

### 1.2 타입/Export 영향

| 대상 | 영향 |
|------|------|
| **PaletteName** | `vivid`|`pastel`|`monochrome`|`earth` 제거 시 `Record<PaletteName, ...>` 사용처 타입 에러 발생 가능 |
| **@types/theme.d.ts** | `PaletteName` re-export. palettes/types.ts SOT 변경 시 자동 반영 |
| **themePresets 타입** | `Record<Exclude<PaletteName, 'custom'>, PaletteDefinition>` → default만 남으면 `Record<'default', ...>` 등으로 단순화 가능 |

### 1.3 Registry 구조 영향

- **themeRegistry**가 `* as defaultThemes`로 `presets/default`를 import할 경우, `default/index.ts`에서 `defaultPalette`를 export해야 함.
- `natural/index.ts`는 빈 export `{}` 또는 `export {}`로 두면 `themes: []`로 처리 가능.
- 원본 에픽의 registry 예시에서는 `Object.values(defaultThemes)` 사용 → default 폴더에 여러 테마가 있으면 모두 포함. 현재는 default 1개만이므로 `[defaultPalette]` 형태로 명시해도 무방.

### 1.4 strategy 파일과 default-mappings 관계

| 파일 | 역할 | P03 이후 |
|------|------|----------|
| `light-bg.ts`, `colored-bg.ts`, `dark-bg.ts` | scales → SemanticColors 변환 | **제거.** default-mappings + resolve로 통일 |
| **채택** | strategy 제거. createPalette는 항상 getMergedMapping → resolveSemanticMapping 경로만 사용 | 단일 코드 경로 |

**향후 검토:** 다크모드/라이트모드 전략은 별도 에픽으로 고려 예정 (현재 범위 아님)

---

## 2. 중요한 개선사항

### 2.1 P02: 중복 체크리스트 ✅ 반영

P02-migration.md에서 제거 대상 프리셋 1회씩만 명시. Default만 유지, vivid/pastel/monochrome/earth 전부 제거.

### 2.2 P03: strategy 제거, resolve 경로로 통일 ✅ 채택

- `createPalette`는 항상 `getMergedMapping(definition.semanticMapping, definition.bgStrategy)` → `resolveSemanticMapping` 경로만 사용.
- strategy 파일(light-bg, colored-bg, dark-bg) 제거. default-mappings가 SOT.

### 2.3 P03: merge 구현 ✅ 채택

- **lodash 미사용.** lodash 전체 번들 부담을 피함.
- **추천**: `deepmerge` 패키지 또는 1~2 depth용 직접 구현(shallowMerge 등).

### 2.4 mapping/editor.ts ✅ 채택

- **별도 editor.ts 없음.** ColorUsageDiagram + ScaleSelectionModal 내부 로직으로 처리.

### 2.5 Custom 카테고리 처리

- Custom은 레지스트리에 포함하지 않고, 별도 탭으로만 표시.
- `ThemeGroup`에 custom 그룹을 넣지 않는 것이 원본 의도와 일치.

### 2.6 부분 오버라이드(Partial Override)

- `getMergedMapping(custom, bgStrategy)` 구현 시, `custom`이 `Partial<SemanticMapping>`인 경우 nested 객체 병합 필요.
- 예: `bg.surfaceBrand`만 오버라이드하면 `bg.base`, `bg.surface` 등은 default 유지.

### 2.7 접근성 및 성능

- **Debounce 300ms**: ThemeSearchBar에 명시됨. ✅
- **메모이제이션**: resolveSemanticMapping에 권장됨. ✅
- **접근성**: 키보드 네비게이션, ARIA 레이블 필수로 명시됨. ✅

### 2.8 GlobalSettingsModal 프리셋 선택 UI ✅ 채택

- default만 있을 때: 현재 구조 유지, Default 1개만 표시.
- 향후 Natural 테마 추가 시: themeRegistry 기반으로 옵션 동적 생성.

---

## 3. 페이즈 간 의존성 다이어그램

```
P01 (기반) ─┬─► P02 (마이그레이션) ─┬─► P03 (시맨틱 매핑) ─► P04 (UI 컴포넌트) ─► P05 (통합) ─► P06 (테스트)
            │                       │
            └───────────────────────┴── P02 완료 후 P03, P04 병렬 가능
```

- P01 → P02: 필수
- P02 → P03: 필수 (palette 구조 확정 후 매핑)
- P02 → P04: 부분적 (Registry, 탭 컴포넌트는 P01 완료 시점부터 가능)
- P03 → P04: ScaleSelectionModal, recommendations는 P03 타입/로직 필요
- P04 → P05: 필수

---

## 4. 추가 권장사항

1. **E2E 또는 통합 테스트**: PaletteLab에서 preset 선택, Custom 색상 변경, 탭 전환 시나리오 자동화 검토.
2. **Storybook**: ThemeTabNavigation, ScaleSelectionModal 등 새 컴포넌트 스토리 추가.
3. **Changelog**: 프리셋 제거(vivid, pastel 등)를 Breaking Change로 문서화.

---

**리뷰 완료일**: 2026-03-01
