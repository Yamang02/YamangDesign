# P02: 레이아웃 및 구조 변경

## 목표
서브타이틀 제거, Context 오버뷰 그리드 배치, 프리뷰 영역 레이아웃 개선,
디자인 세팅 페이지의 LabLayout 전환을 통해 전체 앱의 레이아웃 패턴을 통일한다.

## 구현 상세

### 서브타이틀 제거 (6개 페이지)
각 페이지 컴포넌트에서 LabLayout에 전달하는 `subtitle` prop 제거:
- Playground, Atoms, Molecules, Organisms, Service, Shell

**변경 파일:**
- `src/app/pages/labs/Playground/Playground.tsx`
- `src/app/pages/build/Atoms/Atoms.tsx`
- `src/app/pages/build/Molecules.tsx`
- `src/app/pages/build/Organisms.tsx`
- `src/app/pages/context/Service.tsx`
- `src/app/pages/context/Shell.tsx` (또는 ShellContext.tsx)

### Context 오버뷰 가로 그리드
Shell/Service 오버뷰의 컴포넌트 카드를 세로 나열 → 2~3열 반응형 그리드로 변경.
`grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` 적용.

**변경 파일:**
- `src/app/pages/context/Shell/ShellContext.module.css` (또는 .tsx)
- `src/app/pages/context/Service/ServiceContext.module.css` (또는 .tsx)

### Context 라이브 프리뷰 영역 채우기
Shell 프리뷰에서 Header/Footer 사이 빈 공간 해소를 위한 레이아웃 조정.
프리뷰 컨테이너가 콘텐츠에 맞게 적절한 크기를 가지도록 수정.

**변경 파일:**
- `src/app/pages/context/Shell/ShellContext.module.css`
- `src/app/pages/context/Shell/ShellContext.tsx`

### 디자인 세팅 LabLayout 전환
독자적 TabBar 레이아웃 → LabLayout(TOC 사이드바 + 스크롤 섹션)으로 전환:
- 3개 탭(프리셋/시맨틱/컴포넌트 매핑) → 3개 LabSection
- Export/Import/Reset/Apply 버튼은 페이지 상단 고정 영역에 배치
- TOC에 3개 섹션 항목 등록

**변경 파일:**
- `src/app/pages/labs/DesignSettingsLab/index.tsx`
- `src/app/pages/labs/DesignSettingsLab/DesignSettingsLab.module.css`
- 기존 탭 컴포넌트(PresetTab, SemanticTab 등)는 LabSection 내부 콘텐츠로 전환

## 체크리스트
- [x] 6개 페이지에서 subtitle prop 제거
- [x] Shell 오버뷰 컴포넌트 카드 가로 그리드(2~3열) 적용 (이미 적용됨)
- [x] Service 오버뷰 컴포넌트 카드 가로 그리드(2~3열) 적용 (이미 적용됨)
- [x] Shell 라이브 프리뷰 영역 빈 공간 해소 (inner width 100%, 고정 높이)
- [x] Service 라이브 프리뷰 영역 점검 (이미 양호)
- [x] 디자인 세팅 페이지 LabLayout 전환 (3 LabSection + TOC + headerActions)
- [x] 디자인 세팅 액션 버튼(Export/Import/Reset/Apply) LabLayout headerActions로 배치
