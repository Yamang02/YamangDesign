# P02: 헤더·푸터·네비 라이트 컨텍스트 적용

## 목표

헤더, 푸터, 네비게이션이 라이트 `[data-ui]` 컨텍스트 아래에서 올바르게 렌더링되도록 한다.
다크 배경에만 유효하던 색상 하드코딩(예: 흰색 텍스트)을 `--ui-text-*` 토큰 참조로 정리한다.

## 구현 상세

- `Header`, `HeaderNav`, `Footer` 등의 최상위 div에 `data-ui` attribute 확인 및 추가
- CSS에서 `color: #ffffff` 또는 `color: white` 하드코딩 → `color: var(--ui-text-primary)` 교체
- `background-color` 하드코딩 → `var(--ui-bg-base)` 또는 `var(--ui-bg-surface)` 교체
- 프리뷰 영역과의 시각적 구분: 헤더 하단 `border-bottom` + `box-shadow` 유지 또는 강화
- hover 스타일(`--ui-bg-hover`, `--ui-text-hover`)이 라이트 배경에서 올바른지 점검

## 체크리스트

- [ ] `Header`/`HeaderNav` — `data-ui` 확인, 하드코딩 색상 토큰화
- [ ] `Footer` (존재 시) — 동일
- [ ] `NavDropdown` 등 네비 하위 컴포넌트 — 라이트 배경 대응 hover/active 확인
- [ ] 헤더-본문 시각적 구분선 유지 확인
