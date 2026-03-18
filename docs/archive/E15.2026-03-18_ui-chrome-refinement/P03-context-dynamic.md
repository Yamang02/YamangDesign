# P03: Shell/Service Context 동적화 & 패턴 통일

## 목표

ShellContext Overview가 config 데이터로 동적 렌더링되고,
ServiceContext가 ShellContext와 동일한 패턴(Overview + Token Map + Preview)을 따른다.

## 구현 상세

**현재 상태:**
- `ShellContext.tsx`: Overview 카드 5개(Header, HeaderNav, Navigation, NavDropdown, Footer)가 하드코딩 JSX
- `ServiceContext.tsx`: Controls(드롭박스 5개) + Page Preview 구조 — ShellContext와 다른 패턴
- Shell 컴포넌트 추가 시 Overview 수동 수정 필요

**접근 방법 — ShellContext:**
- `src/app/content/context/shell-components.ts` 신규 생성 (신규 디렉토리)
- 인벤토리 데이터(컴포넌트명, 경로, 담당 토큰 등) config로 분리
- ShellContext Overview가 config를 읽어 카드 동적 렌더링

**접근 방법 — ServiceContext:**
- Overview 섹션 추가 (서비스 레이아웃/컴포넌트 인벤토리 카드)
- Token Map 섹션 추가 (서비스 관련 토큰 매핑 테이블)
- 기존 Page Preview 섹션 유지
- **Controls 섹션(드롭박스)은 P04에서 교체 — 이 Phase에서 건드리지 않음**

## 체크리스트

- [x] `src/app/content/context/shell-components.ts` 생성 및 데이터 분리
- [x] ShellContext Overview 동적 렌더링으로 교체
- [x] Shell 컴포넌트 추가 시 Overview 자동 반영 확인
- [x] ServiceContext Overview 섹션 추가
- [x] ServiceContext Token Map 섹션 추가
- [x] ServiceContext 전체 구조가 ShellContext 패턴과 일치하는지 확인
