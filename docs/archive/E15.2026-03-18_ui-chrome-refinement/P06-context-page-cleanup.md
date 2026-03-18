# P06: Context 페이지 콘텐츠 정리

## 목표

Shell/Service Context 페이지의 과도한 설명 텍스트를 제거하고,
레이아웃 버그(description `<p>`와 콘텐츠가 flex 형제로 나란히 붙는 문제)를 해소한다.

## 구현 상세

**현재 문제:**
- `LabSection`의 `.sectionContent`가 `display: flex`이므로, 섹션 내 `<p>` 설명 텍스트와 인벤토리 그리드/테이블이 좌우로 나란히 배치됨
- 각 섹션마다 달린 설명 `<p>` 태그가 섹션 제목과 중복돼 문서처럼 보임

**접근 방법:**
- ShellContext, ServiceContext 각 섹션의 설명 `<p>` 태그를 제거
- 레이아웃 버그가 description 제거로 자연히 해소됨 (별도 CSS 수정 불필요)
- Page Preview 섹션의 description은 탭 위에 표시되므로 제거 대상에서 판단 필요

**변경 파일:**
- `src/app/pages/context/Shell/ShellContext.tsx` — Overview, Token Map, Live Preview 섹션 description `<p>` 제거
- `src/app/pages/context/Service/ServiceContext.tsx` — Overview, Token Map, Page Preview 섹션 description `<p>` 제거

## 체크리스트

- [x] ShellContext: Overview 섹션 description `<p>` 제거
- [x] ShellContext: Token Map 섹션 description `<p>` 존재 여부 확인 및 제거
- [x] ShellContext: Live Preview 섹션 description `<p>` 제거
- [x] ServiceContext: Overview 섹션 description `<p>` 제거
- [x] ServiceContext: Token Map 섹션 description `<p>` 존재 여부 확인 및 제거
- [x] ServiceContext: Page Preview 섹션 description `<p>` 제거
- [x] Overview 인벤토리 그리드가 카드 안에서 full-width로 렌더링되는지 확인
