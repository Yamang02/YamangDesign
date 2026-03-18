# P07: UI 레이아웃 수정

## 목표
Context 페이지 Overview 다중열 정렬 복원, 디자인 설정 컨트롤 위치 이동,
컴포넌트 매핑 Live Preview 제거.

## 구현 상세

### 1. Context Overview 다중열 정렬 수정

**원인:** `.sectionContent { display: flex; flex-wrap: wrap; }` 안에서
inventoryGrid가 flex item으로 동작하므로, `width: 100%`가 없으면
auto-fill 그리드가 컨테이너 너비를 계산할 수 없어 1열로 고정됨.

**변경:** ShellContext.module.css, ServiceContext.module.css의 `.inventoryGrid`에 `width: 100%` 추가.

### 2. 디자인 설정 컨트롤 패널 위치 이동

**현재:** 타이틀과 같은 행(flex row)에 Export/Import/Reset/Apply 버튼 배치.
**변경:** `.labHeaderRow`를 `flex-direction: column`으로 변경하여 타이틀 아래 별도 행에 표시.

**변경:** LabLayout.module.css `.labHeaderRow`

### 3. 컴포넌트 매핑 Live Preview 제거

ComponentInspector와 역할 중복. 토큰 테이블이 넓어지고 레이아웃 단순화.

**변경:**
- ComponentMappingTab.tsx: Live Preview div 제거
- DesignSettingsLab.module.css: `componentMappingRoot` 2열로 축소, preview 관련 CSS 제거

**변경 파일:**
- `src/app/pages/context/Shell/ShellContext.module.css`
- `src/app/pages/context/Service/ServiceContext.module.css`
- `src/app/layouts/LabLayout/LabLayout.module.css`
- `src/app/pages/labs/DesignSettingsLab/ComponentMappingTab.tsx`
- `src/app/pages/labs/DesignSettingsLab/DesignSettingsLab.module.css`

## 체크리스트
- [x] ShellContext.module.css: inventoryGrid에 width: 100% 추가
- [x] ServiceContext.module.css: inventoryGrid에 width: 100% 추가
- [x] LabLayout.module.css: labHeaderRow flex-direction: column 변경
- [x] ComponentMappingTab.tsx: Live Preview div 및 관련 dead code 제거
- [x] DesignSettingsLab.module.css: componentMappingRoot 2열, preview CSS 제거
