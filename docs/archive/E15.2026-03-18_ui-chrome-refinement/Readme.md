# Epic E15: UI Chrome Refinement

## 목표

앱 전반의 UI 크롬(네비게이션, 컨트롤, 인스펙터, 컨텍스트 페이지)을 정비한다.
Nav 메뉴 아이콘+텍스트 일관성 확보, Component Inspector 전역화,
Shell/Service context 동적화, 프리뷰 컨트롤 UI 현대화가 목표다.

## 배경 / 맥락

E14(Lab UI 통일)에서 각 랩의 내부 섹션 UI를 통일했으나,
앱 크롬 레벨(네비게이션, 전역 패널, 컨텍스트 페이지)은 미정비 상태로 남아 있다.

- Nav 메뉴 일부 항목에 아이콘이 렌더링되지 않음 (icon 이름이 라이브러리에 없음)
- Component Inspector가 TokenLab에만 내장되어 다른 랩에서 접근 불가
- ShellContext Overview가 하드코딩 JSX라 컴포넌트 추가 시 수동 수정 필요
- ServiceContext가 ShellContext와 다른 구조 사용
- Build/Palette/Style 등의 프리뷰 컨트롤이 구식 드롭박스 방식

## 특이점

- **P01**: 아이콘 이름 감사가 선행 작업. 라이브러리에 존재하는 유효한 이름으로 교체해야 렌더링됨
- **P02**: ComponentInspector 전역화는 React Context 신규 추가 (`InspectorContext`). 트리거는 LabToc footer 슬롯 하단 버튼, 패널은 TOC 오른쪽 좌측 고정 overlay (nav 아래~하단 full height, 우측 DetailPanel과 반대쪽)
- **P03 → P04 경계**: ServiceContext의 Controls 섹션(드롭박스)은 P03에서 건드리지 않고 P04에서 PreviewControlPanel로 교체
- **P02 + P04 연계**: LabToc footer 슬롯을 공유하므로 P04에서 PreviewControlPanel 트리거도 동일 슬롯 활용 가능

## Phase 목록

- [P01: Nav 아이콘+텍스트 일관성 정비](./P01-nav-icon-text.md)
- [P02: Component Inspector 전역 플로팅 패널](./P02-component-inspector-global.md)
- [P03: Shell/Service Context 동적화 & 패턴 통일](./P03-context-dynamic.md)
- [P04: 프리뷰 컨트롤 패널 UI 교체](./P04-preview-control-panel.md)
- [P05: Lab 섹션 카드 레이아웃 일관화](./P05-lab-section-card-layout.md)
- [P06: Context 페이지 콘텐츠 정리](./P06-context-page-cleanup.md)
- [P07: 컴포넌트 토큰 주석 감사 & Inventory 데이터 검증](./P07-token-inventory-audit.md)

## 상태

- [x] P01 완료
- [x] P02 완료
- [x] P03 완료
- [x] P04 완료
- [x] P05 완료
- [x] P06 완료
- [x] P07 완료

## 완료
아카이브일: 2026-03-18
