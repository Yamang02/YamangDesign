# Epic E03: UI Chrome Context Unification

## 목표

사이트 크롬(헤더, 푸터, 랩, 사이드패널)을 단일 라이트 고정 컨텍스트로 통합한다.
팔레트/스타일 테마는 오직 `data-context="preview"` 영역에만 적용되고,
UI 크롬 전체는 테마 변화에 무관하게 항상 명확한 가독성을 유지한다.

## 배경 / 맥락

E02에서 `data-context="lab"` (라이트 고정)과 `[data-ui]` (다크 고정) 두 컨텍스트가
병립하는 구조가 됐다. 이로 인해:

- 헤더/푸터/사이드패널은 `--ui-bg-elevated: #3d3d3d` 다크 배경을 사용하지만,
  내부 콘텐츠가 `data-ui` 없이 렌더링되면 테마의 `--ds-color-text-*`를 그대로 씀
- Lab UI는 `data-context="lab"`으로 `--ds-*` 토큰을 오버라이드하지만,
  오버라이드 목록이 불완전해 새 토큰 추가 시마다 구멍이 생김
- `[data-ui]`와 `[data-ui-light]`가 사실상 동일 목적이나 이름이 달라 혼선

근본 원인: `--ds-*` 토큰은 테마-가변인데 UI 크롬이 이를 직접 참조함.
UI 크롬의 다크 배경은 강한 설계 의도가 아니었으므로, 라이트 단일 컨텍스트로 통합한다.

## 특이점

### 단일 라이트 크롬 원칙

```
[data-ui]               → 라이트 고정 크롬 (헤더, 푸터, 랩, 패널)
data-context="preview"  → 테마 가변 (그대로 유지)
```

- `[data-ui-light]`는 `[data-ui]`의 기본값이 되므로 별도 셀렉터 불필요 → 제거
- `data-context="lab"` 오버라이드 (`LabLayout.module.css`) → `[data-ui]` 컨텍스트로 흡수
- `LabLayout`의 `data-context="lab"` → `data-ui` attribute 추가로 대체
- 기존 `data-context="preview"` 내부의 테마 복원 로직은 그대로 유지

### `--ui-*` 토큰 라이트 전환

현재 `:root`의 `--ui-*` 기본값이 다크. 이를 라이트 값으로 교체.
기존 `[data-ui-light]`의 값을 `:root`로 승격시키는 방식으로 진행.

### 헤더/푸터/네비 시각 변화

다크 → 라이트로 전환 시 헤더/푸터 배경이 밝아짐.
프리뷰 영역과의 시각적 구분은 `border-bottom` 및 `box-shadow`로 유지.

## 영향 범위

| 영역 | 대상 | 비고 |
|------|------|------|
| **크롬** | Header, HeaderNav, Footer, Navigation | 이미 `data-ui` 적용됨. P02에서 하드코딩 색상 정리 |
| **랩 레이아웃** | LabLayout, TOC | P04에서 `data-context="lab"` → `data-ui` 전환 |
| **패널** | DetailPanel | P03에서 `data-ui` 일관 적용 및 muted 대비 검증 |
| **모달** | GlobalSettingsModal, ScaleSelectionModal, SemanticMappingModal | 현재 `data-ui-light` 사용 → `data-ui`로 통일 (P03) |
| **포탈 모달** | ComponentDetailModal | `createPortal(..., document.body)` 사용. 루트에 `data-ui` 필요 (P03) |
| **Lab 내부 UI** | ThemeTabNavigation, ThemeSearchBar, ScaleSelectorPanel, ScaleStepGrid, ScaleGuide, ColorUsageDiagram, StyleOverviewDiagram, FontOverviewDiagram, LabOverview, EmptyCategory | `--lab-*` 사용. P05에서 `--ui-*`/`--ds-*`로 교체 |
| **툴팁** | Tooltip (portal 시 body 하위) | `--ui-tooltip-*` 사용. P01에서 라이트 기준 툴팁 가독성 검토 |

## 구현 순서·의존성

- **P01**에서 `[data-ui-light]` 블록을 제거하면, 해당 셀렉터를 쓰는 요소는 더 이상 DS 오버라이드를 받지 못한다. 따라서 **P01 직전 또는 P01과 동시에** `data-ui-light` 사용처(GlobalSettingsModal, ScaleSelectionModal, SemanticMappingModal)를 `data-ui`로 변경해야 한다. P03 체크리스트에 이 변경을 포함하고, P01과 P03을 같은 PR로 묶거나 순서를 맞출 것.
- **P04**에서 `[data-context="lab"]` 제거 시, 해당 블록에만 있던 `--ds-surface-*` 등 surface 토큰을 `[data-ui]`(ui-variables.css)로 이관할지 검토한다.

## Phase 목록

- [P01: `--ui-*` 토큰 라이트 기본값 전환](./P01-ui-tokens-light-default.md)
- [P02: 헤더·푸터·네비 라이트 컨텍스트 적용](./P02-header-footer-nav-light.md)
- [P03: DetailPanel·SidePanel 컨텍스트 정리](./P03-panels-context-cleanup.md)
- [P04: LabLayout `data-context="lab"` → `data-ui` 통합](./P04-lab-context-unification.md)
- [P05: `[data-ui-light]` 및 `data-context="lab"` CSS 오버라이드 제거](./P05-legacy-context-cleanup.md)

## 검토 요약 (누락·개선 반영)

- **오버레이/툴팁**: `--ui-overlay`, `--ui-tooltip-bg`, `--ui-tooltip-text`는 P01 표에 없음. 라이트 크롬에서도 딤·툴팁 가독성 유지 여부 검토 후 필요 시 값 유지 또는 미세 조정 (P01).
- **포탈 모달**: ComponentDetailModal은 `document.body`에 렌더링되므로 앱의 `[data-ui]` 트리 밖에 있음. 모달 루트(overlay 또는 .modal)에 `data-ui` 추가하여 헤더 등 크롬이 `--ui-*`를 쓰도록 함 (P03).
- **Surface 토큰**: LabLayout의 `[data-context="lab"]`에만 정의된 `--ds-surface-backdrop`, `--ds-surface-bg-alpha`, `--ds-surface-texture`, `--ds-surface-blend`, `--ds-filter`, `--ds-perspective`, `--ds-transform-style`를 P04 후 `[data-ui]`에서 제공할지 결정. 미제공 시 뉴모피즘 등 테마 전환 시 Lab 내부에 스타일 누수가 있을 수 있음 (P04).
- **--lab-* 사용처**: P05에서 제거 시 교체 대상 파일을 명시함 — ScaleStepGrid, ThemeTabNavigation, ThemeSearchBar, ScaleSelectorPanel, StyleOverviewDiagram(.tsx/.css), ColorUsageDiagram(.tsx/.css), ScaleSelectionModal(.tsx/.css), EmptyCategory, ScaleGuide, FontOverviewDiagram, LabOverview.module.css(로컬 `--lab-*` 정의 블록 포함), ColorUsageDiagram.module.css, GlobalSettingsModal.module.css(overlay만), SemanticMappingModal 등.

## 상태

- [x] P01 완료
- [x] P02 완료
- [x] P03 완료
- [x] P04 완료
- [x] P05 완료
