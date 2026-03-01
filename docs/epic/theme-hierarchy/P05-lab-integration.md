# P05: PaletteLab 통합

## 개요

P04에서 구현한 컴포넌트를 PaletteLab에 통합하고, 탭/검색/시맨틱 매핑 편집 UI를 완성합니다.

## 작업 항목

### 1. PaletteLab 레이아웃 변경

- [ ] ThemeTabNavigation 통합
- [ ] Custom 탭을 기본 선택으로 설정

### 2. 카테고리별 렌더링

- [ ] Default 카테고리: default 테마만 표시
- [ ] Natural 카테고리: EmptyCategory 표시
- [ ] Custom 탭: 기존 직접 색상 입력 UI

### 3. 검색 기능 통합

- [ ] ThemeSearchBar 연동
- [ ] 검색어 입력 시 테마 필터링
- [ ] 결과 없는 탭 비활성화 또는 숨김

### 4. 시맨틱 매핑 편집 UI

- [ ] DetailPanel에 "Semantic Mapping" 섹션 추가
- [ ] ColorUsageDiagram를 인터랙티브 모드로 통합
- [ ] ScaleSelectionModal 연동
- [ ] 추천/경고 아이콘 및 툴팁 표시
- [ ] 실시간 프리뷰
- [ ] "Reset to Default" 버튼

### 5. 상태 관리

- [ ] 선택된 탭 상태
- [ ] 검색어 상태
- [ ] 편집 중인 매핑 상태 (런타임)

### 6. 저장 방식

- **런타임**: 상태로만 유지, 새로고침 시 초기화
- **영구**: 프리셋 파일 수정 또는 별도 설정 파일 (향후)

## 의존성

- 선행: P01~P04
- 후행: P06
