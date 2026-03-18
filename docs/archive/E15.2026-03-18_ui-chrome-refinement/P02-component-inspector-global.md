# P02: Component Inspector 전역 플로팅 패널

## 목표

TokenLab에 내장된 Component Inspector가 전역 플로팅 패널로 분리되어,
어느 랩에서든 트리거 버튼으로 열고 닫을 수 있다.

## 구현 상세

**현재 상태:**
- `ComponentInspector`가 `TokenLab.tsx` 내 하나의 섹션으로 렌더링
- TabBar(Button/Input/Card/Badge) + 왼쪽 토큰 테이블 + 오른쪽 ComparisonCard 구조
- 좌우 분리 레이아웃이 확장에 불리하고, 다른 랩에서 접근 불가
- 기존 전역 context: `src/app/context/DesignSettingsNavContext.tsx`

**접근 방법:**
- `src/app/context/InspectorContext.tsx` 신규 생성 (open/close + 선택 컴포넌트 상태)
- `App.tsx`에 `InspectorProvider` 추가
- `ComponentInspector`를 독립 컴포넌트로 분리
- 트리거: TOC sticky 컬럼 하단 아이콘+텍스트 버튼 (`LabToc`에 `footer` 슬롯 추가)
- 패널 위치: `position: fixed`, TOC 바로 오른쪽 (`left: ~200px`), nav 아래~하단 full height
  - 우측 DetailPanel과 반대쪽이라 겹침 없음, 세로 공간 최대 활용
- 패널 내 레이아웃: 2컬럼 (토큰 테이블 + 라이브 프리뷰)
- TokenLab: 기존 ComponentInspector 섹션 제거, TOC 하단 버튼으로 대체

**P04 연계:** LabToc footer 슬롯에 PreviewControlPanel 트리거 버튼도 추가 가능

## 체크리스트

- [x] `InspectorContext.tsx` 생성 및 `App.tsx` Provider 추가
- [x] `ComponentInspectorPanel.tsx` 독립 컴포넌트로 분리
- [x] 플로팅 패널 UI 구현 (좌측 고정 overlay: TOC 오른쪽, nav 아래~하단 full height)
- [x] 패널 내 레이아웃 재설계 (2컬럼: 토큰 테이블 + 라이브 프리뷰)
- [x] 패널 닫기 후 재오픈 시 선택 상태 유지 (context state로 보존)
- [x] LabToc `footer` 슬롯에 Inspector 트리거 버튼 추가
- [x] TokenLab 기존 섹션 제거 및 트리거 연결
- [x] 전체 랩에서 트리거 → 패널 열기 동작 확인
