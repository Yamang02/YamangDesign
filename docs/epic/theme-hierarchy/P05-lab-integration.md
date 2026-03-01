# P05: PaletteLab 통합

## 개요

P04에서 구현한 컴포넌트를 통합합니다. **탭/검색/Custom**은 **모달** 내 UI이고, **Lab 페이지**는 Default/Natural 카테고리를 별도 섹션으로 표시합니다.

## 작업 항목

### 1. Lab 페이지 (섹션 구조)

- [x] Default 섹션: `getThemesByCategory('default')` 테마 카드
- [x] Natural 섹션: `getThemesByCategory('natural')` 또는 EmptyCategory
- [x] Custom 카테고리: Lab 페이지에 미포함 (모달에서만)

### 2. 모달 내 UI (전역 설정 모달 프리셋 섹션)

- [x] ThemeTabNavigation (Custom/Default/Natural) - 전역 설정 모달 내
- [x] ThemeSearchBar - 전역 설정 모달 내
- [x] Custom 탭: 저장된 Custom 프리셋 목록 (userPresets)
- [x] Default 탭: getThemesByCategory('default')
- [x] Natural 탭: getThemesByCategory('natural') 또는 EmptyCategory
- [x] 검색 필터링, 결과 없음 처리

### 3. DetailPanel 시맨틱 매핑

- [x] Lab에서 Default/Natural 테마 클릭 시 Semantic Mapping 섹션 (read-only)
- [ ] 모달에서 Custom 선택 시 인터랙티브 편집, Reset to Default

### 4. 저장 방식

- **런타임**: 상태로만 유지, 새로고침 시 초기화
- **영구**: 프리셋 파일 수정 또는 별도 설정 파일 (향후)

## 의존성

- 선행: P01~P04
- 후행: P06

---

## 특이사항 검토 (2026-03-01)

### 1. Lab vs 모달 구조 (수정 2026-03-01)

- **Lab 페이지**: Default, Natural을 **별도 섹션**으로 표시. Custom 미포함. 탭/검색 없음
- **모달**: 탭(Custom/Default/Natural) + 검색 + Custom 직접 색상 입력. 어디에서 열리는지는 추후 결정 (예: "테마 선택" 버튼, Navigation 등)

### 2. Custom 탭 "직접 색상 입력 UI"

- **ColorPicker** 위치: Navigation(showColorEditor)에 있으며, 헤더 토글로 열림
- **Custom 탭 콘텐츠**: ColorPicker/HexInput 기반 UI를 PaletteLab Custom 탭에 임베드할지, PaletteLab 전용 간소화 입력(primary 등)을 새로 만들지 결정 필요
- **권장**: ColorPicker 또는 toThemePreset/ExternalPalette 기반 입력 컴포넌트를 Custom 탭에 재사용. Navigation ColorPicker와 상태 연동은 useTheme/usePalettePresets로 가능

### 3. themeRegistry vs comparisonPresets

- **themeRegistry**: `getThemesByCategory('default')` → defaultPalette 1개, `getThemesByCategory('natural')` → []
- **comparisonPresets.palettes**: palettePresets keys (현재 default 1개). themeRegistry default와 사실상 동일
- Default 탭: `getThemesByCategory('default')` 사용. 검색은 `searchThemesByName(query)` (metadata.displayName, description)

### 4. DetailPanel 시맨틱 매핑 표시 조건

- **표시 시점**: 팔레트(테마) 선택 시에만 Semantic Mapping 섹션 표시. neutral/system 프리셋 선택 시에는 기존 PaletteDetail/NeutralPresetDetail/SystemPresetDetail만 표시
- **ColorUsageDiagram 위치**: DetailPanel 내부에 "Semantic Mapping" 섹션으로 ColorUsageDiagram(interactive=true) 배치. Overview의 ColorUsageDiagram은 read-only 프리뷰 유지

### 5. 시맨틱 매핑 편집 대상

- **Default 탭 테마 편집**: default는 read-only. 편집 시 "Custom으로 복사" 후 runtime mapping 오버라이드 applied, 또는 편집용 클론 상태로 전환
- **Custom 탭**: 사용자가 만든 palette + semanticMapping 오버라이드를 runtime 상태로 관리
- **저장**: P05 범위는 런타임만. 새로고침 시 초기화

### 6. ThemeTabNavigation 탭 비활성화

- P04 ThemeTabNavigation에는 `disabled` prop 없음. "결과 없는 탭 비활성화" 구현 시:
  - 옵션 A: ThemeTabNavigation에 `disabledTabs?: ThemeCategory[]` prop 추가
  - 옵션 B: 검색 결과 없을 때 해당 탭 클릭 시 EmptyCategory 표시 (비활성화 대신)

### 7. ColorUsageDiagram / ScaleSelectionModal props

- ColorUsageDiagram interactive 모드: `palette`, `mapping`, `onMappingChange` 필수
- mapping은 `getMergedMapping(baseMapping, customOverrides)` 결과. baseMapping = defaultSemanticMappings[bgStrategy], customOverrides = 편집 중인 오버라이드
- ScaleSelectionModal: ColorUsageDiagram 내부 SemanticMappingTabs에서 이미 연동됨. DetailPanel에서 ColorUsageDiagram(interactive) 사용 시 palette/mapping/onMappingChange 전달 필요

### 8. Reset to Default

- "Reset to Default" 버튼: 현재 오버라이드 mapping을 제거하고 defaultSemanticMappings[bgStrategy]로 복원
