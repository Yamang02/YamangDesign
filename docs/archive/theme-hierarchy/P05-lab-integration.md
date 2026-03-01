# P05: PaletteLab 통합

## 개요

P04에서 구현한 컴포넌트를 통합합니다. **탭/검색/Custom**은 **모달** 내 UI이고, **Lab 페이지**는 Default/Natural 카테고리를 별도 섹션으로 표시합니다.

## 작업 항목

### 1. Lab 페이지 (섹션 구조)

- [x] Overview: ColorUsageDiagram에 기본 팔레트+매핑 연결 (read-only)
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

### 3. 시맨틱 매핑 UI (2026-03-01 수정)

- **DetailPanel 배치 제외**: 복잡도 감소를 위해 DetailPanel 내 Semantic Mapping 섹션은 구현하지 않음
- **Lab Overview**: ColorUsageDiagram read-only 표시
- **편집**: 별도 SemanticMappingModal. 각 sub-theme(Default/Natural) 카드 우측 상단 톱니/튜닝 아이콘 클릭 시 모달 오픈. ColorUsageDiagram interactive + ScaleSelectionModal, Reset to Default 버튼
- [x] 기존 프리셋(Default/Natural) 시맨틱 매핑 편집: 별도 모달, 각 테마 카드 우측 상단 아이콘으로 접근

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

### 4. ColorUsageDiagram 배치 (2026-03-01 수정)

- **Overview 전용**: ColorUsageDiagram은 Lab Overview 섹션에만 배치
- **팔레트 연결**: 기본(Default) 테마 팔레트 + `defaultSemanticMappings[bgStrategy]`를 전달하여 시맨틱 매핑 read-only 표시
- DetailPanel에는 PaletteDetail(기본 색상, 확장 스케일)만 표시

### 5. 시맨틱 매핑 편집 대상

- **Default/Natural 테마**: Lab 카드 아이콘 → SemanticMappingModal. runtime 오버라이드(새로고침 시 초기화)

### 6. ThemeTabNavigation 탭 비활성화

- P04 ThemeTabNavigation에는 `disabled` prop 없음. "결과 없는 탭 비활성화" 구현 시:
  - 옵션 A: ThemeTabNavigation에 `disabledTabs?: ThemeCategory[]` prop 추가
  - 옵션 B: 검색 결과 없을 때 해당 탭 클릭 시 EmptyCategory 표시 (비활성화 대신)

### 7. ColorUsageDiagram / ScaleSelectionModal props

- **read-only 모드**: `palette`, `mapping` 전달 시 scale-step 표시 (neutral-300 등). Overview Lab 연결용
- **interactive 모드**: `palette`, `mapping`, `onMappingChange` 필수. 모달 Custom 탭 등에서 사용 (향후)
- ScaleSelectionModal: ColorUsageDiagram 내부 SemanticMappingTabs에서 연동됨

### 8. Reset to Default

- "Reset to Default" 버튼: 현재 오버라이드 mapping을 제거하고 defaultSemanticMappings[bgStrategy]로 복원
