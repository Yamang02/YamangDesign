# P05: TokenLab 커버리지 보완

## 목표

TokenLab 토큰 표시 영역(component-tokens.ts)이 실제 컴포넌트 CSS와 일치하도록 누락 항목을 보완하고,
검색/정렬 컨트롤 UI를 Overview 다이어그램 아래(섹션 밖)으로 분리해 레이아웃을 개선한다.

## 구현 상세

### 1. component-tokens.ts 보완 (ComponentInspector용)

E19 작업으로 `text.onAction` 분리 이후 새 variant가 추가됐지만 ComponentInspector 매핑이 미반영된 상태.

**수정 파일:** `src/domain/constants/component-tokens.ts`

- **Avatar** (신규): `primary/secondary/accent` variant별 bg + `text-on-action-primary`
- **Badge**: `secondary/accent/outline/subtle` variant 토큰 추가
- **Select** (신규): trigger bg/border/text, dropdown bg/border, option 상태 토큰

### 2. ComponentInspectorPanel에 Avatar/Select 탭 추가

`COMPONENT_ORDER`에 Avatar, Select 탭이 없어 inspecting 불가.

**수정 파일:** `src/app/components/ComponentInspector/ComponentInspectorPanel.tsx`

- COMPONENT_ORDER에 Avatar, Select 추가
- ComponentPreview에 각 컴포넌트 preview 추가

### 3. showcase-content.ts 보완 (Build 페이지 모달용)

Build > Components 모달의 "Design tokens" 섹션에서 E19 신규 토큰 미반영.

**수정 파일:** `src/app/content/showcase-content.ts`

- badge: secondary/accent text on action 토큰 추가
- button: secondary/accent hover/active/text 토큰 추가
- select: selected option text 토큰 추가

### 4. TokenLab 검색 UI 이동

현재 검색/정렬 컨트롤이 `LabOverview` 안에 포함되어 Overview 다이어그램과 묶여 있음.
→ `LabSection("Overview")` 바깥, 첫 번째 콘텐츠 섹션 위에 별도 배치.

**수정 파일:** `src/app/pages/labs/TokenLab/TokenLab.tsx`

## 체크리스트

- [x] Avatar 토큰 매핑 추가 (primary/secondary/accent bg + text on action)
- [x] Badge secondary/accent/outline/subtle variant 토큰 추가
- [x] Select 토큰 매핑 추가 (trigger, dropdown, option 상태)
- [x] ComponentInspectorPanel에 Avatar/Select 탭 및 preview 추가
- [x] showcase-content.ts badge/button/select secondary·accent 토큰 보완
- [x] TokenLab 검색/정렬 컨트롤을 Overview 섹션 밖으로 이동
