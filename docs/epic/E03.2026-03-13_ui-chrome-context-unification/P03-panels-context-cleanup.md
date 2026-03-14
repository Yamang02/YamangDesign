# P03: DetailPanel·SidePanel 컨텍스트 정리

## 목표

`DetailPanel` 및 기타 사이드패널의 배경·텍스트가 라이트 `[data-ui]` 컨텍스트를 통해
일관되게 렌더링되도록 한다. (E02 P08에서 임시 패치한 `data-ui` + muted 조정을 구조적으로 완성)

## 배경

E02 P08에서 `DetailPanel.panelContent`에 `data-ui`를 추가하고
`--ui-text-muted`를 `#a8a8a8`로 조정했다.
P01에서 `--ui-*`가 라이트 기본값으로 바뀌면 이 임시 수치가 다시 점검 필요.

## 구현 상세

- `DetailPanel` 전체(패널 shell + panelContent)에 `data-ui` attribute 일관 적용 확인
- P01 이후 라이트 배경에서 `--ui-text-muted` 대비비 재검증
  - 라이트 배경(`#ffffff`)에서 `#d1d5db`는 대비비 ~1.6:1 → 너무 낮음
  - `--ui-text-muted` 라이트 값 재조정 필요 (예: `#6b7280` 수준)
- `ScaleSelectionModal`, `SemanticMappingModal` 등 다른 패널/모달도 동일 패턴 적용 확인
- **모달 `data-ui-light` → `data-ui` 통일**: 다음 모달의 루트(모달 콘텐츠 div)에서 `data-ui-light`를 `data-ui`로 변경. P01에서 `[data-ui-light]` 블록 제거 시 이들이 `[data-ui]` 스타일을 받도록 함.
  - `GlobalSettingsModal.tsx` — 모달 div
  - `ScaleSelectionModal.tsx` — 모달 div
  - `SemanticMappingModal.tsx` — 모달 div
- **ComponentDetailModal**: `createPortal(..., document.body)`로 body에 렌더링되므로 앱의 `[data-ui]` 트리 밖에 있음. 오버레이 또는 내부 `.modal` 래퍼에 `data-ui`를 추가하여 헤더·닫기 버튼 등 크롬이 `--ui-*` 토큰을 사용하도록 한다. 본문(`.body`)은 계속 `data-context="preview"`로 테마 적용 유지.

## 체크리스트

- [ ] `DetailPanel.tsx` — shell 전체 `data-ui` 적용 확인
- [ ] P01 이후 라이트 배경에서 muted 텍스트 대비비 검증 및 `--ui-text-muted` 재조정
- [ ] `GlobalSettingsModal`, `ScaleSelectionModal`, `SemanticMappingModal` — `data-ui-light` → `data-ui` 속성 변경
- [ ] `ComponentDetailModal` — 포탈 루트(overlay 또는 .modal)에 `data-ui` 추가
- [ ] 기타 모달/패널 컴포넌트 `data-ui` 적용 여부 일괄 점검
