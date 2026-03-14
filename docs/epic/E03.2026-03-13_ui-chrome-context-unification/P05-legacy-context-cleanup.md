# P05: 레거시 컨텍스트 코드 정리

## 목표

P01~P04 완료 후 더 이상 필요 없는 레거시 컨텍스트 코드를 제거하고,
`ui-variables.css`와 관련 CSS를 최종 정리한다.

## 구현 상세

- `ui-variables.css`에서 `[data-ui-light]` 셀렉터 블록 제거 (P01에서 이미 `:root`로 승격됨)
- `data-context="lab"` attribute가 코드베이스 어딘가 잔존하는지 grep 후 제거
- `--lab-*` 토큰 변수들 사용처를 `--ui-*` 또는 `--ds-*`로 교체한 뒤, `ui-variables.css`의 `--lab-*` 정의 제거
- `[data-context="lab"]`을 참조하는 CSS 셀렉터 전체 검색 후 잔재 정리

### `--lab-*` 사용처 (교체 대상)

| 파일 | 비고 |
|------|------|
| `ScaleStepGrid.module.css` | `--lab-text-secondary`, `--lab-border-subtle` 등 |
| `ThemeTabNavigation.module.css` | `--lab-*` 전반 |
| `ThemeSearchBar.module.css` | `--lab-*` 전반 |
| `ScaleSelectorPanel.module.css` | `--lab-*` + fallback `var(--ds-*)` |
| `ScaleSelectionModal.tsx` / `.module.css` | `--lab-*`, `--ui-overlay` |
| `SemanticMappingModal.module.css` | `--ui-*` 위주 (모달 루트는 `data-ui`로 전환됨) |
| `ScaleGuide.module.css` | `--lab-*` |
| `ColorUsageDiagram.tsx` / `.module.css` | 인라인 `var(--lab-text-primary)` 등 |
| `StyleOverviewDiagram.tsx` / `.module.css` | `--lab-*` |
| `FontOverviewDiagram.module.css` | `--lab-*` |
| `LabOverview.module.css` | **로컬 `--lab-*` 변수 정의 블록** 있음. 해당 블록 제거 후 `--ui-*` 참조로 통일 |
| `EmptyCategory.module.css` | `--lab-bg-muted`, `--lab-border-subtle`, `--lab-text-muted` |
| `GlobalSettingsModal.module.css` | `--ui-overlay`만 사용 (--lab-* 없음) |

P01 이후 `:root`가 라이트이므로 `[data-ui]` 내부에서는 `--ui-*`가 이미 라이트 값. 위 파일들에서 `--lab-*`를 `--ui-*`(또는 적절한 `--ds-*`)로 치환하면 된다.

## 체크리스트

- [ ] `[data-ui-light]` 셀렉터 잔재 grep 후 제거
- [ ] `data-context="lab"` attribute 잔재 grep 후 제거
- [ ] 위 표의 파일에서 `--lab-*` → `--ui-*`/`--ds-*` 교체
- [ ] `LabOverview.module.css` 로컬 `--lab-*` 정의 블록 제거 후 `--ui-*` 참조로 변경
- [ ] `ui-variables.css`에서 `--lab-*` 정의 제거 (P01에서 `[data-ui-light]` 제거 시 함께 정리될 수 있음; 단 사용처 교체 완료 후)
- [ ] 전체 Lab + 크롬 최종 시각 점검
